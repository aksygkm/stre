"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { CatalogItem } from "@/lib/types";
import Card from "./Card";

export default function Row({
  title,
  items,
  seeMoreHref,
}: {
  title: string;
  items: CatalogItem[];
  seeMoreHref?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  if (!items.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-10 mb-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
        {seeMoreHref && (
          <Link
            href={seeMoreHref}
            className="text-xs text-white/60 hover:text-white"
          >
            Lihat semua →
          </Link>
        )}
      </div>
      <div className="relative group">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="hidden md:flex absolute left-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div
          ref={scrollerRef}
          className="row-scroll px-4 sm:px-6 lg:px-10"
        >
          {items.map((it) => (
            <Card key={`${title}-${it.id}`} item={it} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}
