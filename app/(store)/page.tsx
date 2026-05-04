import Link from "next/link";
import { categoriesService } from "@/modules/categories/categories.service";
import { productsService } from "@/modules/products/products.service";
import CategoryCard from "@/components/store/CategoryCard";
import ProductCard from "@/components/store/ProductCard";

export const revalidate = 60;

export default async function StorePage() {
  const [categories, { items: featured }] = await Promise.all([
    categoriesService.listCategories(),
    productsService.listStorefront({ page: 1, limit: 8 }),
  ]);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍬</span>
            <span className="text-xl font-bold font-serif text-amber-800 tracking-tight">
              Laddo
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/category/laddos" className="hover:text-amber-700 transition-colors">Laddos</Link>
            <Link href="/category/barfi" className="hover:text-amber-700 transition-colors">Barfi</Link>
            <Link href="/category/halwa" className="hover:text-amber-700 transition-colors">Halwa</Link>
            <Link href="/category/cashew-delights" className="hover:text-amber-700 transition-colors">Kaju</Link>
            <Link href="/category/sugar-free" className="hover:text-amber-700 transition-colors">Sugar-Free</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-amber-700 transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-amber-700 transition-colors relative" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-orange-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/30">
              <span>✨</span>
              Handcrafted · Fresh Daily · Pan-India Delivery
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight mb-4">
              India&apos;s Finest
              <br />
              <span className="text-amber-200">Mithai,</span> Delivered
              <br />
              to Your Door
            </h1>

            <p className="text-amber-100 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              Authentic laddos, barfi, halwa and more — sourced from
              master mithai makers across Rajasthan, Gujarat, and Bengal.
              No preservatives. Always fresh.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-amber-50 transition-all duration-200 text-sm"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/category/sugar-free"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200 text-sm"
              >
                🌿 Sugar-Free Range
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-amber-100">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🏪</span>
                <span>3 Trusted Vendors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🍬</span>
                <span>19+ Varieties</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🚚</span>
                <span>Free Delivery over ₹499</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 27.5C840 35 960 40 1080 37.5C1200 35 1320 25 1380 20L1440 15V60H0Z" fill="#fffbeb" />
          </svg>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/category/laddos"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              image={cat.image}
              productCount={cat.productCount}
            />
          ))}
        </div>
      </section>

      {/* ── Divider banner ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-orange-700 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-amber-200 text-xs font-semibold uppercase tracking-widest mb-1">Festival Season</p>
            <p className="text-white text-xl font-bold font-serif">
              Gift hampers starting from ₹499 🎁
            </p>
          </div>
          <Link
            href="/category/cashew-delights"
            className="shrink-0 bg-white text-amber-800 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-amber-50 transition-colors shadow"
          >
            Shop Gifts
          </Link>
        </div>
      </div>

      {/* ── Featured Products ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Most Loved</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Popular Sweets
            </h2>
          </div>
          <Link
            href="/category/laddos"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            See all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* ── USP strip ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-amber-100 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🌿", title: "No Preservatives", sub: "Made fresh, packed same day" },
            { icon: "🚚", title: "Pan-India Delivery", sub: "Insulated packaging for freshness" },
            { icon: "🏅", title: "Verified Vendors", sub: "Curated master mithai makers" },
            { icon: "↩️", title: "Easy Returns", sub: "Not happy? We'll make it right" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <p className="font-semibold text-gray-900 text-sm font-serif">{item.title}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-amber-900 text-amber-200 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍬</span>
              <span className="text-xl font-bold font-serif text-white">Laddo</span>
            </div>
            <p className="text-sm text-amber-300/80 max-w-xs">
              Bringing the best of India&apos;s mithai tradition to your doorstep. Made with love, ghee, and generations of expertise.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-white font-semibold mb-3">Categories</p>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="hover:text-white transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Help</p>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Delivery Info</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-amber-800 text-xs text-amber-400 text-center">
          © {new Date().getFullYear()} Laddo Ecomm. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
