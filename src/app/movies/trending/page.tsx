import Card from "@/components/Card";
import { apiSafe } from "@/lib/api";
import { normalizeMovieItem, type MovieItem } from "@/lib/normalize";

export const revalidate = 600;

export default async function TrendingPage() {
  const r = await apiSafe<{ success: boolean; items: MovieItem[] }>(
    "/movie/api/v1/trending",
  );
  const items = (r?.items ?? []).map(normalizeMovieItem);
  return (
    <div className="pt-16 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-16">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black">🔥 Sedang Tren</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Tontonan paling populer saat ini.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {items.map((it) => (
          <Card key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}
