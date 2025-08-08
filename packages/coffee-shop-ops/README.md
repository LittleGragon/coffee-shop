# Coffee Shop Buddy - Operations Dashboard

This is a refactored version of the Coffee Shop Buddy application using Next.js. The application provides a modern, efficient backend for managing a coffee shop's operations, including menu management, inventory tracking, order processing, and reservation handling.

## Features

- **Menu Management**: Create, read, update, and delete menu items
- **Inventory Management**: Track inventory levels and record inventory transactions
- **Order Processing**: Manage customer orders and track their status
- **Reservation System**: Handle table reservations and manage booking availability

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Direct SQL queries with pg library

## API Endpoints

### Menu API

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create a new menu item
- `GET /api/menu/[id]` - Get a specific menu item
- `PUT /api/menu/[id]` - Update a menu item
- `DELETE /api/menu/[id]` - Delete a menu item
- `PATCH /api/menu/[id]/toggle-availability` - Toggle menu item availability
- `GET /api/menu/categories` - Get all menu categories

### Inventory API

- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create a new inventory item
- `GET /api/inventory/[id]` - Get a specific inventory item
- `PUT /api/inventory/[id]` - Update an inventory item
- `DELETE /api/inventory/[id]` - Delete an inventory item
- `GET /api/inventory/[id]/transactions` - Get all transactions for an inventory item
- `POST /api/inventory/[id]/transactions` - Record a new transaction for an inventory item

### Orders API

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/[id]` - Get a specific order with its items
- `PATCH /api/orders/[id]` - Update order status

### Reservations API

- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations/[id]` - Get a specific reservation
- `PUT /api/reservations/[id]` - Update a reservation
- `PATCH /api/reservations/[id]` - Update reservation status
- `DELETE /api/reservations/[id]` - Delete a reservation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database

### Installation

1. Clone the repository
2. Navigate to the project directory: `cd packages/coffee-shop-ops`
3. Install dependencies: `npm install`
4. Create a `.env` file with your database connection string:
   ```
   DATABASE_URL=postgres://localhost:5432/coffee_shop_buddy
   ```
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The application expects a PostgreSQL database with the following tables:
- `menu_items`
- `inventory_items`
- `inventory_transactions`
- `orders`
- `order_items`
- `reservations`
- `users`
- `transactions`

Refer to the schema in `packages/coffee-shop-ops/src/db/schema.sql` for the complete database structure.

## Improvements from Original Implementation

1. **Modern Architecture**: Leverages Next.js for both frontend and backend
2. **Type Safety**: Full TypeScript implementation for better developer experience
3. **API Organization**: Well-structured API routes with proper error handling
4. **Code Reusability**: Service-based architecture for better separation of concerns
5. **Performance**: Optimized database queries and connection pooling
6. **User Experience**: Responsive UI with filtering, sorting, and search capabilities
7. **Maintainability**: Clear project structure and comprehensive documentation

## License

This project is licensed under the MIT License.