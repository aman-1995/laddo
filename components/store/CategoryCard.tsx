import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
}

export default function CategoryCard({ name, slug, image, productCount }: Props) {
  return (
    <Link href={`/category/${slug}`} className="group block">
      <div className="relative h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-amber-200">
        {/* Background image */}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-400" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-semibold text-sm leading-tight font-serif">{name}</p>
          <p className="text-white/75 text-[10px] mt-0.5">
            {productCount} {productCount === 1 ? "sweet" : "sweets"}
          </p>
        </div>
      </div>
    </Link>
  );
}
