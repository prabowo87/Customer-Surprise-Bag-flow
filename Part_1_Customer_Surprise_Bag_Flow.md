# Good Again – Part 1: Customer Surprise Bag Flow

**Challenge:** Full-Stack Product Engineer Final Challenge
**Deliverable:** One functional feature — the Customer Surprise Bag flow (browse → detail → checkout → success)

---

## What I built

A small but functional **mobile-first** web app covering the core customer journey of a surplus-food marketplace:

1. **Discover / Home** — a list of merchants with available surprise bags (name, photo, distance, pickup time, original vs. discounted price).
2. **Surprise Bag Detail** — hero image, pickup window, price, "What you might get", tags (e.g. Pastries, Halal), and a Reserve button.
3. **Checkout** — order summary with platform fee, total, payment method selection (GoPay / OVO / QRIS), and a Pay button.
4. **Success screen** — confirmation that the bag was reserved with pickup info.

> **Live demo:** https://customer-surprise-bag-flow.vercel.app
> **Source:** https://github.com/prabowo87/Customer-Surprise-Bag-flow

### Screenshots

- `Home` — merchant list with surprise bags
- `Details` — surprise bag detail + Reserve
- `Checkout` — payment method + confirm
- `Success` — reservation confirmation

*(Full-size screenshots are included in the `screenshots/` folder and in this submission folder.)*

---

## Why I designed it this way

- **The surprise-bag purchase is the core of the product.** Discovery and payment are what actually create value for both the customer (affordable food) and the merchant (revenue from surplus). So I prioritised a clean, fast path from "see a bag" to "paid".
- **Mobile-first.** Most users of a food-rescue app order from their phone, often on the go. The layout is a single-column, 480px-max container with a sticky bottom action bar so the primary action is always reachable.
- **Trust & clarity before checkout.** A surprise bag is sold "blind", so the detail screen surfaces the pickup time, price, and a plain-language description of typical contents to reduce hesitation.
- **Three familiar local payment methods** (GoPay, OVO, QRIS) match how Indonesian users actually pay.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (with hooks) | Simple, component-based, easy to extend |
| Build tool | Vite | Fast dev server + instant HMR |
| Styling | Standard CSS | Light dependency footprint; keeps the app fast and portable |
| Types | TypeScript | Catch errors early; self-documenting data shapes |
| Deployment | Vercel | Free, zero-config hosting |

---

## Key implementation notes

- **State-driven navigation:** a single `currentView` state (`list / detail / checkout / success`) drives which screen renders, with a back button and a selected merchant shared across views.
- **Mock data:** merchants live in a typed mock dataset so the UI can be designed and tested before any backend exists.
- **Clean-up hooks:** `dist/` output is git-ignored; source is in `src/`.

---

## How to run it locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

---

## Scope decisions (what I deliberately kept out)

- No real payment integration — payment is simulated client-side.
- No backend / database yet — auth, orders, and inventory are stubbed with mock data.
- One flow (customer side) as requested; the merchant dashboard and delivery flow are out of scope for this feature.
