export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

// Simple in-memory dataset to simulate DB
let seq = 1000;
export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Cappuccino',
    price: 4.5,
    category: 'Hot Beverages',
    description: 'Rich espresso with steamed milk and foam',
    image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38',
    is_available: true,
  },
  {
    id: '2',
    name: 'Croissant',
    price: 3.25,
    category: 'Pastries',
    description: 'Buttery, flaky pastry',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    is_available: true,
  },
  {
    id: '3',
    name: 'Iced Coffee',
    price: 3.75,
    category: 'Cold Beverages',
    description: 'Cold brewed coffee served over ice',
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
    is_available: true,
  },
  {
    id: '4',
    name: 'Espresso',
    price: 2.75,
    category: 'Hot Beverages',
    description: 'Strong and bold shot of coffee',
    image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
    is_available: true,
  },
  {
    id: '5',
    name: 'Blueberry Muffin',
    price: 2.95,
    category: 'Pastries',
    description: 'Freshly baked muffin with blueberries',
    image_url: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0',
    is_available: false,
  },
];

export function getAllItems(options?: { category?: string; isAvailable?: boolean }): MenuItem[] {
  let items = MENU_ITEMS.slice();
  if (options?.category) {
    items = items.filter((i) => i.category === options.category);
  }
  if (options?.isAvailable !== undefined) {
    items = items.filter((i) => i.is_available === options.isAvailable);
  }
  return items;
}

export function getAllCategories(): string[] {
  return Array.from(new Set(MENU_ITEMS.map((i) => i.category))).sort((a, b) => a.localeCompare(b));
}

export function addItem(
  item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>
): MenuItem {
  const now = new Date().toISOString();
  const newItem: MenuItem = {
    ...item,
    id: String(++seq),
    created_at: now,
    updated_at: now,
  };
  MENU_ITEMS.push(newItem);
  return newItem;
}