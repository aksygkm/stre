import Card from "@/components/Card";
import { apiSafe } from "@/lib/api";
import { normalizeRapidTv, type RapidTvItem } from "@/lib/normalize";

export const revalidate = 600;

export default async function LiveTvPage() {
  const list = (await apiSafe<RapidTvItem[]>("/rapidtv/api/v1/dramas")) ?? [];
  const items = list.map(normalizeRapidTv);
  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black">Live & Drama Hits</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Drama pendek trending harian dari RapidTV, siap ditonton dengan
          kualitas hingga 720p.
        </p>
      </header>
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {items.map((it) => (
            <Card key={it.id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}
