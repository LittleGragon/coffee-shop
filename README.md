# Coffee Shop Buddy (Monorepo)

This is a full-stack application for a modern coffee shop, built with a React frontend and a Next.js backend, all managed within a single monorepo. It features online ordering, custom cake building, table reservations, and a membership system.

## Project Structure

This project is a monorepo managed with npm workspaces.

*   `packages/web`: A React application built with Vite that serves as the customer-facing frontend.
*   `packages/api`: A Next.js application that provides the backend API.

## Features

*   **Online Ordering**: Browse the menu (coffee, tea, pastries) and add items to a shopping cart.
*   **Custom Cake Builder**: A multi-step form to design a custom cake with various sizes, flavors, frostings, and toppings.
*   **Table Reservations**: A simple form to book a table in-store.
*   **Membership Hub**: A dashboard for members to view their profile, check their balance, top-up their account, and see their order history.
*   **Modern UI**: A clean and warm design built with shadcn/ui and styled with Tailwind CSS.
*   **Interactive & Animated**: Subtle animations using Framer Motion enhance the user experience.

## Tech Stack

### Frontend (`packages/web`)

*   **Framework**: React
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Animations**: Framer Motion

### Backend (`packages/api`)

*   **Framework**: Next.js
*   **Language**: TypeScript
*   **Testing**: Jest

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm (v7 or later for workspace support)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/coffee-shop-buddy.git
    cd coffee-shop-buddy
    ```

2.  **Install dependencies from the root directory:**
    This command will install dependencies for all workspaces (`web` and `api`).
    ```bash
    npm install
    ```

### Running the Development Servers

To start the local development servers for both the frontend and backend, run the following command from the root directory:

```bash
npm run dev
```

*   The frontend will be available at `http://localhost:5173`.
*   The backend API will be available at `http://localhost:3000`.

### Building for Production

To create a production-ready build for both applications, run:

```bash
npm run build
```

The optimized files will be located in the `packages/web/dist` and `packages/api/.next` directories.

### Running Tests

To run the unit tests for the backend API, use the following command:

```bash
npm run test