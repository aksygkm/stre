import Link from "next/link";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import type { CatalogItem } from "@/lib/types";
import { proxiedImage } from "@/lib/api";

export default function Card({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={item.href}
      className="group snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
    >
      <div className="card-shell">
        <Image
          src={proxiedImage(item.poster)}
          alt={item.title}
          width={300}
          height={450}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 160px, 200px"
        />
        {item.badge && (
          <span className="absolute left-2 top-2 chip bg-netflix-red/90 text-white border-transparent">
            {item.badge}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            {item.rating ? (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                {item.rating}
              </span>
            ) : null}
            {item.year ? <span>{item.year}</span> : null}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-white text-black">
              <Play className="h-3.5 w-3.5 fill-black" />
            </span>
            <span className="text-[11px] font-semibold line-clamp-1">
              Tonton
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <div className="text-sm font-medium line-clamp-1">{item.title}</div>
        {item.genre && (
          <div className="text-[11px] text-white/50 line-clamp-1">
            {item.genre}
          </div>
        )}
      </div>
    </Link>
  );
}
