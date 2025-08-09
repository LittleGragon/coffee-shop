import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of a menu item for type safety
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  is_available?: boolean;
}

// Define the shape of an item in the cart, which includes quantity
export interface CartItem extends MenuItem {
  quantity: number;
}

// Define the state and actions for the cart store
interface CartState {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item: MenuItem) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          const updatedItems = get().items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (itemId: string) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        });
      },

      decrementItem: (itemId: string) => {
        const existingItem = get().items.find((i) => i.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
          const updatedItems = get().items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
          set({ items: updatedItems });
        } else {
          get().removeFromCart(itemId);
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeFromCart(itemId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity: quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // This is the key used for localStorage.
    }
  )
);
