# Coffee Shop Buddy - Database Schema

This document outlines the database schema for the Coffee Shop Buddy application, designed to support all features including menu management, ordering, reservations, and memberships.

## Tables

### 1. `Users`

Stores information about registered members.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the user.           |
| `name`        | `VARCHAR(255)`| `NOT NULL`               | User's full name.                         |
| `email`       | `VARCHAR(255)`| `UNIQUE`, `NOT NULL`     | User's email address.                     |
| `password_hash`| `VARCHAR(255)`| `NOT NULL`               | Hashed password for authentication.       |
| `balance`     | `DECIMAL(10, 2)`| `NOT NULL`, `DEFAULT 0.00` | Current account balance for the member.   |
| `member_since`| `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | The date the user registered.             |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of when the user was created.   |
| `updated_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of the last update.             |

---

### 2. `MenuItems`

Stores all products available for purchase.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the menu item.      |
| `name`        | `VARCHAR(255)`| `NOT NULL`               | Name of the product.                      |
| `price`       | `DECIMAL(10, 2)`| `NOT NULL`               | Price of the product.                     |
| `category`    | `VARCHAR(50)` | `NOT NULL`               | Category (e.g., 'coffee', 'tea', 'pastries'). |
| `image_url`   | `VARCHAR(2048)`|                          | URL for the product's image.              |
| `description` | `TEXT`        |                          | A brief description of the product.       |
| `is_available`| `BOOLEAN`     | `NOT NULL`, `DEFAULT TRUE` | Whether the item is currently available.  |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of when the item was created.   |
| `updated_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of the last update.             |

---

### 3. `Orders`

Stores information about all customer orders, including regular and custom cake orders.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the order.          |
| `user_id`     | `UUID`        | `REFERENCES Users(id)`   | The user who placed the order. Can be NULL for guest orders. |
| `total_amount`| `DECIMAL(10, 2)`| `NOT NULL`               | The total cost of the order.              |
| `status`      | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'pending'` | Order status (e.g., 'pending', 'confirmed', 'completed', 'cancelled'). |
| `order_type`  | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'standard'` | Type of order ('standard' or 'cake').     |
| `customization`| `JSONB`      |                          | JSON object storing details for custom cake orders. |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of when the order was placed.   |

---

### 4. `OrderItems`

A junction table linking `Orders` and `MenuItems`.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the order item entry. |
| `order_id`    | `UUID`        | `NOT NULL`, `REFERENCES Orders(id)` | The associated order.                     |
| `menu_item_id`| `UUID`        | `NOT NULL`, `REFERENCES MenuItems(id)` | The associated menu item.                 |
| `quantity`    | `INTEGER`     | `NOT NULL`, `DEFAULT 1`  | Quantity of the menu item ordered.        |
| `price_at_time`| `DECIMAL(10, 2)`| `NOT NULL`               | The price of the item when the order was placed. |

---

### 5. `Reservations`

Stores information about table reservations.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the reservation.    |
| `user_id`     | `UUID`        | `REFERENCES Users(id)`   | The user who made the reservation. Can be NULL for guests. |
| `customer_name`| `VARCHAR(255)`| `NOT NULL`               | Name of the person making the reservation. |
| `customer_phone`| `VARCHAR(50)` | `NOT NULL`               | Contact phone number for the reservation. |
| `party_size`  | `INTEGER`     | `NOT NULL`               | The number of people in the party.        |
| `reservation_time`| `TIMESTAMPTZ`| `NOT NULL`               | The date and time of the reservation.     |
| `status`      | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'confirmed'` | Status (e.g., 'confirmed', 'cancelled', 'completed'). |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of when the reservation was made. |

---

### 6. `Transactions`

Logs all financial transactions, such as top-ups.

| Column        | Type          | Constraints              | Description                               |
|---------------|---------------|--------------------------|-------------------------------------------|
| `id`          | `UUID`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the transaction.    |
| `user_id`     | `UUID`        | `NOT NULL`, `REFERENCES Users(id)` | The user associated with the transaction. |
| `amount`      | `DECIMAL(10, 2)`| `NOT NULL`               | The amount of the transaction.            |
| `type`        | `VARCHAR(50)` | `NOT NULL`               | Type of transaction (e.g., 'top-up', 'purchase'). |
| `status`      | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'completed'` | Status of the transaction.                |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of when the transaction occurred. |