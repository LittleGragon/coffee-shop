import { MenuRepository, type CreateMenuInput, type ListMenuParams } from '@/server/repositories/menu.repository';

const repo = new MenuRepository();

function serialize(item: any) {
  return {
    id: item.id,
    name: item.name,
    price: typeof item.price === 'object' && item.price !== null && 'toNumber' in item.price
      ? Number((item.price as any).toNumber())
      : Number(item.price),
    category: item.category ?? null,
    description: item.description ?? null,
    image_url: item.imageUrl ?? null,
    is_available: Boolean(item.isAvailable),
  };
}

export async function listMenu(params: ListMenuParams) {
  const items = await repo.list(params);
  return items.map(serialize);
}

export async function createMenuItem(input: CreateMenuInput) {
  // Basic validation should be done at route level; assume validated here
  const created = await repo.create(input);
  return serialize(created);
}

export async function listMenuCategories(): Promise<string[]> {
  return repo.categories();
}