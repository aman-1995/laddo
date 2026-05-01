import { prisma } from "@/lib/db/prisma";

export const productsRepo = {
  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  async findAll(opts: { category?: string; skip: number; take: number }) {
    const where = opts.category ? { category: opts.category } : {};
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: opts.skip,
        take: opts.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total };
  },

  async create(data: {
    name: string;
    price: number;
    category: string;
    inventory: number;
  }) {
    return prisma.product.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      price: number;
      category: string;
      inventory: number;
    }>
  ) {
    return prisma.product.update({ where: { id }, data });
  },

  async decrementInventory(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { inventory: { decrement: quantity } },
    });
  },
};
