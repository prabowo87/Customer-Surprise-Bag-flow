# Good Again – System Design
**Final Challenge - Part 3**

## 1. Customer Registration & Authentication
**Architecture:**
*   **Identity Provider:** Firebase Authentication or Supabase Auth.
*   **Database:** PostgreSQL (via Supabase) or Firestore for user profiles.

**Flow:**
1.  **Sign Up/Sign In:** User registers via Email/Password, Google Sign-In, or Apple Sign-In (crucial for iOS).
2.  **Token Generation:** The Auth provider generates a JWT (JSON Web Token) upon successful login.
3.  **Client Storage:** The mobile app stores the JWT securely (e.g., using `EncryptedSharedPreferences` on Android, `Keychain` on iOS).
4.  **API Requests:** The client attaches the JWT in the `Authorization: Bearer <token>` header for all backend requests.
5.  **Profile Sync:** A webhook or edge function automatically creates a corresponding user profile in the primary database upon registration.

---

## 2. Payment Flow
**Architecture:**
*   **Payment Gateway:** Midtrans, Xendit, or Stripe (Midtrans/Xendit is highly recommended for the Indonesian market as they support GoPay, OVO, QRIS, and Virtual Accounts).
*   **Backend:** Node.js/NestJS API.

**Flow:**
1.  **Checkout Initiation:** User clicks "Reserve Now". The client calls the backend API `POST /orders`.
2.  **Order Creation:** The backend creates an order record in the database with status `PENDING`.
3.  **Token Request:** The backend requests a transaction token/URL from the payment gateway (e.g., Midtrans Snap API) and returns it to the client.
4.  **Payment UI:** The client opens the payment gateway's WebView or deep links to the e-wallet app.
5.  **Webhook Fulfillment:** Once paid, the payment gateway sends a webhook to the backend `POST /webhooks/payment`.
6.  **Status Update:** The backend verifies the webhook signature, updates the order status to `PAID`, and triggers the notification system.

---

## 3. Notifications
**Architecture:**
*   **Push Notifications:** Firebase Cloud Messaging (FCM).
*   **Transactional Messages (Fallbacks):** WhatsApp Business API or Email (SendGrid/Resend).
*   **Cron/Task Scheduler:** Redis/BullMQ or Google Cloud Tasks.

**Flow:**
1.  **Order Confirmed:** Upon payment, a push notification is sent immediately to the user via FCM: "Order Confirmed! Don't forget your pickup time."
2.  **Pickup Reminder (Scheduled):** The backend schedules a task (e.g., via Cloud Tasks) to execute 30 minutes before the merchant's pickup window begins.
3.  **Execution:** The scheduler triggers the notification service, which sends an FCM push: "Time to pick up your Surprise Bag at [Merchant Name]!".
4.  **Merchant Alert:** A separate push notification or in-app socket event is sent to the Merchant Dashboard alerting them of a new order.

---

## 4. Merchant Inventory
**Architecture:**
*   **Database:** PostgreSQL (highly recommended for strict ACID compliance to prevent overselling).

**Flow:**
1.  **Inventory Setup:** Merchants input the number of available surprise bags for the day. A `surprise_bags` table tracks `merchant_id`, `stock_count`, `price`, and `pickup_time`.
2.  **Concurrency Control (Preventing Overselling):** When an order is placed, the database uses **row-level locking** (e.g., `SELECT ... FOR UPDATE` in PostgreSQL) or an **atomic decrement** query (`UPDATE surprise_bags SET stock_count = stock_count - 1 WHERE id = X AND stock_count > 0`).
3.  **Rollback:** If a user abandons the payment or it expires after 15 minutes, a cron job or webhook marks the order as `CANCELLED` and atomically increments the `stock_count` back by 1.
4.  **Real-time Sync (Optional):** Changes to `stock_count` can be broadcasted via WebSockets (e.g., Supabase Realtime) so customers looking at the app see the stock update instantly.
