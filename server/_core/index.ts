import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Stripe sends signed raw request bytes. Keep this route ahead of JSON parsing.
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.header("stripe-signature");
    if (!secret || !signature || !Buffer.isBuffer(req.body)) return res.status(400).json({ error: "Invalid webhook request" });
    const values = Object.fromEntries(signature.split(",").map((part) => part.split("="))) as Record<string, string>;
    const timestamp = values.t;
    const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${req.body.toString("utf8")}`).digest("hex");
    const provided = Buffer.from(values.v1 || "");
    if (!timestamp || provided.length !== Buffer.byteLength(expected) || !crypto.timingSafeEqual(Buffer.from(expected), provided)) return res.status(400).json({ error: "Invalid webhook signature" });
    try {
      const event = JSON.parse(req.body.toString("utf8")) as { type?: string };
      if (event.type === "checkout.session.completed") console.info("[Stripe] checkout.session.completed received");
      return res.json({ received: true });
    } catch {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }
  });
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  app.post("/api/checkout/session", async (req, res) => {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return res.status(503).json({ error: "Checkout is not configured" });
    const origin = req.get("origin") || `${req.protocol}://${req.get("host")}`;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${origin}/?checkout=success`);
    params.set("cancel_url", `${origin}/?checkout=cancelled`);
    params.set("allow_promotion_codes", "true");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][unit_amount]", "35600");
    params.set("line_items[0][price_data][product_data][name]", req.body?.itinerary || "TCG Trips trip");
    params.set("line_items[0][price_data][product_data][description]", `TCG Trips · ${req.body?.paymentPlan || "Flexible payment plan"}`);
    params.set("line_items[0][quantity]", "1");
    if (typeof req.body?.customerEmail === "string" && req.body.customerEmail.includes("@")) params.set("customer_email", req.body.customerEmail);
    params.set("metadata[itinerary]", String(req.body?.itinerary || "TCG Trips trip").slice(0, 500));
    params.set("metadata[payment_plan]", String(req.body?.paymentPlan || "Flexible payment plan").slice(0, 100));
    try {
      const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const data = await stripeResponse.json() as { url?: string; error?: { message?: string } };
      if (!stripeResponse.ok || !data.url) {
        console.error("[Stripe] Checkout provider rejected the session", data.error?.message || "unknown provider error");
        return res.status(502).json({ error: "Unable to create secure checkout" });
      }
      return res.json({ url: data.url });
    } catch (error) {
      console.error("[Stripe] Checkout session failed", error instanceof Error ? error.message : "unknown error");
      return res.status(502).json({ error: "Unable to create secure checkout" });
    }
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
