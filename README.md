# Coffee Shop Buddy

This is a modern, responsive web application for a coffee shop, built with React, Vite, TypeScript, and Tailwind CSS. It features online ordering, custom cake building, table reservations, and a membership system.

## Features

*   **Online Ordering**: Browse the menu (coffee, tea, pastries) and add items to a shopping cart.
*   **Custom Cake Builder**: A multi-step form to design a custom cake with various sizes, flavors, frostings, and toppings.
*   **Table Reservations**: A simple form to book a table in-store.
*   **Membership Hub**: A dashboard for members to view their profile, check their balance, top-up their account, and see their order history.
*   **Modern UI**: A clean and warm design built with shadcn/ui and styled with Tailwind CSS.
*   **Interactive & Animated**: Subtle animations using Framer Motion enhance the user experience.

## Tech Stack

*   **Framework**: React
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Animations**: Framer Motion
*   **State Management**: Zustand (for cart)
*   **Form Handling**: React Hook Form
*   **Mock API**: Simulated backend interactions for a full-stack feel.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/coffee-shop-buddy.git
    cd coffee-shop-buddy
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

The optimized files will be located in the `dist/` directory. You can preview the production build locally with `npm run preview`.