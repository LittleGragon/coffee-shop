import { NextResponse } from 'next/server';

const MOCK_MENU_ITEMS = {
  coffee: [
    { id: 'c1', name: 'Espresso', price: 3.00, image: 'https://placehold.co/600x400/5a3a2a/ffffff?text=Espresso' },
    { id: 'c2', name: 'Americano', price: 3.50, image: 'https://placehold.co/600x400/5a3a2a/ffffff?text=Americano' },
    { id: 'c3', name: 'Latte', price: 4.50, image: 'https://placehold.co/600x400/5a3a2a/ffffff?text=Latte' },
    { id: 'c4', name: 'Cappuccino', price: 4.50, image: 'https://placehold.co/600x400/5a3a2a/ffffff?text=Cappuccino' },
  ],
  tea: [
    { id: 't1', name: 'Green Tea', price: 3.00, image: 'https://placehold.co/600x400/6b7f3a/ffffff?text=Green+Tea' },
    { id: 't2', name: 'Black Tea', price: 3.00, image: 'https://placehold.co/600x400/3d2b1f/ffffff?text=Black+Tea' },
    { id: 't3', name: 'Oolong Tea', price: 3.50, image: 'https://placehold.co/600x400/8a6b4c/ffffff?text=Oolong+Tea' },
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', price: 2.50, image: 'https://placehold.co/600x400/c4a77e/000000?text=Croissant' },
    { id: 'p2', name: 'Muffin', price: 2.75, image: 'https://placehold.co/600x400/c4a77e/000000?text=Muffin' },
    { id: 'p3', name: 'Scone', price: 3.00, image: 'https://placehold.co/600x400/c4a77e/000000?text=Scone' },
  ],
};

type MenuCategory = keyof typeof MOCK_MENU_ITEMS;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as MenuCategory | null;

  if (!category || !MOCK_MENU_ITEMS[category]) {
    return NextResponse.json(
      { error: 'Invalid or missing category' },
      { status: 400 }
    );
  }

  const data = MOCK_MENU_ITEMS[category];

  return NextResponse.json({ data });
}