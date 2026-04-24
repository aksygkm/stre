import Row from "@/components/Row";
import { apiSafe } from "@/lib/api";
import { normalizeMovieItem, type MovieItem } from "@/lib/normalize";
import type { CatalogItem } from "@/lib/types";

export const revalidate = 600;

type MovieList = { success: boolean; items: MovieItem[] };

const SECTIONS: Array<{ title: string; path: string }> = [
  { title: "🔥 Sedang Tren", path: "/movie/api/v1/trending" },
  { title: "🇮🇩 Film Indonesia", path: "/movie/api/v1/indonesian-movies" },
  { title: "📺 Drama Indonesia", path: "/movie/api/v1/indonesian-drama" },
  { title: "🇰🇷 K-Drama Terbaru", path: "/movie/api/v1/kdrama" },
  { title: "📱 Hot Short TV", path: "/movie/api/v1/short-tv" },
  { title: "🎥 Masuk ke Dunia Anime", path: "/movie/api/v1/anime" },
  { title: "🎭 Canda Dewasa", path: "/movie/api/v1/adult-comedy" },
  { title: "🤠 Western TV", path: "/movie/api/v1/western-tv" },
  { title: "🇮🇩 Tayangan Dub Indo Terbaik!", path: "/movie/api/v1/indo-dub" },
];

async function fetchRow(path: string): Promise<CatalogItem[]> {
  const r = await apiSafe<MovieList>(path);
  return (r?.items ?? []).map(normalizeMovieItem);
}

export default async function MoviesHub() {
  const rows = await Promise.all(
    SECTIONS.map(async (s) => ({
      title: s.title,
      items: await fetchRow(s.path),
    })),
  );
  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black">Film & Serial</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Nonton film layar lebar, serial TV, drama, dan kategori pilihan
          terbaru.
        </p>
      </header>
      {rows.map((r) => (
        <Row key={r.title} title={r.title} items={r.items} />
      ))}
    </div>
  );
}
