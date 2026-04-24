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

type MovieSearch = { success: boolean; items?: MovieItem[] };
type AnimeSearch = { status: string; data?: { anime?: AnimeItem[] } };
type KSearch = { status: string; data?: KDramaItem[] };

async function searchAll(q: string) {
  if (!q.trim())
    return { movie: [], anime: [], kdrama: [], rapidtv: [] };
  const [mv, an, kr, rp] = await Promise.all([
    apiSafe<MovieSearch>("/movie/api/v1/search", { query: q }),
    apiSafe<AnimeSearch>("/anime/search", { query: q }),
    apiSafe<KSearch>("/drama-korea/search", { query: q }),
    apiSafe<RapidTvItem[]>("/rapidtv/api/v1/search", { query: q }),
  ]);
  return {
    movie: (mv?.items ?? []).map(normalizeMovieItem),
    anime: (an?.data?.anime ?? []).map(normalizeAnimeItem),
    kdrama: (kr?.data ?? []).map(normalizeKDramaItem),
    rapidtv: (rp ?? []).map(normalizeRapidTv),
  };
}

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = await searchAll(q);
  const total =
    results.movie.length +
    results.anime.length +
    results.kdrama.length +
    results.rapidtv.length;
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
            Ditemukan {total} hasil dari Film, Anime, K-Drama, dan RapidTV.
          </p>
        )}
      </header>
      {!q && (
        <div className="text-white/60">
          Ketik kata kunci di bar pencarian di atas.
        </div>
      )}
      <SearchGrid title="🎬 Film & Serial" items={results.movie} />
      <SearchGrid title="✨ Anime" items={results.anime} />
      <SearchGrid title="🇰🇷 Drama Korea" items={results.kdrama} />
      <SearchGrid title="📡 RapidTV" items={results.rapidtv} />
      {q && total === 0 && (
        <div className="text-white/60">Tidak ada hasil yang cocok.</div>
      )}
    </div>
  );
}
