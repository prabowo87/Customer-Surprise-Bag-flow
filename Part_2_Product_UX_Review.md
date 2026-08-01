# Good Again – Product & UX Review
**Final Challenge - Part 2**

This review is based on a heuristic evaluation of standard surplus food marketplace interfaces, focusing on merchant discovery, the surprise bag purchase flow, and post-purchase clarity.

## Top 10 UX & Usability Issues

### 1. Lack of Distance & Location Context (High Priority)
* **Issue**: Users often do not know how far away a merchant is from their current location on the listing page. Since surplus food pickup is local and time-sensitive, location context is critical.
* **Suggestion**: Add distance (e.g., "1.2 km away") on the merchant card, sort the feed primarily by distance, and introduce a Map View toggle.

### 2. Unclear "Surprise Bag" Expectations (High Priority)
* **Issue**: First-time users may feel anxious about purchasing a "Surprise Bag" without knowing what they might get, leading to drop-offs.
* **Suggestion**: Add a brief descriptive subtitle under the bag (e.g., "Assorted pastries and breads from today's batch") and a prominent tooltip explaining the surprise bag concept to build trust.

### 3. Missing Dietary Preference Filters (High Priority)
* **Issue**: Users with dietary restrictions (Halal, Vegan, Vegetarian) cannot safely purchase a surprise bag if they can't filter merchants.
* **Suggestion**: Introduce prominent quick filters for "Halal", "Vegetarian", and "Vegan" on the home page and prominently display these tags on the merchant details page.

### 4. Pickup Time Window Not Prominent Enough (Medium Priority)
* **Issue**: The required pickup window (e.g., 9:00 PM - 10:00 PM) is sometimes buried in the details. Users might purchase a bag and miss the window.
* **Suggestion**: Highlight the pickup window in bold, contrasting colors right next to the "Reserve" button. Add an explicit confirmation checkbox during checkout.

### 5. Lack of Price Contrast & Value Communication (Medium Priority)
* **Issue**: The discount is not emphasized enough. Users love to feel they are getting a steal, which drives impulse purchases.
* **Suggestion**: Show the original price crossed out (strikethrough) next to the new price, and add a badge highlighting the discount percentage (e.g., "Save 60%").

### 6. Empty States Lack Calls-to-Action (Medium Priority)
* **Issue**: When a merchant is sold out, the page might just look empty or show "No bags available," leading to a dead-end experience.
* **Suggestion**: Implement an "Add to Favorites" or "Notify Me" button so users can be alerted when the merchant drops new bags tomorrow.

### 7. Checkout Friction and Lack of Payment Options (Medium Priority)
* **Issue**: If the checkout process takes too many clicks, the user might abandon the cart.
* **Suggestion**: Implement a one-click or two-click checkout flow utilizing Apple Pay, Google Pay, or popular local e-wallets (GoPay, OVO).

### 8. Absence of Social Proof (Low Priority)
* **Issue**: Users may hesitate to buy from an unfamiliar merchant.
* **Suggestion**: Add a simple rating system (e.g., 4.8/5 based on 120 reviews) on the merchant card to build credibility.

### 9. Missing "Add to Calendar" Functionality (Low Priority)
* **Issue**: Users easily forget their pickup window, leading to uncollected bags (which defeats the purpose of stopping food waste).
* **Suggestion**: On the order confirmation page, include an "Add to Calendar" button and a toggle to enable push notification reminders 30 minutes before pickup.

### 10. Low Contrast & Small Touch Targets (Low Priority)
* **Issue**: Secondary text (like terms or addresses) may have low contrast, and some buttons might be too small for easy tapping on mobile.
* **Suggestion**: Ensure all text meets the WCAG AA contrast ratio of 4.5:1. Increase touch targets (buttons, links) to a minimum of 44x44 pixels.
