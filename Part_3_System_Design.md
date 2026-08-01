# Good Again – System Design

Here is my proposed system architecture for the core backend flows. For an early-stage startup, my main philosophy here is: use managed services to move fast (like Firebase/Supabase), but don't compromise on data integrity where money or inventory is involved.

### 1. Customer Registration & Authentication
I'd highly recommend using **Firebase Auth** or **Supabase Auth**. There's no need to build custom auth from scratch at this stage.
- **Flow:** We let users sign up via Email or Google/Apple Sign-In (Apple is mandatory for the iOS App Store anyway).
- **Security:** The auth provider gives us a JWT. We store it securely on the device and pass it in the `Authorization` header for all backend API calls.
- **Data Sync:** Whenever a new user signs up, a webhook triggers and creates a corresponding profile row in our main database.

### 2. Payment Flow
For the Indonesian market, **Midtrans** or **Xendit** are usually the best bets because they support GoPay, OVO, QRIS, and Virtual Accounts out of the box.
- **Flow:** When a user clicks "Reserve", our backend (Node.js/NestJS) creates a `PENDING` order in the database.
- We hit the Midtrans API to get a transaction token, pass it to the frontend, and open the payment UI.
- Once the user pays via GoPay/OVO, Midtrans sends a Webhook to our backend.
- We verify the Webhook signature, mark the order as `PAID`, and trigger the notification flow.

### 3. Notifications
For push notifications, **Firebase Cloud Messaging (FCM)** is the industry standard and free.
- **Immediate:** As soon as an order is `PAID`, we shoot an FCM push to the user saying "Order Confirmed!"
- **Scheduled:** To make sure they don't forget their food, we can use a basic task queue (like BullMQ or Google Cloud Tasks) to schedule a push notification 30 minutes before their pickup window starts.
- We'd also send a real-time socket event or push to the Merchant's app so they know a new order just came in.

### 4. Merchant Inventory (The tricky part)
This is where we need strict consistency. If a merchant has 2 bags left and 3 people try to buy them at the exact same second, we can't oversell. I wouldn't use NoSQL (like Firestore) for this. I'd use **PostgreSQL**.
- **Flow:** Merchants set their stock for the day in a `surprise_bags` table (which tracks `stock_count`).
- **Concurrency:** When an order is placed, the database executes an atomic decrement (`UPDATE surprise_bags SET stock_count = stock_count - 1 WHERE id = X AND stock_count > 0`). If `stock_count` is 0, the query fails and we tell the user it's sold out.
- **Timeouts:** If the user abandons the checkout page, a cron job checks for unpaid orders older than 15 minutes, cancels them, and adds the `stock_count` back.
