# Add Shopping Cart and Checkout Functionality

## Core Features

- Add items to a persistent shopping cart

- View and manage cart contents in a slide-over panel

- A streamlined, single-page checkout process

- Real-time cart item count in the header

## Tech Stack

{
  "Web": {
    "arch": "react",
    "component": "shadcn",
    "stateManagement": "Zustand",
    "styling": "TailwindCSS",
    "framework": "Vite"
  }
}

## Design

The UI will be integrated with the existing shadcn/ui and TailwindCSS theme, featuring a modern, minimalist design. A slide-over 'Sheet' will be used for the cart, and a clean form for checkout, ensuring a seamless and intuitive user experience.

## Plan

Note: 

- [ ] is holding
- [/] is doing
- [X] is done

---

[X] Set up Zustand store for cart management (`cartStore.ts`)

[X] Update menu item components with "Add to Cart" functionality

[X] Implement the cart icon and item count badge in the global header

[X] Build the shopping cart view using shadcn/ui's `Sheet` component

[X] Implement quantity adjustment and item removal logic within the cart view

[X] Create the dedicated `/checkout` page with an order summary and user form

[X] Implement the final "Place Order" logic, including clearing the cart and showing a confirmation toast
