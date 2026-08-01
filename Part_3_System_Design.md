# Good Again – System Design

**👉 [View the System Flow Diagram on Miro](https://miro.com/app/board/uXjVH2egoKc=/?share_link_id=167792340124)**

Here is my proposed system architecture for the core backend flows. For an early-stage startup, my main philosophy here is: use managed services to move fast (like Firebase), but don't compromise on data integrity where money or inventory is involved.

### 1. Customer Registration & Authentication
To maintain full control over the user lifecycle and data security, Authentication is centralized and handled directly by our **Backend API** rather than exposing third-party auth directly to the client.
- **Flow:** The client sends login credentials (or OAuth tokens from Google/Apple) directly to our backend via `POST /auth/login` or `POST /auth/register`.
- **Security:** The backend verifies the credentials, issues a secure JWT, and returns it to the client. The client stores this JWT securely on the device and passes it in the `Authorization` header for subsequent requests.
- **Data Integrity:** Because the backend natively handles the auth flow, user profiles are created instantly in the PostgreSQL database within the exact same transaction, eliminating the need for complex sync webhooks.

### 2. Payment Flow
For the Indonesian market, **Midtrans** or **Xendit** are usually the best bets because they support GoPay, OVO, QRIS, and Virtual Accounts out of the box.
- **Flow:** When a user clicks "Reserve", our backend (Node.js/NestJS) creates a `PENDING` order in the database.
- We hit the Midtrans API to get a transaction token, pass it to the frontend, and open the payment UI.
- Once the user pays via GoPay/OVO, Midtrans sends a Webhook to our backend.
- We verify the Webhook signature, mark the order as `PAID`, and trigger the notification flow.
- We'd track order status as a simple state machine: `PENDING → PAID → PICKED_UP/COMPLETED`, plus `CANCELLED` (e.g. when a payment times out).

### 3. Notifications
For push notifications, **Firebase Cloud Messaging (FCM)** is the industry standard and free.
- **Immediate:** As soon as an order is `PAID`, we shoot an FCM push to the user saying "Order Confirmed!"
- **Scheduled:** To make sure they don't forget their food, we can use a basic task queue (like BullMQ or Google Cloud Tasks) to schedule a push notification 30 minutes before their pickup window starts.
- We'd also send a real-time socket event or push to the Merchant's app so they know a new order just came in.
- When a payment times out and the order gets cancelled, we'd push a short "Order cancelled" notification to the user.

### 4. Merchant Inventory (The tricky part)
This is where we need strict consistency. If a merchant has 2 bags left and 3 people try to buy them at the exact same second, we can't oversell. I wouldn't use NoSQL (like Firestore) for this. I'd use **PostgreSQL**.
- **Flow:** Merchants set their stock for the day in a `surprise_bags` table (which tracks `stock_count`).
- **Concurrency:** When an order is placed, the database executes an atomic decrement (`UPDATE surprise_bags SET stock_count = stock_count - 1 WHERE id = X AND stock_count > 0`). If `stock_count` is 0, the query fails and we tell the user it's sold out — and we'd offer a "Notify me" / waitlist option so they get pinged when the merchant restocks.
- **Timeouts:** If the user abandons the checkout page, a cron job checks for unpaid orders older than 15 minutes, cancels them, and adds the `stock_count` back.
