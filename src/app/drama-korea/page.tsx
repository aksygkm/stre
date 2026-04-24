import Row from "@/components/Row";
import Card from "@/components/Card";
import { apiSafe } from "@/lib/api";
import { normalizeKDramaItem, type KDramaItem } from "@/lib/normalize";

export const revalidate = 600;

type KHome = {
  status: string;
  data: { ongoing?: KDramaItem[]; latest?: KDramaItem[] };
};

export default async function KoreanDramaPage() {
  const d = await apiSafe<KHome>("/drama-korea/home");
  const ongoing = (d?.data?.ongoing ?? []).map(normalizeKDramaItem);
  const latest = (d?.data?.latest ?? []).map(normalizeKDramaItem);
  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black">Drama Korea</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Drama Korea ongoing dan batch sub Indo.
        </p>
      </header>
      <Row title="🇰🇷 Ongoing" items={ongoing} />
      <Row title="🆕 Terbaru" items={latest} />
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 mt-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-3">
          Semua
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {[...ongoing, ...latest].map((it) => (
            <Card key={it.id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}
