import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  slug: string;
  primaryImage: string | null;
  primaryImageAlt: string;
  lowestPrice: number;
  mrp: number;
  avgRating: number;
  reviewCount: number;
  vendorName: string;
  calories: string | null;
  categorySlug: string;
}

function rupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function ProductCard({
  name,
  slug,
  primaryImage,
  primaryImageAlt,
  lowestPrice,
  mrp,
  avgRating,
  reviewCount,
  vendorName,
  calories,
}: Props) {
  const hasDiscount = mrp > lowestPrice;

  return (
    <Link href={`/products/${slug}`} className="group block">
      <article className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-amber-100/60">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-amber-50">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={primaryImageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-100 text-5xl">
              🧁
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow">
              {Math.round(((mrp - lowestPrice) / mrp) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 space-y-2">
          {/* Vendor */}
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-widest truncate">
            {vendorName}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 font-serif">
            {name}
          </h3>

          {/* Calories + Rating */}
          <div className="flex items-center gap-2 flex-wrap">
            {calories && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-medium rounded-full px-2 py-0.5 border border-green-100">
                🌿 {calories} kcal / 100g
              </span>
            )}
            {avgRating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-500">
                <span className="text-amber-400 text-xs">★</span>
                <span className="font-medium text-gray-700">{avgRating}</span>
                <span className="text-gray-400">({reviewCount})</span>
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-bold text-gray-900">{rupees(lowestPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{rupees(mrp)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
