import { create } from 'zustand';

export interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
}

const parsePrice = (price: string): number => {
    return parseFloat(price.replace('$', ''));
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.name === item.name);
      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { items: updatedItems };
      }
      return { items: [...state.items, { ...item, price: parsePrice(item.price), quantity: 1 }] };
    }),
  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter((i) => i.name !== name),
    })),
  updateQuantity: (name, quantity) =>
    set((state) => {
        if (quantity < 1) {
            return { items: state.items.filter((i) => i.name !== name) };
        }
        const updatedItems = state.items.map((i) =>
            i.name === name ? { ...i, quantity } : i
        );
        return { items: updatedItems };
    }),
  clearCart: () => set({ items: [] }),
}));