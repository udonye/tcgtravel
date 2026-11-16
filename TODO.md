# TCG Trips delivery outcomes

## Premium travel homepage and brand direction
- [ ] Build a premium flight and hotel booking website called TCG Trips.
- [ ] Use a purple visual background system across the homepage.
- [ ] Include 3D-style motion and an animated slideshow on the homepage.
- [ ] Make the homepage visibly feature NYC, Singapore, and premium flight travel scenes associated with Qatar Airways and Delta Air Lines.
- [ ] Make “Book now, pay later” the primary premium perk and conversion message.

## Search and discovery experience
- [ ] Provide flight search with trip type, origin, destination, dates, passengers, and cabin class controls.
- [ ] Provide hotel search with destination, stay dates, guests, rooms, sorting, filtering, and property detail affordances.
- [ ] Provide combined booking review UI with itinerary details, traveler information, price breakdown, and confirmation pathway.

## Checkout and account choice
- [ ] Keep account registration optional.
- [ ] Provide a clearly visible checkout-as-guest path.
- [ ] Provide optional Google account sign-in entrypoint without blocking guest checkout.
- [ ] Provide secure Stripe checkout architecture for eligible book-now-pay-later options.
- [ ] Keep payment status and the booking review state visible to the customer.

## Secure integration architecture
- [ ] Keep Google OAuth, Stripe, Vonage, and SendGrid credentials server-side through protected secrets or runtime configuration.
- [ ] Structure the app for booking confirmations, itinerary updates, payment notices, and travel alerts by email and text when those providers are configured.

## Delivery
- [ ] Serve the complete route set through `public/manus-routes.json`.
- [ ] Keep TypeScript diagnostics clean and save the delivered change as a canonical checkpoint.
