import { prisma } from '@/server/db/prisma';

export type ListMenuParams = {
  category?: string;
  isAvailable?: boolean;
};

export type CreateMenuInput = {
  name: string;
  price: number;
  category: string;
  description?: string | null;
  image_url?: string | null;
  is_available?: boolean;
};

export class MenuRepository {
  async list(params: ListMenuParams) {
    const where: any = {};
    if (params.category) where.category = params.category;
    if (typeof params.isAvailable === 'boolean') (where as any).isAvailable = params.isAvailable;

    return prisma.menuItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async create(input: CreateMenuInput) {
    // Rely on DB default for isAvailable when not provided
    return prisma.menuItem.create({
      data: {
        name: input.name,
        price: input.price,
        category: input.category,
        description: input.description ?? null,
        imageUrl: input.image_url ?? null,
        ...(input.is_available !== undefined ? { isAvailable: input.is_available } : {}),
      } as any,
    });
  }

  async categories(): Promise<string[]> {
    const rows = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category).filter((c): c is string => Boolean(c));
  }
}