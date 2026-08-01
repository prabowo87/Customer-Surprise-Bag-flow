# Good Again – Product & UX Review

**🎯 Target MVP:** [https://good-again-app.lovable.app](https://good-again-app.lovable.app)

Hey! After playing around with the MVP and thinking about typical user flows for surplus food apps, I've put together a list of 10 UX and usability areas we could improve. I've ranked them by priority, focusing first on things that might block a user from actually making a purchase.

**⚠️ Priority based on the Indonesian market:** **Dietary filters** is the **#1 blocker** (halal is non-negotiable for most of the market), followed by **Checkout friction** at **#2** (the biggest point of lost sales). **Map view** ranks lower since users can still complete purchases without it.

### 1. We need Dietary Preference Filters (High Priority) — Top Blocker for Indonesia
**The problem:** On Discover, the only quick filters are food categories (`All · Restaurants · Bakeries · Groceries · Health & Lifestyle · Cafes · Fast Food`) — there's no dietary filter anywhere. The Search page's filter list has the same categories (plus distance/price/discount), but still no Halal, Vegan, or Vegetarian option. For the Indonesian market, where the majority is Muslim, halal isn't a preference — it's a purchase requirement. A user who needs halal can't tell which merchants are safe, so they can't confidently buy, and will likely abandon the app for one that makes this clear. Filters aren't multi-select either, so even category browsing is limited.
**The fix:** Let's add some quick-tap filter pills on the home page for "Halal", "Vegetarian", etc.
**How to implement:**
- Add a filter-pill row on Discover: `All · Halal · Vegetarian · Vegan` (combinable with the existing category pills).
- Tag all merchants & bags in the backend with dietary attributes + halal certification status — this is the most important prerequisite.
- Add the same dietary filters on the `/search` page (alongside distance/price/category filters).
- Show badges like "Halal ✓" on merchant cards and the merchant detail page so users trust the filtered results.
- Make the filters multi-select (e.g. Halal + Vegetarian).
**Source:** [Discover](https://good-again-app.lovable.app/discover) · [Search & Filters](https://good-again-app.lovable.app/search)
**Ref:** [UX Collective – Food Allergies: When Search UX Becomes Dangerous](https://uxdesign.cc/food-allergies-when-search-ux-becomes-dangerous-12d4302aa6dd)

### 2. Checkout Friction (High Priority)
**The problem:** The checkout flow stacks several steps before the Confirm button. On `/checkout/:id` the user has to choose Pickup vs Delivery, review the Order Summary, optionally enter a Promo/Voucher code, then select a payment method (Good Again Pay, Bank Transfer, E-Wallet, Credit/Debit Card) before finally tapping Confirm Order. It then jumps to `/pay/confirm`, where the amount, notes, and payment method are asked again. Every extra field or tap is a drop-off point — especially on mobile, where typing is slow and errors are common. Industry data (Baymard) shows 70%+ of carts are abandoned, and each added step multiplies that risk. This is the final gate before a sale, so friction here directly costs revenue.
**The fix:** Since we're targeting Indonesia, deeply integrating quick e-wallets (GoPay, OVO) or one-click checkouts will be crucial.
**How to implement:**
- Preselect defaults: **Pickup** mode and the last-used payment method (don't make users choose again).
- Move optional fields (Order Notes, Send as a Gift, Request Cutlery, Promo) into a collapsible **"Optional"** section below the Confirm button.
- Turn the Order Summary into a compact sticky bar (item + total) instead of a section you have to scroll past.
- Integrate GoPay/OVO with tokenization → one-tap payment, no re-entering details.
- Add a **"Repeat Order"** button on the Orders page → straight to payment for returning users.
**Source:** [Checkout](https://good-again-app.lovable.app/checkout/2)
**Ref:** [Baymard Institute – Cart Abandonment Rate Statistics](https://baymard.com/lists/cart-abandonment-rate)

### 3. What exactly is in a "Surprise Bag"? (High Priority)
**The problem:** Bags are sold blind. The merchant detail page lists products like "Surprise Bag – 12pc Sushi" with only a one-line description ("12 pieces of mixed nigiri and maki, chef's selection") — no indication of typical contents, portion size, or value. For first-time users, buying a mystery bag feels risky: they don't know what they'll get, whether it fits their diet or family size, or whether it's worth the price. This hesitation is a direct barrier to the first purchase, and it's worse for new users who haven't learned to trust the concept yet.
**The fix:** A short subtitle like "Assorted pastries from today's batch" or a little tooltip explaining the concept would go a long way in building trust.
**How to implement:**
- Add a descriptive subtitle to every bag on the merchant page, e.g. "4–6 assorted pastries from today's batch".
- Add a tooltip/info popup "What is a Surprise Bag?" the first time a new user opens a merchant detail page.
- Set category expectations, e.g. "Bakery bag ≈ 4–6 pastries", so users have a mental model.
- Show example photos of bags from previous purchases (user-generated) as social proof.
- Add a "What to expect" section describing what that store usually puts in the bag.
**Source:** [Merchant detail](https://good-again-app.lovable.app/merchant/2)
**Ref:** [Marsh UX – Too Good To Go Magic Bag Case Study](https://www.marsh-ux.com/too-good-to-go-case-study)

### 4. Highlighting the Discount (Medium Priority)
**The problem:** The savings are not presented persuasively. On Discover cards, discounts exist as a small `-40%` badge next to two prices ("Rp 120.000 Rp 72.000"), but the original price isn't clearly struck through and there's no "You save Rp X" or "Save 40%" messaging. On the merchant page the strike-through exists but is small, low-contrast text. The core value proposition of the app — "save up to 80%" — is therefore easy to overlook. Users who don't immediately register the deal are less likely to convert, because the discount is what motivates a surprise-bag purchase in the first place.
**The fix:** Showing the original price crossed out next to the new discounted price (with a "Save 60%" badge) usually drives up conversion nicely.
**How to implement:**
- On Discover cards & the merchant detail page: show the original price struck through, the discounted price **bold + primary color**, and a "Save 60%" badge.
- Add the savings amount: "You save Rp 48.000" to make it concrete.
- Make sure the struck-through price is a genuine, recent price (don't inflate it) to avoid feeling deceptive.
- (Optional) add a countdown "Ends in 2 hours" for urgency.
- A/B test: price with vs. without strike-through & badge.
**Source:** [Discover](https://good-again-app.lovable.app/discover) · [Merchant detail](https://good-again-app.lovable.app/merchant/2)
**Ref:** [Growth Suite – Strike-Through Pricing Psychology](https://www.growthsuite.net/resources/shopify-discount/strike-through-pricing-compare-at-psychology-guide)

### 5. No Social Proof Yet (Medium Priority)
**The problem:** Merchants are hard to trust because there's almost no review evidence. For example, Sushi Sakura's detail page shows "⭐ Reviews (1)" — a single review. Discover cards show a rating number (e.g. 4.9) but no review count, which makes even high ratings look unsubstantiated. Users evaluating a new merchant have no way to verify quality, freshness, or bag value, so they hesitate — and hesitation is costly when bags sell out quickly.
**The fix:** A simple rating system (like 4.8/5 stars) on the merchant card helps build credibility.
**How to implement:**
- Show star rating + review count on Discover merchant cards, not just the rating number.
- Invite early-adopter merchants to collect their first reviews (seeded reviews).
- Ask for a rating right after pickup completes (while the user is still happy), not later.
- On the merchant detail page, show a rating breakdown (value, quality, portion) and a "write a review" button.
- Also use "X meals rescued" as an additional form of social proof.
**Source:** [Discover](https://good-again-app.lovable.app/discover) · [Merchant detail](https://good-again-app.lovable.app/merchant/2)
**Ref:** [Nielsen Norman Group – Social Proof in the User Experience](https://www.nngroup.com/articles/social-proof-ux/)

### 6. The Pickup Time Window is easy to miss (Medium Priority)
**The problem:** The pickup window renders as plain, small secondary text — on the merchant page it's a short line ("Today, 20:00–21:00") beside the rating and distance, and on Discover it's a single unemphasized line under the merchant name. Nothing about it stands out. If a user skims past it and buys a bag they can't collect, both sides lose: the user pays for nothing, the merchant has wasted food and a bad customer experience. There's also no confirmation at checkout that the user actually registered the time.
**The fix:** We should make the pickup window bold and maybe even add a checkbox at checkout where the user confirms they saw the time.
**How to implement:**
- Make the pickup window **bold + high-visibility color** on the merchant detail page, checkout, and success screen.
- Add a sticky pickup-time banner at the bottom of checkout (always visible while scrolling).
- Add a confirmation checkbox at checkout: "I understand pickup is 20:00–21:00".
- Repeat the pickup window clearly on the success screen and the Orders list.
- Send a push notification reminder 30 minutes before the window opens.
**Source:** [Merchant detail](https://good-again-app.lovable.app/merchant/2) · [Checkout](https://good-again-app.lovable.app/checkout/2)
**Ref:** [Too Good To Go Review – Inconvenient Pickup Windows](https://bagrescue.com/blog/too-good-to-go-review)

### 7. Missing Map View for Store Discovery (Medium Priority)
**The problem:** Discover is a pure vertical list. Distance is communicated only as text ("1.5 km", "4.5 km") — there's no spatial context. Users who plan pickups around their commute or neighborhood have to mentally map the numbers onto their route, which is error-prone and tiring. A store that's "3.8 km" could be on the way home or in the wrong direction entirely, and the list format gives no way to tell. This reduces discoverability of nearby stores and discourages route-based planning.
**The fix:** Introduce an interactive Map View toggle on the discover page so users can visually browse available surprise bags based on their physical route.
**How to implement:**
- Add a **Map / List** toggle at the top of the Discover page.
- Show pins for merchants with available bags; display a discount/availability badge on the pin.
- Tap a pin → small card with merchant, discount, pickup window, and distance.
- Keep filters (category, dietary, distance) in sync between Map and List views.
- (Optional) "along my route" feature: user enters their home address and the app highlights stores on the way.
- Keep List View as the fallback; measure whether Map improves conversion via an A/B test.
**Source:** [Discover](https://good-again-app.lovable.app/discover) · [Merchant detail](https://good-again-app.lovable.app/merchant/2)
**Ref:** [UX Tree – Enhancing Discoverability on the Too Good To Go App](https://ux-tree.com/enhancing-discoverability-on-the-too-good-to-go-app)

### 8. Dead Ends on Empty States (Medium Priority)
**The problem:** When a merchant is sold out or has no available bags, the page simply shows an empty "Available Surprise Meals" section with no message, no explanation, and no next step. The user has paid attention and found a store they want, but there's nothing to do — no "Notify me when available", no favorite button, no indication of when bags return. This is a dead end that loses the user (and their future purchase) instead of turning the sold-out moment into a reason to come back tomorrow.
**The fix:** Adding a "Notify me when available" or "Favorite this store" button gives the user an action to take so they come back tomorrow.
**How to implement:**
- When a merchant is sold out: show "Sold Out — back tomorrow ±19:00" instead of an empty screen.
- Add a **"Notify me when available"** button → send a push/email when a bag becomes available again.
- Add a **"Favorite this store"** button so the merchant shows up in a favorites list.
- On Discover, don't hide sold-out merchants — show them greyed out with a Notify/Subscribe button.
- For empty search results: show alternative suggestions + a "Reset Filters" button.
**Source:** [Merchant detail](https://good-again-app.lovable.app/merchant/2)
**Ref:** [Nielsen Norman Group – Designing Empty States in Complex Applications](https://www.nngroup.com/articles/empty-state-interface-design/)

### 9. Forgetting to Pick Up (Low Priority)
**The problem:** A user can buy a bag at 10 AM for an 8 PM pickup window, then simply forget — the gap between purchase and pickup is often many hours. The payment success screen (`/pay/confirm`) offers only "Back to Home" and "View My Orders" — there's no "Add to Calendar" option. The Orders page lists pickup windows but provides no reminder or countdown. With nothing to nudge the user, missed pickups happen, wasting both the user's money and the rescued food.
**The fix:** An "Add to Calendar" button on the success screen, or an automated push notification 30 minutes before the window opens.
**How to implement:**
- Add an **"Add to Calendar"** button (Google/Apple/Outlook) on the payment success screen and the Orders page.
- Send an automatic push notification 30 minutes before the pickup window; ask for notification permission at the right moment (right after a successful checkout).
- Show a countdown/banner "Pickup in 1 hour" on the Orders page for upcoming pickups.
- (Optional) email/SMS reminder for users who disabled notifications.
**Source:** [Payment success](https://good-again-app.lovable.app/pay/confirm) · [My Orders](https://good-again-app.lovable.app/orders)
**Ref:** [AddEvent – How to Add Calendar Reminders to Appointment Bookings](https://www.addevent.com/blog/how-to-add-calendar-reminders-to-appointment-bookings)

### 10. Mobile Touch Targets and Contrast (Low Priority)
**The problem:** Several interactive elements are too small for thumb use and some text is hard to read. For example, the quantity stepper (+/−) on the merchant page is roughly 32×32px (`w-8 h-8`), well below the 44px guideline, and close-together icon buttons make mis-taps likely. Secondary/muted text (descriptions, distances, timestamps) uses a light gray that risks falling below WCAG AA contrast (4.5:1), which is especially hard to read outdoors on bright phone screens. Both issues make the app feel imprecise and fatiguing to use on mobile.
**The fix:** Bumping up the touch targets to at least 44x44px and darkening the gray text slightly to hit WCAG contrast standards.
**How to implement:**
- Give all interactive elements (buttons, links, icons) a hit-area of at least **44×44px** (via `min-width/min-height` or padding).
- Keep at least 8px spacing between adjacent buttons to prevent mis-taps.
- Darken muted/secondary text until it meets **WCAG AA 4.5:1** contrast.
- Audit with automated tools (Lighthouse, axe, WCAG contrast checker).
- Test on real devices (iOS & Android) before release.
**Source:** [Discover](https://good-again-app.lovable.app/discover) · [Merchant detail](https://good-again-app.lovable.app/merchant/2) · [Checkout](https://good-again-app.lovable.app/checkout/2)
**Ref:** [W3C – WCAG 2.2 Understanding Target Size (44x44px)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) · [W3C – WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
