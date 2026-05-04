import { prisma } from "@/lib/db/prisma";
import type { StorefrontProduct } from "./products.types";

export const productsRepo = {
  // ── Storefront listing ──────────────────────────────────────────────────

  async findStorefront(opts: {
    categorySlug?: string;
    skip: number;
    take: number;
  }): Promise<{ items: StorefrontProduct[]; total: number }> {
    const where = {
      isActive: true,
      ...(opts.categorySlug
        ? { category: { slug: opts.categorySlug } }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: opts.skip,
        take: opts.take,
        orderBy: { createdAt: "desc" },
        include: {
          vendor: { select: { shopName: true } },
          category: { select: { name: true, slug: true } },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, altText: true },
          },
          reviews: { select: { rating: true } },
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            take: 1,
            select: {
              price: true,
              mrp: true,
              attributes: {
                where: { key: "calories_per_100g" },
                select: { value: true },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const items: StorefrontProduct[] = products.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            )
          : 0;
      const lowestVariant = p.variants[0];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        primaryImage: p.images[0]?.url ?? null,
        primaryImageAlt: p.images[0]?.altText ?? p.name,
        lowestPrice: lowestVariant?.price ?? 0,
        mrp: lowestVariant?.mrp ?? 0,
        avgRating,
        reviewCount: ratings.length,
        vendorName: p.vendor?.shopName ?? "Laddo",
        calories: lowestVariant?.attributes[0]?.value ?? null,
        categorySlug: p.category.slug,
        categoryName: p.category.name,
      };
    });

    return { items, total };
  },

  // ── Admin / legacy methods ───────────────────────────────────────────────

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { vendor: true, category: true, variants: true, images: true },
    });
  },

  async create(data: {
    name: string;
    slug: string;
    categoryId: string;
    vendorId?: string;
    description?: string;
  }) {
    return prisma.product.create({ data });
  },
};
