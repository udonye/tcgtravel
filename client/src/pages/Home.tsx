import { useMemo, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Filter,
  Globe2,
  Headphones,
  Hotel,
  LockKeyhole,
  Menu,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { startLogin } from "@/const";

type SearchMode = "flights" | "stays";
type TripType = "Round trip" | "One way" | "Multi-city";

type Slide = {
  eyebrow: string;
  title: string;
  location: string;
  detail: string;
  image: string;
  accent: string;
};

const slides: Slide[] = [
  {
    eyebrow: "THE CITY THAT NEVER STOPS",
    title: "New York,\nbeautifully timed.",
    location: "New York · JFK",
    detail: "From $329 · 4h 38m",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031758143/jMOCPytuSuxKqWgW.webp",
    accent: "#d9c7ff",
  },
  {
    eyebrow: "A SOFTER SIDE OF THE FUTURE",
    title: "Singapore,\nwith room to exhale.",
    location: "Singapore · SIN",
    detail: "From $612 · 18h 05m",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031758143/IMpHVRSixPUfgGGj.webp",
    accent: "#b3e7dc",
  },
  {
    eyebrow: "TRAVEL, ELEVATED",
    title: "The journey\nis part of it.",
    location: "First class · Worldwide",
    detail: "Split your stay from $89/mo",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031758143/JrSTdjEsdMfqFNZh.webp",
    accent: "#f1d79e",
  },
];

const flightResults = [
  { airline: "Delta Air Lines", mark: "Δ", route: "JFK → LAX", time: "08:40 — 12:05", duration: "6h 25m", price: "$289", badge: "Best value", color: "blue" },
  { airline: "Qatar Airways", mark: "QA", route: "JFK → DOH", time: "21:35 — 16:20", duration: "12h 45m", price: "$641", badge: "Premium pick", color: "plum" },
  { airline: "Delta Air Lines", mark: "Δ", route: "LGA → ORD", time: "10:15 — 11:54", duration: "2h 39m", price: "$174", badge: "Flexible fare", color: "sky" },
];

const hotelResults = [
  { name: "The Langham, New York", area: "Fifth Avenue · Manhattan", rating: "4.9", price: "$318", nights: "per night", image: slides[0].image, tag: "Member favorite" },
  { name: "The Fullerton Bay Hotel", area: "Marina Bay · Singapore", rating: "4.8", price: "$241", nights: "per night", image: slides[1].image, tag: "Quiet luxury" },
  { name: "Park Hyatt New York", area: "Central Park South", rating: "4.7", price: "$405", nights: "per night", image: slides[2].image, tag: "Pay over time" },
];

const footerContent = {
  discover: { kicker: "EXPLORE", title: "Find your next\nbeautiful detour.", body: "Browse destination inspiration, thoughtful itineraries, and the places our travelers are talking about right now.", bullets: ["City guides for New York, Singapore, and beyond", "Curated trips for weekends, resets, and big celebrations", "Fresh inspiration added every season"] },
  flights: { kicker: "EXPLORE", title: "The right flight\nchanges everything.", body: "Compare handpicked routes from trusted airline partners, with clear fares and flexible options when available.", bullets: ["Delta Air Lines and Qatar Airways featured routes", "Round trip, one way, and multi-city searches", "Transparent pricing with no hidden fees"] },
  stays: { kicker: "EXPLORE", title: "Stay somewhere\nworth remembering.", body: "From skyline suites to quiet design hotels, find a stay that gives the destination more room to work its magic.", bullets: ["Premium hotels in 190+ countries", "Member-favorite and quiet-luxury picks", "Flexible cancellation on select stays"] },
  help: { kicker: "SUPPORT", title: "A little help\nwhen you need it.", body: "Our travel support team is here before takeoff, while you are away, and when you are ready for the next trip.", bullets: ["Booking and itinerary questions", "Changes, cancellations, and travel guidance", "Human support for the details that matter"] },
  cancellation: { kicker: "SUPPORT", title: "Plans change.\nThat is travel.", body: "Cancellation terms vary by fare, hotel, and provider. We always show the applicable policy before you confirm a booking.", bullets: ["Review the fare or room rules before payment", "Eligible flexible bookings may be changed or canceled", "Contact support if your plans change unexpectedly"] },
  contact: { kicker: "SUPPORT", title: "Let’s make\nit easier.", body: "Reach the TCG Trips team for booking questions, itinerary help, or anything that would make your next journey smoother.", bullets: ["Phone: 2252280014", "Email: booking@tcgtrips.com", "Typical response: within one business day"] },
  pay: { kicker: "THE TRIPS PERK", title: "Book now.\nPay gently.", body: "Eligible bookings can be split into flexible payments so you can reserve the trip you want without putting the whole balance on today.", bullets: ["Choose an available plan at secure checkout", "No interest and no late fees when paid on time", "Eligibility and terms are shown before payment"] },
  alerts: { kicker: "TRAVEL CARE", title: "Always one step\nahead.", body: "Travel alerts keep the important details close, from schedule changes to reminders that help a good trip stay that way.", bullets: ["Flight time and gate updates when available", "Booking confirmations and itinerary reminders", "Helpful notices sent to your selected contact details"] },
  terms: { kicker: "GOOD TO KNOW", title: "Clear terms.\nRespectful privacy.", body: "We keep the experience simple: transparent booking terms, secure payments, and customer information handled with care.", bullets: ["Provider-specific fare and cancellation terms apply", "Payment details are handled by secure checkout providers", "Your contact information is used to support your booking"] },
} as const;

type FooterKey = keyof typeof footerContent;

function Field({ label, value, icon, onClick }: { label: string; value: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="search-field" type="button" onClick={onClick}>
      <span className="field-icon">{icon}</span>
      <span className="field-copy">
        <span className="field-label">{label}</span>
        <span className="field-value">{value}</span>
      </span>
      <ChevronDown size={15} strokeWidth={1.7} className="field-chevron" />
    </button>
  );
}

function AppMark() {
  return (
    <span className="app-mark" aria-hidden="true">
      <span className="mark-orbit orbit-one" />
      <span className="mark-orbit orbit-two" />
      <span className="mark-core">T</span>
    </span>
  );
}

function Chip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={`chip ${active ? "active" : ""}`} onClick={onClick}>{children}</button>;
}

function FooterLink({ target, label, onOpen }: { target: FooterKey; label: string; onOpen: (key: FooterKey) => void }) {
  return <a href={`#footer-${target}`} className="footer-link" onClick={(event) => { event.preventDefault(); onOpen(target); }}>{label}</a>;
}

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchMode>("flights");
  const [tripType, setTripType] = useState<TripType>("Round trip");
  const [showAccount, setShowAccount] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [paymentPlan, setPaymentPlan] = useState("4 monthly payments");
  const [customerEmail, setCustomerEmail] = useState("");
  const [travelerName, setTravelerName] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");
  const [activeFooter, setActiveFooter] = useState<FooterKey | null>(null);

  const slide = slides[slideIndex];
  const resultCount = searchMode === "flights" ? flightResults.length : hotelResults.length;

  const nextSlide = () => setSlideIndex((current) => (current + 1) % slides.length);
  const prevSlide = () => setSlideIndex((current) => (current - 1 + slides.length) % slides.length);

  const activeResults = useMemo(() => searchMode === "flights" ? flightResults : hotelResults, [searchMode]);

  const handleSearch = () => {
    setSearched(true);
    window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const chooseResult = (name: string) => {
    setSelectedResult(name);
    setShowCheckout(true);
  };

  const openFooter = (key: FooterKey) => setActiveFooter(key);

  const handleSecureCheckout = async () => {
    setCheckoutStatus("loading");
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerEmail,
          customerName: travelerName,
          itinerary: selectedResult || "New York to Los Angeles",
          paymentPlan,
        }),
      });
      const payload = await response.json() as { url?: string };
      if (!response.ok || !payload.url) throw new Error("Checkout is unavailable");
      window.location.href = payload.url;
    } catch {
      setCheckoutStatus("error");
    }
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TCG Trips home">
          <AppMark />
          <span className="brand-type"><strong>TCG</strong><span>TRIPS</span></span>
        </a>
        <nav className={`nav-links ${navOpen ? "open" : ""}`}>
          <a href="#discover" onClick={() => setNavOpen(false)}>Discover</a>
          <a href="#results" onClick={() => setNavOpen(false)}>Flights</a>
          <a href="#stays" onClick={() => setNavOpen(false)}>Stays</a>
          <a href="#perks" onClick={() => setNavOpen(false)}>Our perks</a>
        </nav>
        <div className="top-actions">
          <button type="button" className="icon-button help-button" aria-label="Help"><CircleHelp size={18} /></button>
          <button type="button" className="account-button" onClick={() => setShowAccount(true)}><UserRound size={16} /> <span>Sign in</span></button>
          <button type="button" className="menu-button" onClick={() => setNavOpen((open) => !open)} aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="discover">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> TAKE THE LONG WAY, ON PURPOSE</div>
            <h1>Make room for<br /><em>more.</em></h1>
            <p className="hero-lede">Your next great story starts with the right flight, the right stay, and a little more breathing room in your budget.</p>
            <div className="hero-proof"><span className="proof-avatars"><span>AM</span><span>JY</span><span>+</span></span><span><strong>4.9/5</strong> from 18k travelers</span></div>
          </div>

          <div className="hero-stage" style={{ "--slide-accent": slide.accent } as React.CSSProperties}>
            <div className="stage-orbit orbit-back" />
            <div className="stage-orbit orbit-front" />
            <div className="hero-image-wrap">
              <img className="hero-image" src={slide.image} alt={slide.location} />
              <div className="image-sheen" />
              <div className="image-caption"><span>{slide.eyebrow}</span><strong>{slide.location}</strong></div>
              <div className="image-count">0{slideIndex + 1}<span>/ 03</span></div>
            </div>
            <div className="floating-route route-one"><Plane size={14} /><span>JFK — LAX</span><strong>06h 25m</strong></div>
            <div className="floating-route route-two"><span className="mini-flight-mark">TC</span><span>Next stop</span><strong>{slideIndex === 0 ? "New York" : slideIndex === 1 ? "Singapore" : "The sky"}</strong></div>
            <div className="stage-controls"><button onClick={prevSlide} type="button" aria-label="Previous slide"><ChevronLeft size={17} /></button><button onClick={nextSlide} type="button" aria-label="Next slide"><ChevronRight size={17} /></button></div>
          </div>

          <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
        </section>

        <section className="search-panel-wrap" aria-label="Search flights and stays">
          <div className="search-panel">
            <div className="search-tabs-row">
              <div className="search-tabs"><button type="button" className={searchMode === "flights" ? "active" : ""} onClick={() => { setSearchMode("flights"); setSearched(false); }}><Plane size={16} /> Flights</button><button type="button" className={searchMode === "stays" ? "active" : ""} onClick={() => { setSearchMode("stays"); setSearched(false); }}><Hotel size={16} /> Stays</button></div>
              <button type="button" className="search-quiet-action" onClick={() => setShowFilters(true)}><Filter size={15} /> More filters</button>
            </div>
            {searchMode === "flights" && <div className="trip-type-row">{(["Round trip", "One way", "Multi-city"] as TripType[]).map((type) => <button key={type} type="button" className={tripType === type ? "selected" : ""} onClick={() => setTripType(type)}>{type}</button>)}</div>}
            <div className="field-grid">
              <Field label={searchMode === "flights" ? "Flying from" : "Where to?"} value={searchMode === "flights" ? "New York (JFK)" : "Singapore, SG"} icon={searchMode === "flights" ? <Plane size={16} /> : <Globe2 size={16} />} />
              <Field label={searchMode === "flights" ? "Flying to" : "Check-in — Check-out"} value={searchMode === "flights" ? "Los Angeles (LAX)" : "Oct 18 — Oct 22"} icon={searchMode === "flights" ? <Globe2 size={16} /> : <CalendarDays size={16} />} />
              <Field label={searchMode === "flights" ? "Departure — Return" : "Guests & rooms"} value={searchMode === "flights" ? "Oct 18 — Oct 25" : "2 guests · 1 room"} icon={searchMode === "flights" ? <CalendarDays size={16} /> : <UsersRound size={16} />} />
              <Field label={searchMode === "flights" ? "Travelers" : "Stay style"} value={searchMode === "flights" ? "1 adult · Economy" : "Any room type"} icon={searchMode === "flights" ? <UsersRound size={16} /> : <Sparkles size={16} />} />
              <button type="button" className="search-submit" onClick={handleSearch}><Search size={19} /><span>Search {searchMode}</span></button>
            </div>
            <div className="search-footnote"><span><ShieldCheck size={14} /> No hidden fees</span><span><LockKeyhole size={14} /> Flexible cancellation on select fares</span><button type="button" onClick={() => setShowCheckout(true)}>Pay over time available <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <section className="story-section" id="perks">
          <div className="section-label"><span>01</span><span className="label-rule" /><span>WHY TRIPS</span></div>
          <div className="story-grid">
            <div className="story-headline"><h2>Premium travel<br /><em>without the pause.</em></h2><p>Book the trip you want today. Pay for it in a way that fits the life you actually live.</p><button type="button" className="text-link" onClick={() => setShowCheckout(true)}>See how it works <ArrowRight size={16} /></button></div>
            <div className="perk-card perk-card-featured"><div className="perk-glow" /><div className="perk-top"><span className="perk-number">01</span><span className="perk-icon"><Zap size={19} /></span></div><h3>Book now.<br />Pay later.</h3><p>Split your booking into four interest-free payments at checkout — no awkward calls, no compromise itinerary.</p><div className="perk-price"><strong>4 × $89</strong><span>instead of $356 today</span></div></div>
            <div className="perk-stack"><div className="perk-card compact"><div className="perk-top"><span className="perk-number">02</span><span className="perk-icon"><Headphones size={18} /></span></div><h3>Human help,<br />on the way.</h3><p>Real travel support before, during, and after takeoff.</p></div><div className="perk-card compact alt"><div className="perk-top"><span className="perk-number">03</span><span className="perk-icon"><Bell size={18} /></span></div><h3>Always one step<br />ahead.</h3><p>Flight changes, gate updates, and tiny reminders that make a difference.</p></div></div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="editorial-copy"><div className="section-label"><span>02</span><span className="label-rule" /><span>CURATED FOR YOU</span></div><h2>Go somewhere<br /><em>that changes you.</em></h2><p>Not just a destination. A different pace, a new table, a better story to tell when you get home.</p><div className="editorial-controls"><button type="button" onClick={prevSlide}><ChevronLeft size={17} /></button><button type="button" onClick={nextSlide}><ChevronRight size={17} /></button><span>0{slideIndex + 1} / 03</span></div></div>
          <div className="editorial-cards"><button className={`editorial-card ${slideIndex === 0 ? "selected" : ""}`} type="button" onClick={() => setSlideIndex(0)}><img src={slides[0].image} alt="New York skyline" /><span className="card-overlay" /><span className="editorial-card-copy"><span>THE CLASSIC</span><strong>New York</strong><small>48 neighborhoods, one unforgettable week</small></span></button><button className={`editorial-card ${slideIndex === 1 ? "selected" : ""}`} type="button" onClick={() => setSlideIndex(1)}><img src={slides[1].image} alt="Singapore skyline" /><span className="card-overlay" /><span className="editorial-card-copy"><span>THE RESET</span><strong>Singapore</strong><small>Future-facing, soul-soothing</small></span></button><button className={`editorial-card ${slideIndex === 2 ? "selected" : ""}`} type="button" onClick={() => setSlideIndex(2)}><img src={slides[2].image} alt="Premium cabin" /><span className="card-overlay" /><span className="editorial-card-copy"><span>THE UPGRADE</span><strong>First class</strong><small>Because the journey counts too</small></span></button></div>
        </section>

        <section className={`results-section ${searched ? "visible" : ""}`} id="results">
          <div className="results-heading"><div><div className="section-label"><span>03</span><span className="label-rule" /><span>{searchMode === "flights" ? "FLIGHT PICKS" : "STAY PICKS"}</span></div><h2>{searched ? "A few good options." : "Your next move, made easy."}</h2></div><div className="results-heading-actions"><span className="result-meta"><strong>{resultCount}</strong> handpicked results</span><button type="button" className="filter-button" onClick={() => setShowFilters(true)}><Filter size={15} /> Filter & sort</button></div></div>
          <div className="results-grid">{searchMode === "flights" ? flightResults.map((result) => <article className={`result-card ${selectedResult === result.airline ? "chosen" : ""}`} key={`${result.airline}-${result.route}`}><div className={`airline-mark ${result.color}`}>{result.mark}</div><div className="result-main"><div className="result-card-top"><span className="result-tag">{result.badge}</span><span className="result-rating"><Star size={13} fill="currentColor" /> 4.8</span></div><h3>{result.airline}</h3><p>{result.route}</p><div className="route-line"><strong>{result.time}</strong><span /><small>{result.duration} · nonstop</small></div></div><div className="result-price"><span>from</span><strong>{result.price}</strong><small>one way</small><button type="button" onClick={() => chooseResult(result.airline)}>Select <ArrowRight size={14} /></button></div></article>) : hotelResults.map((result) => <article className={`hotel-result-card ${selectedResult === result.name ? "chosen" : ""}`} key={result.name}><div className="hotel-result-image"><img src={result.image} alt={result.name} /><span>{result.tag}</span></div><div className="hotel-result-body"><div><h3>{result.name}</h3><p>{result.area}</p></div><span className="result-rating"><Star size={13} fill="currentColor" /> {result.rating}</span><div className="hotel-result-bottom"><span><strong>{result.price}</strong> {result.nights}</span><button type="button" onClick={() => chooseResult(result.name)}>View stay <ArrowRight size={14} /></button></div></div></article>)}</div>
        </section>

        <section className="trust-strip" id="stays"><div><span className="trust-icon"><CreditCard size={18} /></span><span><strong>Pay on your terms</strong><small>Flexible plans on eligible trips</small></span></div><div><span className="trust-icon"><ShieldCheck size={18} /></span><span><strong>Your trip, protected</strong><small>Secure payments and transparent pricing</small></span></div><div><span className="trust-icon"><Globe2 size={18} /></span><span><strong>Anywhere worth going</strong><small>Flights and stays in 190+ countries</small></span></div><div><span className="trust-icon"><Ticket size={18} /></span><span><strong>One easy itinerary</strong><small>Everything together, beautifully simple</small></span></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><a className="brand" href="#top"><AppMark /><span className="brand-type"><strong>TCG</strong><span>TRIPS</span></span></a><p>Travel well. Pay gently.<br />Remember everything.</p></div><div className="footer-links"><div><span>Explore</span><FooterLink target="discover" label="Discover" onOpen={openFooter} /><FooterLink target="flights" label="Flights" onOpen={openFooter} /><FooterLink target="stays" label="Stays" onOpen={openFooter} /></div><div><span>Support</span><FooterLink target="help" label="Help center" onOpen={openFooter} /><FooterLink target="cancellation" label="Cancellation" onOpen={openFooter} /><FooterLink target="contact" label="Contact us" onOpen={openFooter} /></div><div><span>Good to know</span><FooterLink target="pay" label="Pay over time" onOpen={openFooter} /><FooterLink target="alerts" label="Travel alerts" onOpen={openFooter} /><FooterLink target="terms" label="Terms & privacy" onOpen={openFooter} /></div></div><div className="footer-bottom"><span>© 2026 TCG Trips</span><span>Made for the long way around.</span></div></footer>

      {activeFooter && <div className="modal-backdrop" role="presentation" onClick={() => setActiveFooter(null)}><div id={`footer-${activeFooter}`} className="modal info-modal" role="dialog" aria-modal="true" aria-label={footerContent[activeFooter].title.replace("\n", " ")} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setActiveFooter(null)} aria-label="Close"><X size={18} /></button><span className="modal-kicker">{footerContent[activeFooter].kicker}</span><h2>{footerContent[activeFooter].title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}<em>{line}</em></span>)}</h2><p>{footerContent[activeFooter].body}</p><ul className="info-list">{footerContent[activeFooter].bullets.map((bullet) => <li key={bullet}><Check size={14} /> <span>{bullet}</span></li>)}</ul>{activeFooter === "contact" && <div className="contact-actions"><a href="tel:2252280014" className="guest-button">Call 2252280014 <ArrowRight size={16} /></a><a href="mailto:booking@tcgtrips.com" className="google-button">Email booking@tcgtrips.com <ArrowRight size={16} /></a></div>}<button type="button" className="text-link info-close-link" onClick={() => setActiveFooter(null)}>Close panel <X size={15} /></button></div></div>}

      {showAccount && <div className="modal-backdrop" role="presentation" onClick={() => setShowAccount(false)}><div className="modal account-modal" role="dialog" aria-modal="true" aria-label="Sign in" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowAccount(false)} aria-label="Close"><X size={18} /></button><div className="modal-kicker"><AppMark /> YOUR WAY IN</div><h2>Keep your trips<br /><em>in one place.</em></h2><p>Sign in for faster checkout and saved itineraries, or keep going as a guest. Either way, your booking is safe with us.</p><button type="button" className="google-button" onClick={() => { try { startLogin(); } catch { setShowAccount(false); } }}><span className="google-g">G</span> Continue with Google <ArrowRight size={16} /></button><div className="modal-divider"><span>or</span></div><button type="button" className="guest-button" onClick={() => { setShowAccount(false); setShowCheckout(true); }}>Continue as guest <ArrowRight size={16} /></button><small className="modal-fineprint"><LockKeyhole size={12} /> You can always create an account after booking.</small></div></div>}

      {showCheckout && <div className="modal-backdrop" role="presentation" onClick={() => setShowCheckout(false)}><div className="modal checkout-modal" role="dialog" aria-modal="true" aria-label="Book now pay later checkout" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowCheckout(false)} aria-label="Close"><X size={18} /></button><div className="checkout-header"><div><span className="modal-kicker">{selectedResult ? "YOUR TRIP, YOUR TERMS" : "THE TRIPS PERK"}</span><h2>Book now.<br /><em>Pay gently.</em></h2></div><div className="checkout-lock"><LockKeyhole size={15} /> Secure checkout</div></div><div className="checkout-trip"><div className="checkout-trip-icon"><Plane size={19} /></div><div><strong>{selectedResult || "New York to Los Angeles"}</strong><span>Oct 18 — Oct 25 · 1 traveler · Economy</span></div><span className="checkout-total">$356</span></div><div className="plan-picker"><span className="plan-title">Choose your payment plan</span><div className="plan-options"><button type="button" className={paymentPlan === "4 monthly payments" ? "active" : ""} onClick={() => setPaymentPlan("4 monthly payments")}><strong>4 × $89</strong><span>Every 2 weeks</span></button><button type="button" className={paymentPlan === "Pay in 30 days" ? "active" : ""} onClick={() => setPaymentPlan("Pay in 30 days")}><strong>$356</strong><span>Pay in 30 days</span></button></div><small><Check size={13} /> No interest · No late fees when paid on time</small></div><div className="checkout-fields"><label>Email for confirmation<input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="you@example.com" /></label><label>Traveler name<input type="text" value={travelerName} onChange={(event) => setTravelerName(event.target.value)} placeholder="Full name" /></label></div>{checkoutStatus === "error" && <p className="checkout-error">We couldn't open the payment window yet. Check the booking details and try once more.</p>}<button type="button" className="checkout-submit" onClick={handleSecureCheckout} disabled={checkoutStatus === "loading"}>{checkoutStatus === "loading" ? "Opening secure checkout…" : "Continue securely"} {checkoutStatus !== "loading" && <ArrowRight size={17} />}</button><p className="checkout-footnote"><ShieldCheck size={13} /> You’ll review everything before any payment is made.</p></div></div>}

      {showFilters && <div className="modal-backdrop" role="presentation" onClick={() => setShowFilters(false)}><div className="modal filter-modal" role="dialog" aria-modal="true" aria-label="Filters" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowFilters(false)} aria-label="Close"><X size={18} /></button><span className="modal-kicker">MAKE IT YOURS</span><h2>Fine-tune the<br /><em>good stuff.</em></h2><div className="filter-group"><span>Price range</span><div className="price-range"><span>$120</span><div className="range-track"><i /><b /><i /></div><span>$1,200+</span></div></div><div className="filter-group"><span>Nonstop only</span><button type="button" className="toggle active"><i /></button></div><div className="filter-group"><span>Flexible cancellation</span><button type="button" className="toggle"><i /></button></div><div className="filter-group"><span>Sort by</span><div className="sort-chips"><Chip active>Recommended</Chip><Chip>Lowest price</Chip><Chip>Shortest trip</Chip></div></div><button type="button" className="checkout-submit" onClick={() => setShowFilters(false)}>Show {resultCount} results <ArrowRight size={17} /></button></div></div>}
    </div>
  );
}
