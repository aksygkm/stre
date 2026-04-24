"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { CatalogItem } from "@/lib/types";
import { proxiedImage } from "@/lib/api";

export default function Hero({ items }: { items: CatalogItem[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  if (!total) {
    return <div className="h-[60vh] bg-netflix-ink animate-pulse" />;
  }

  const item = items[idx];

  return (
    <section className="relative h-[86vh] min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          key={item.id}
          src={proxiedImage(item.poster)}
          alt={item.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] h-full px-4 sm:px-6 lg:px-10 flex">
        <div className="max-w-2xl flex flex-col justify-end pb-20 pt-28 animate-fade-in">
          <div className="flex items-center gap-2 text-netflix-red text-xs font-bold tracking-widest mb-2">
            <span className="h-5 w-1 bg-netflix-red rounded" /> STREAMIX ORIGINAL PICK
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] drop-shadow-lg">
            {item.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
            {item.rating && (
              <span className="text-green-400 font-semibold">
                ★ {item.rating}
              </span>
            )}
            {item.year && <span>{item.year}</span>}
            {item.genre && <span className="chip">{item.genre}</span>}
            {item.badge && <span className="chip">{item.badge}</span>}
          </div>
          {item.description && (
            <p className="mt-4 text-sm sm:text-base text-white/80 line-clamp-3 max-w-xl">
              {item.description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <Link href={item.href} className="btn-primary">
              <Play className="h-5 w-5 fill-black" /> Tonton Sekarang
            </Link>
            <Link href={item.href} className="btn-secondary">
              <Info className="h-5 w-5" /> Info Lebih
            </Link>
            <button
              aria-label="Add to list"
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/40 text-white hover:bg-white/10"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="absolute right-4 bottom-6 z-10 flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => (i - 1 + total) % total)}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-xs text-white/80 min-w-[3.5ch] text-center">
            {idx + 1}/{total}
          </div>
          <button
            onClick={() => setIdx((i) => (i + 1) % total)}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
