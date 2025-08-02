import { NextResponse } from 'next/server';

const MOCK_MENU_ITEMS = {
  coffee: [
    { id: 'c1', name: 'Espresso', price: 3.00, image: 'https://images.unsplash.com/photo-1511920183353-34e61a95a512' },
    { id: 'c2', name: 'Americano', price: 3.50, image: 'https://images.unsplash.com/photo-1532004253691-b223946c1de1' },
    { id: 'c3', name: 'Latte', price: 4.50, image: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87' },
    { id: 'c4', name: 'Cappuccino', price: 4.50, image: 'https://images.unsplash.com/photo-1572442388855-458a58494c73' },
  ],
  tea: [
    { id: 't1', name: 'Green Tea', price: 3.00, image: 'https://images.unsplash.com/photo-1627435601361-ec25f2b74c28' },
    { id: 't2', name: 'Black Tea', price: 3.00, image: 'https://images.unsplash.com/photo-1627894222733-2c896f47a24f' },
    { id: 't3', name: 'Oolong Tea', price: 3.50, image: 'https://images.unsplash.com/photo-1597318181433-3135227117c7' },
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', price: 2.50, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd' },
    { id: 'p2', name: 'Muffin', price: 2.75, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },
    { id: 'p3', name: 'Scone', price: 3.00, image: 'https://images.unsplash.com/photo-1606859211883-92c975b7a1a4' },
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