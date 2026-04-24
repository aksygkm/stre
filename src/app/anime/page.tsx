import Row from "@/components/Row";
import Card from "@/components/Card";
import { apiSafe } from "@/lib/api";
import { normalizeAnimeItem, type AnimeItem } from "@/lib/normalize";

export const revalidate = 600;

type AnimeHome = { status: string; data: { anime: AnimeItem[] } };
type Batch = { status: string; data: { batch: AnimeItem[] } };

export default async function AnimePage() {
  const [home, batch] = await Promise.all([
    apiSafe<AnimeHome>("/anime/home"),
    apiSafe<Batch>("/anime/batch"),
  ]);
  const homeItems = (home?.data?.anime ?? []).map(normalizeAnimeItem);
  const batchItems = (batch?.data?.batch ?? []).map(normalizeAnimeItem);
  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black">Anime Sub Indo</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Anime ongoing dan batch dengan subtitle Indonesia.
        </p>
      </header>
      <Row title="Terbaru" items={homeItems} />
      <Row title="Batch / Lengkap" items={batchItems} />
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 mt-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-3">
          Semua
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {homeItems.map((it) => (
            <Card key={it.id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}
