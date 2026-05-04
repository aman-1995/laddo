import { prisma } from "@/lib/db/prisma";
import type { CategorySummary } from "./categories.types";

export const categoriesRepo = {
  async findAll(): Promise<CategorySummary[]> {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
    }));
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },
};
