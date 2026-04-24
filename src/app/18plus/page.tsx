"use client";

import Card from "@/components/Card";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogItem } from "@/lib/types";

type AdultItem = {
  id?: string | number;
  slug?: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  views?: string | number;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(
      `https://scripapi.web.id/gateway.php${path}`,
      { cache: "no-store" },
    );
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export default function AdultPage() {
  const [agreed, setAgreed] = useState(false);
  const [items, setItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAgreed(window.localStorage.getItem("stremix-18plus-ok") === "1");
    }
  }, []);

  useEffect(() => {
    if (!agreed) return;
    (async () => {
      const r = await fetchJson<{ data?: AdultItem[]; videos?: AdultItem[] }>(
        "/18plus/api/v1/videos",
      );
      const list = r?.data ?? r?.videos ?? [];
      const norm: CatalogItem[] = list
        .filter((x) => x.title && (x.slug || x.id))
        .map((x) => ({
          id: String(x.slug ?? x.id),
          title: x.title,
          poster: x.thumbnail,
          badge: x.duration,
          href: `/18plus/${encodeURIComponent(String(x.slug ?? x.id))}`,
        }));
      setItems(norm);
    })();
  }, [agreed]);

  if (!agreed) {
    return (
      <div className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-20">
        <div className="max-w-lg w-full text-center bg-netflix-surface border border-white/10 rounded-2xl p-8 shadow-card">
          <div className="text-6xl mb-3">🔞</div>
          <h1 className="text-2xl font-black">Konten Dewasa</h1>
          <p className="mt-3 text-white/70 text-sm">
            Halaman ini berisi konten untuk pengguna berusia 18 tahun ke atas.
            Dengan melanjutkan, kamu mengkonfirmasi bahwa kamu telah memenuhi
            syarat usia dan setuju untuk melihat konten ini.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                window.localStorage.setItem("stremix-18plus-ok", "1");
                setAgreed(true);
              }}
              className="btn-primary"
            >
              Saya 18+ dan setuju
            </button>
            <Link href="/" className="btn-secondary">
              Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pt-16 pb-16">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black">18+</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Konten untuk pengguna dewasa. Harap tonton dengan bijak.
        </p>
      </header>
      {!items ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md shimmer" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-white/60">
          Tidak ada konten yang dapat ditampilkan saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {items.map((it) => (
            <Card key={it.id} item={{ ...it, poster: it.poster }} />
          ))}
        </div>
      )}
    </div>
  );
}
