import Row from "@/components/Row";
import { apiSafe } from "@/lib/api";
import {
  extractArray,
  normalizeGeneric,
  type GenericShortItem,
} from "@/lib/normalize";
import { PROVIDERS } from "@/lib/providers";
import type { CatalogItem } from "@/lib/types";
import { notFound } from "next/navigation";

export const revalidate = 600;

type Section = { title: string; path: string };

const PROVIDER_SECTIONS: Record<string, Section[]> = {
  reelshort: [
    { title: "For You", path: "/reelshort/api/v1/foryou" },
    { title: "New", path: "/reelshort/api/v1/new" },
    { title: "Completed", path: "/reelshort/api/v1/completed" },
    { title: "Romance", path: "/reelshort/api/v1/romance" },
    { title: "Drama", path: "/reelshort/api/v1/drama" },
  ],
  dramaboxv2: [
    { title: "Home", path: "/dramaboxv2/api/home" },
    { title: "Ranking", path: "/dramaboxv2/api/rank" },
    { title: "Recommend", path: "/dramaboxv2/api/recommend" },
    { title: "Theater", path: "/dramaboxv2/api/theater" },
  ],
  dramapops: [
    { title: "Homepage", path: "/dramapops/api/v1/homepage" },
    { title: "Trending", path: "/dramapops/api/v1/dramas/trending" },
    { title: "Popular", path: "/dramapops/api/v1/dramas/popular" },
    { title: "All Dramas", path: "/dramapops/api/v1/dramas" },
  ],
  dramawave: [
    { title: "Popular", path: "/dramawave/api/v1/feed/popular" },
    { title: "Free", path: "/dramawave/api/v1/feed/free" },
    { title: "New", path: "/dramawave/api/v1/feed/new" },
    { title: "For Her", path: "/dramawave/api/v1/feed/female" },
    { title: "For Him", path: "/dramawave/api/v1/feed/male" },
    { title: "Coming Soon", path: "/dramawave/api/v1/feed/coming-soon" },
  ],
  flextv: [
    { title: "Popular", path: "/flextv/api/v1/tabs/1" },
    { title: "Baru", path: "/flextv/api/v1/tabs/2" },
    { title: "Peringkat", path: "/flextv/api/v1/tabs/3" },
    { title: "Wanita", path: "/flextv/api/v1/tabs/7" },
    { title: "Pria", path: "/flextv/api/v1/tabs/8" },
    { title: "Anime", path: "/flextv/api/v1/tabs/11" },
  ],
  bilitv: [
    { title: "Home", path: "/bilitv/api/v1/home" },
    { title: "Recommend", path: "/bilitv/api/v1/recommend" },
    { title: "Dramas", path: "/bilitv/api/v1/dramas" },
  ],
  dotdrama: [
    { title: "Collections", path: "/dotdrama/api/v1/collections" },
    { title: "Dramas", path: "/dotdrama/api/v1/dramas" },
  ],
  flickreels: [
    { title: "For You", path: "/flickreels/api/v1/for-you" },
    { title: "Hot Rank", path: "/flickreels/api/v1/hot-rank" },
  ],
  freereels: [
    { title: "For You", path: "/freereels/api/v1/foryou" },
    { title: "Populer", path: "/freereels/api/v1/popular" },
    { title: "Baru", path: "/freereels/api/v1/new" },
    { title: "Untuk Wanita", path: "/freereels/api/v1/female" },
    { title: "Untuk Pria", path: "/freereels/api/v1/male" },
    { title: "Anime", path: "/freereels/api/v1/anime" },
    { title: "Dubbing", path: "/freereels/api/v1/dubbing" },
    { title: "Coming Soon", path: "/freereels/api/v1/coming-soon" },
  ],
  netshort: [
    { title: "Home", path: "/netshort/api/v1/home" },
  ],
  shortmax: [
    { title: "Home", path: "/shortmax/api/v1/home" },
  ],
  snackshort: [
    { title: "Home", path: "/snackshort/api/v1/home" },
  ],
};

async function fetchSection(path: string, basePath: string): Promise<CatalogItem[]> {
  const r = await apiSafe<unknown>(path);
  const arr = extractArray(r);
  const items: CatalogItem[] = [];
  for (const x of arr) {
    const c = normalizeGeneric(x as GenericShortItem, basePath);
    if (c) items.push(c);
  }
  return items;
}

export default async function ShortProviderPage({
  params,
}: {
  params: { provider: string };
}) {
  const provider = params.provider;
  const info = PROVIDERS.find((p) => p.key === provider && p.hub === "short");
  if (!info) notFound();

  const sections = PROVIDER_SECTIONS[provider] ?? [];
  const basePath = info.basePath;

  const rows = await Promise.all(
    sections.map(async (s) => ({
      title: s.title,
      items: await fetchSection(s.path, basePath),
    })),
  );
  const hasItems = rows.some((r) => r.items.length > 0);

  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <div className="text-xs tracking-widest text-netflix-red font-bold mb-1">
          {info.key.toUpperCase()}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">{info.label}</h1>
        <p className="text-white/60 mt-2 max-w-2xl">{info.description}</p>
      </header>
      {hasItems ? (
        rows.map((r) => <Row key={r.title} title={r.title} items={r.items} />)
      ) : (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-10 text-white/60">
          Sumber data sedang tidak tersedia. Coba lagi nanti.
        </div>
      )}
    </div>
  );
}
