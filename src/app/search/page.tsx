import { Suspense } from "react";
import Card from "@/components/Card";
import { apiSafe } from "@/lib/api";
import {
  normalizeAnimeItem,
  normalizeKDramaItem,
  normalizeMovieItem,
  normalizeRapidTv,
  type AnimeItem,
  type KDramaItem,
  type MovieItem,
  type RapidTvItem,
} from "@/lib/normalize";
import type { CatalogItem } from "@/lib/types";

export const revalidate = 60;

type Json = Record<string, unknown>;
function isObj(x: unknown): x is Json {
  return !!x && typeof x === "object" && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  if (x === null || x === undefined) return undefined;
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  return undefined;
}

function buildHref(provider: string, id: string) {
  return `/short/${provider}/${encodeURIComponent(id)}`;
}

async function searchMovie(q: string): Promise<CatalogItem[]> {
  const r = await apiSafe<{ items?: MovieItem[] }>("/movie/api/v1/search", {
    q,
    page: 1,
  });
  return (r?.items ?? []).map(normalizeMovieItem);
}
async function searchAnime(q: string): Promise<CatalogItem[]> {
  const r = await apiSafe<{ data?: { anime?: AnimeItem[] } }>(
    "/anime/search",
    { q, page: 1 },
  );
  return (r?.data?.anime ?? []).map(normalizeAnimeItem);
}
async function searchKDrama(q: string): Promise<CatalogItem[]> {
  const r = await apiSafe<{ data?: { results?: KDramaItem[] } }>(
    "/drama-korea/search",
    { q },
  );
  return (r?.data?.results ?? []).map(normalizeKDramaItem);
}
async function searchRapidTv(q: string): Promise<CatalogItem[]> {
  const r = await apiSafe<unknown>("/rapidtv/api/v1/search", {
    q,
    page: 1,
    size: 20,
    lang: "in",
  });
  if (!Array.isArray(r)) return [];
  return (r as RapidTvItem[]).map(normalizeRapidTv);
}
async function search18plus(q: string): Promise<CatalogItem[]> {
  type V = { slug: string; title: string; thumbnail: string; duration?: string };
  const r = await apiSafe<unknown>("/18plus/api/v1/search", { q, page: 1 });
  const list: V[] = Array.isArray(r)
    ? (r as V[])
    : (isObj(r) && Array.isArray((r as Json).data)
      ? ((r as Json).data as V[])
      : []);
  return list.map((v) => ({
    id: v.slug,
    title: v.title,
    poster: v.thumbnail,
    badge: v.duration,
    href: `/18plus/${encodeURIComponent(v.slug)}`,
  }));
}

type Adapter = (raw: unknown) => CatalogItem[];

type ProviderSearch = {
  provider: string;
  label: string;
  path: string;
  params: Record<string, string | number>;
  adapt: Adapter;
};

const genericShort = (provider: string): Adapter => {
  return (raw: unknown) => {
    const arr = extractItems(raw);
    const out: CatalogItem[] = [];
    for (const it of arr) {
      if (!isObj(it)) continue;
      const id =
        str(it.id) ??
        str(it.bookId) ??
        str(it.dramaId) ??
        str(it.drama_id) ??
        str(it.shortplay_id) ??
        str(it.series_id) ??
        str(it.seriesId) ??
        str(it.dramaIntId) ??
        str(it.book_id) ??
        str(it.playlet_id);
      const title =
        str(it.title) ??
        str(it.name) ??
        str(it.bookName) ??
        str(it.book_name) ??
        str(it.series_name) ??
        str(it.short_play_name) ??
        str(it.drama_name);
      const poster =
        str(it.cover) ??
        str(it.coverUrl) ??
        str(it.cover_url) ??
        str(it.poster) ??
        str(it.thumbnail) ??
        str(it.image) ??
        str(it.pic) ??
        str(it.img) ??
        str(it.cover_image) ??
        str(it.horizontalImage) ??
        str(it.coverImage);
      const desc =
        str(it.description) ??
        str(it.introduction) ??
        str(it.intro) ??
        str(it.summary) ??
        str(it.abstract) ??
        str(it.desc) ??
        str(it.recommendIntro);
      const eps =
        (typeof it.episodes === "number" && it.episodes) ||
        (typeof it.total === "number" && it.total) ||
        (typeof it.chapterTotal === "number" && it.chapterTotal) ||
        0;
      if (!id || !title) continue;
      out.push({
        id,
        title,
        poster,
        description: desc,
        badge: eps ? `${eps} eps` : undefined,
        href: buildHref(provider, id),
      });
    }
    return out;
  };
};

// dig into common containers recursively
function extractItems(raw: unknown): unknown[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (!isObj(raw)) return [];
  const keys = [
    "data",
    "items",
    "list",
    "dramas",
    "results",
    "records",
    "rows",
    "videos",
    "anime",
    "guess_plays",
    "content",
    "searchResult",
    "payloads",
  ];
  for (const k of keys) {
    const v = (raw as Json)[k];
    if (Array.isArray(v)) return v;
  }
  // recurse
  for (const k of keys) {
    const v = (raw as Json)[k];
    if (isObj(v)) {
      const inner = extractItems(v);
      if (inner.length) return inner;
    }
  }
  // fallback: any nested array
  for (const v of Object.values(raw as Json)) {
    if (Array.isArray(v) && v.length && isObj(v[0])) return v;
    if (isObj(v)) {
      const inner = extractItems(v);
      if (inner.length) return inner;
    }
  }
  return [];
}

const shortProviders: ProviderSearch[] = [
  {
    provider: "bilitv",
    label: "🔵 BiliTV",
    path: "/bilitv/api/v1/search",
    params: { lang: "id" },
    adapt: genericShort("bilitv"),
  },
  {
    provider: "shortmax",
    label: "⭐ ShortMax",
    path: "/shortmax/api/v1/search",
    params: { lang: "id", page: 1 },
    adapt: genericShort("shortmax"),
  },
  {
    provider: "dramabite",
    label: "🍿 DramaBite",
    path: "/dramabite/api/v1/search",
    params: { lang: "id", limit: 20 },
    adapt: genericShort("dramabite"),
  },
  {
    provider: "melolo",
    label: "💖 MeLoLo",
    path: "/melolo/api/v1/search",
    params: { lang: "id", limit: 30, offset: 0 },
    adapt: genericShort("melolo"),
  },
  {
    provider: "meloshort",
    label: "📚 MeloShort",
    path: "/meloshort/api/v1/dramas/search",
    params: {},
    adapt: genericShort("meloshort"),
  },
  {
    provider: "microdrama",
    label: "🎭 MicroDrama",
    path: "/microdrama/api/v1/dramas/search",
    params: { lang: "id" },
    adapt: genericShort("microdrama"),
  },
  {
    provider: "dramanova",
    label: "💫 DramaNova",
    path: "/dramanova/api/v1/search",
    params: { lang: "in" },
    adapt: genericShort("dramanova"),
  },
  {
    provider: "cashdrama",
    label: "💰 CashDrama",
    path: "/cashdrama/api/v1/search",
    params: { lang: "id", page: 1 },
    adapt: genericShort("cashdrama"),
  },
  {
    provider: "flextv",
    label: "🎞️ FlexTV",
    path: "/flextv/api/v1/search",
    params: { lang: "id", page: 1 },
    adapt: genericShort("flextv"),
  },
  {
    provider: "goodshort",
    label: "✨ GoodShort",
    path: "/goodshort/api/v1/search",
    params: {},
    adapt: genericShort("goodshort"),
  },
  {
    provider: "flickreels",
    label: "🎬 FlickReels",
    path: "/flickreels/api/v1/search-rank",
    params: { lang: "id" },
    adapt: genericShort("flickreels"),
  },
  {
    provider: "starshort",
    label: "🌟 StarShort",
    path: "/starshort/api/v1/dramas/search",
    params: { lang: "4" },
    adapt: genericShort("starshort"),
  },
  {
    provider: "idrama",
    label: "🎀 iDrama",
    path: "/idrama/api/v1/search",
    params: { page_size: 20, lang: "id" },
    adapt: genericShort("idrama"),
  },
  {
    provider: "netshort",
    label: "🔴 NetShort",
    path: "/netshort/api/v1/search-hint",
    params: { lang: "id_ID" },
    adapt: genericShort("netshort"),
  },
  {
    provider: "shotshort",
    label: "📺 ShotShort",
    path: "/shotshort/api/search",
    params: { page: 1, limit: 20, lang: "id" },
    adapt: genericShort("shotshort"),
  },
  {
    provider: "snackshort",
    label: "🍩 SnackShort",
    path: "/snackshort/api/v1/browsing",
    params: { page: 1, pageSize: 20, lang: "Indonesian" },
    adapt: genericShort("snackshort"),
  },
  {
    provider: "minutedrama",
    label: "⏱ MinuteDrama",
    path: "/minutedrama/api/v1/search",
    params: { page: 1, size: 20 },
    adapt: genericShort("minutedrama"),
  },
  {
    provider: "reelife",
    label: "📖 Reelife",
    path: "/reelife/api/v1/search",
    params: { page: 1, size: 20 },
    adapt: genericShort("reelife"),
  },
  {
    provider: "shortbox",
    label: "📦 ShortBox",
    path: "/shortbox/api/hot-search",
    params: { languages: "id" },
    adapt: genericShort("shortbox"),
  },
  {
    provider: "dramawave",
    label: "🌊 DramaWave",
    path: "/dramawave/api/v1/search",
    params: { lang: "id-ID" },
    adapt: genericShort("dramawave"),
  },
  {
    provider: "fundrama",
    label: "🎪 FunDrama",
    path: "/fundrama/api/v1/search",
    params: { lang: "id" },
    adapt: genericShort("fundrama"),
  },
  {
    provider: "sodareels",
    label: "🥤 SodaReels",
    path: "/sodareels/api/v1/search",
    params: { lang: "id" },
    adapt: genericShort("sodareels"),
  },
  {
    provider: "dramanow",
    label: "📕 DramaNow",
    path: "/dramanow/api/v1/search",
    params: { lang: "id" },
    adapt: (raw) => {
      // dramanow uses 'query' param instead of 'q' — handled via path-level override if needed
      return genericShort("dramanow")(raw);
    },
  },
];

async function searchShortProvider(
  p: ProviderSearch,
  q: string,
): Promise<{ provider: string; label: string; items: CatalogItem[] }> {
  const params: Record<string, string | number> = { ...p.params };
  // Some providers use 'keyword' or 'query' instead of 'q'. The param name is
  // part of p.params already; we default to 'q' but allow override via special key __kw
  const keyField = (p.params as Record<string, unknown>).__kw;
  if (typeof keyField === "string") {
    params[keyField] = q;
    delete (params as Record<string, unknown>).__kw;
  } else {
    params.q = q;
  }
  const r = await apiSafe<unknown>(p.path, params);
  if (!r) return { provider: p.provider, label: p.label, items: [] };
  return { provider: p.provider, label: p.label, items: p.adapt(r) };
}

// Patch: override key-name for providers that use different param names
shortProviders.forEach((p) => {
  if (p.provider === "dramaboxv2") {
    (p.params as Record<string, unknown>).__kw = "keyword";
  }
  if (p.provider === "dramanow") {
    (p.params as Record<string, unknown>).__kw = "query";
  }
  if (p.provider === "dramadash" || p.provider === "radreels") {
    (p.params as Record<string, unknown>).__kw = "query";
  }
});

function SearchGrid({
  title,
  items,
}: {
  title: string;
  items: CatalogItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-3">
        {title}{" "}
        <span className="text-white/50 text-sm font-semibold">
          ({items.length})
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {items.map((it) => (
          <Card key={it.id + it.href} item={it} />
        ))}
      </div>
    </section>
  );
}

function SkeletonSection({ title }: { title: string }) {
  return (
    <section className="mb-10" aria-busy="true">
      <h2 className="text-xl font-bold mb-3 text-white/40">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-white/5 rounded-md animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

async function MovieSection({ q }: { q: string }) {
  const items = await searchMovie(q);
  return <SearchGrid title="🎬 Film & Serial" items={items} />;
}
async function AnimeSection({ q }: { q: string }) {
  const items = await searchAnime(q);
  return <SearchGrid title="✨ Anime" items={items} />;
}
async function KDramaSection({ q }: { q: string }) {
  const items = await searchKDrama(q);
  return <SearchGrid title="🇰🇷 Drama Korea" items={items} />;
}
async function RapidTvSection({ q }: { q: string }) {
  const items = await searchRapidTv(q);
  return <SearchGrid title="📡 RapidTV" items={items} />;
}
async function Plus18Section({ q }: { q: string }) {
  const items = await search18plus(q);
  return <SearchGrid title="🔞 18+" items={items} />;
}
async function ShortSection({ p, q }: { p: ProviderSearch; q: string }) {
  const { items, label } = await searchShortProvider(p, q);
  return <SearchGrid title={label} items={items} />;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pt-16 pb-16">
      <header className="mb-6">
        <div className="text-xs tracking-widest text-netflix-red font-bold">
          PENCARIAN
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mt-1">
          {q ? (
            <>
              Hasil untuk <span className="text-white/80">“{q}”</span>
            </>
          ) : (
            "Cari apa saja"
          )}
        </h1>
        {q && (
          <p className="text-white/60 mt-2">
            Memindai Film, Anime, K-Drama, RapidTV, 18+, dan {shortProviders.length}{" "}
            platform short drama — hasil muncul per-section saat selesai.
          </p>
        )}
      </header>
      {!q && (
        <div className="text-white/60">
          Ketik kata kunci di bar pencarian di atas.
        </div>
      )}
      {q && (
        <>
          <Suspense fallback={<SkeletonSection title="🎬 Film & Serial" />}>
            <MovieSection q={q} />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="✨ Anime" />}>
            <AnimeSection q={q} />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="🇰🇷 Drama Korea" />}>
            <KDramaSection q={q} />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="📡 RapidTV" />}>
            <RapidTvSection q={q} />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="🔞 18+" />}>
            <Plus18Section q={q} />
          </Suspense>
          {shortProviders.map((p) => (
            <Suspense
              key={p.provider}
              fallback={<SkeletonSection title={p.label} />}
            >
              <ShortSection p={p} q={q} />
            </Suspense>
          ))}
        </>
      )}
    </div>
  );
}
