import { apiSafe } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type RapidEpisode = {
  episode: number;
  videos?: Array<{ quality?: string; url?: string; duration?: number }>;
};

type RapidTvDetail = {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  totalEpisodes?: number;
  episodes?: RapidEpisode[];
};

export default async function RapidTvDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  const d = await apiSafe<RapidTvDetail>(`/rapidtv/api/v1/dramas/${id}`);
  if (!d) notFound();
  const first = d.episodes?.[0]?.episode ?? 1;
  return (
    <>
      <DetailHero
        title={d.title}
        poster={d.poster}
        description={d.description}
        meta={
          d.totalEpisodes
            ? [`${d.totalEpisodes} episode`]
            : undefined
        }
        backHref="/live-tv"
        playHref={`/live-tv/${encodeURIComponent(id)}/watch?ep=${first}`}
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
        <h2 className="text-xl font-bold mb-3">Episode</h2>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {(d.episodes ?? []).map((e) => (
            <Link
              key={e.episode}
              href={`/live-tv/${encodeURIComponent(id)}/watch?ep=${e.episode}`}
              className="text-center text-sm py-2 rounded border border-white/10 bg-netflix-surface hover:border-netflix-red transition"
            >
              {e.episode}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
