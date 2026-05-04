import Link from "next/link";
import { notFound } from "next/navigation";
import { categoriesService } from "@/modules/categories/categories.service";
import { productsService } from "@/modules/products/products.service";
import ProductCard from "@/components/store/ProductCard";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const [category, allCategories] = await Promise.all([
    categoriesService.getCategory(slug).catch(() => null),
    categoriesService.listCategories(),
  ]);

  if (!category) notFound();

  const { items, total, limit } = await productsService.listStorefront({
    category: slug,
    page,
    limit: 12,
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍬</span>
            <span className="text-xl font-bold font-serif text-amber-800 tracking-tight">Laddo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {allCategories.slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`hover:text-amber-700 transition-colors ${c.slug === slug ? "text-amber-700 font-semibold" : ""}`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-amber-700 transition-colors" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Category Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-700 to-orange-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-amber-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white font-medium">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-amber-100 text-sm md:text-base max-w-xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="text-amber-200/70 text-xs mt-3">{total} {total === 1 ? "product" : "products"} available</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L720 10L1440 40V40H0Z" fill="#fffbeb" />
          </svg>
        </div>
      </section>

      {/* ── Category pills ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/"
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            All
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                c.slug === slug
                  ? "bg-amber-600 text-white border-amber-600"
                  : "border-amber-200 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Product grid ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🍬</span>
            <p className="mt-4 text-gray-500 text-sm">No sweets here yet. Check back soon!</p>
            <Link href="/" className="mt-4 inline-block text-amber-700 font-medium text-sm hover:underline">
              ← Back to home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/category/${slug}?page=${page - 1}`}
                    className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-200 rounded-full hover:bg-amber-50 transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                <span className="text-sm text-gray-500 px-3">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/category/${slug}?page=${page + 1}`}
                    className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-200 rounded-full hover:bg-amber-50 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-16 bg-amber-900 text-amber-200 py-8 px-4 text-center text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>🍬</span>
          <span className="font-bold font-serif text-white text-sm">Laddo</span>
        </div>
        <p className="text-amber-400">© {new Date().getFullYear()} Laddo Ecomm. All rights reserved.</p>
      </footer>
    </div>
  );
}
