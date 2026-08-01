# Part 3 – Sequence Diagram (for Miro)

Rendering: paste each block into https://mermaid.live (or the Mermaid app on Miro) and rebuild as swimlanes on the board.

Split into **2 diagrams** for readability:
- Diagram A → happy path (auth → order → payment → notif).
- Diagram B → edge cases (sold out + cron timeout).

## How to read the diagram

**Legend:**
- **Box at the top (swimlane)** = the system/actor involved: `User App`, `Backend API`, `PostgreSQL`, `Midtrans/Xendit`, `FCM + Task Queue`, `Merchant App`. The dashed line running down = each system's "lifeline".
- **Solid arrow (→)** = request/action from one system to another (e.g. `User App → Backend API` = the user sends a request).
- **Dashed arrow (-->>)** = response/reply.
- **Self-loop arrow (A → A)** = internal process within a single system (no other system involved).
- **`Note`** = timing/condition annotation, not a message between systems.
- **`alt ... end`** = conditional branch (only one path runs).
- **Numbers (1, 2, 3, ...)** = execution order, top to bottom.

**How to read it:** start at number 1 and follow the arrows left to right. Each arrow = one interaction. If an arrow points back (left), it's the reply to the previous step. Sequential numbers mean time order, so read it like a story.

---

## Diagram A — Happy Path

```mermaid
sequenceDiagram
    autonumber
    actor U as User App
    participant A as Backend API (NestJS)
    participant DB as PostgreSQL
    participant M as Midtrans / Xendit
    participant F as FCM + Task Queue
    participant S as Merchant App

    U->>A: 1. POST /auth/login | /auth/register (OAuth token)
    A->>DB: 2. Verify + create user profile (same transaction)
    DB-->>A: 3. user record
    A-->>U: 4. JWT (Authorization header)

    U->>A: 5. POST /orders/reserve (JWT)
    A->>DB: 6. Atomic decrement stock (WHERE stock_count > 0)
    DB-->>A: 7. ok → order = PENDING
    A->>M: 8. Create transaction (get token)
    M-->>A: 9. transaction_token
    A-->>U: 10. Open payment UI (GoPay/OVO/QRIS/VA)
    U->>M: 11. Pay
    M->>A: 12. Payment webhook
    A->>A: 13. Verify webhook signature
    A->>DB: 14. Mark order = PAID
    A->>F: 15. Push "Order Confirmed!"
    A->>S: 16. Push/socket "New order!"
    A->>F: 17. Schedule reminder (30 min before pickup)
    Note over F: 30 min before pickup...
    F-->>U: 18. Push "Waktunya ambil pesanan!"
    U->>A: 19. POST /orders/{id}/picked-up (JWT)
    A->>DB: 20. Mark order = PICKED_UP / COMPLETED
```

**Diagram A story:**
1. User logs in/registers → Backend verifies and creates the user profile, then returns a JWT.
2. User clicks "Reserve" → Backend checks stock atomically (if sold out, continue to Diagram B).
3. Backend requests a payment token from Midtrans, then opens the payment UI in the user app.
4. User pays → Midtrans sends a webhook → Backend verifies the signature → order becomes `PAID`.
5. Backend sends notifications: "Order Confirmed!" to the user, "New order!" to the merchant, and schedules the pickup reminder.
6. When the reminder fires, the user receives the "Waktunya ambil pesanan!" push.
7. User picks up the order → order becomes `PICKED_UP/COMPLETED`.

## Diagram B — Edge Cases (sold out & timeout)

```mermaid
sequenceDiagram
    autonumber
    actor U as User App
    participant A as Backend API (NestJS)
    participant DB as PostgreSQL
    participant F as FCM + Task Queue

    Note over U,DB: Reserve fails
    U->>A: POST /orders/reserve (JWT)
    A->>DB: Atomic decrement stock
    alt Stock sold out (0 rows updated)
        DB-->>A: query fails
        A-->>U: 409 Sold out → offer "Notify me" / waitlist
    end

    Note over A,DB: Cron (every few minutes)
    A->>DB: Cancel PENDING orders older than 15 min (status = CANCELLED)
    DB-->>A: done
    A->>DB: Restore stock_count + 1
    DB-->>A: done
    A-->>U: Push "Order dibatalkan" (optional)
```

**Diagram B story:**
1. **Sold out scenario:** during reserve, the stock query fails (0 rows updated) → Backend replies `409 Sold out` and offers the user a "Notify me"/waitlist option.
2. **Timeout scenario (cron):** every few minutes, the cron finds `PENDING` orders older than 15 minutes → cancels them (`CANCELLED`) → restores the stock (`stock_count + 1`) → optionally pushes "Order dibatalkan" to the user.

## Notes to keep in sync with the document
- Order status follows the state machine: `PENDING → PAID → PICKED_UP/COMPLETED`, plus `CANCELLED`.
- SQL details (`UPDATE surprise_bags ...`, `WHERE created_at < now() - 15 min`) are not written in the diagram — they live in `Part_3_System_Design.md`.
- Labels can be switched to Bahasa Indonesia if you want to match the current Miro board style.
