import { apiSafe } from "@/lib/api";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 300;

type RapidEpisode = {
  episode: number;
  videos?: Array<{ quality?: string; url?: string; duration?: number }>;
};
type RapidTvDetail = {
  id: string;
  title: string;
  poster?: string;
  episodes?: RapidEpisode[];
};

export default async function RapidTvWatch({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ep?: string };
}) {
  const id = decodeURIComponent(params.id);
  const d = await apiSafe<RapidTvDetail>(`/rapidtv/api/v1/dramas/${id}`);
  if (!d) notFound();
  const epNum = Number(searchParams.ep ?? d.episodes?.[0]?.episode ?? 1);
  const ep = d.episodes?.find((e) => e.episode === epNum) ?? d.episodes?.[0];
  if (!ep) notFound();
  const sources: VideoSource[] = (ep.videos ?? [])
    .filter((v) => v.url)
    .map((v) => ({
      label: v.quality ?? "Auto",
      url: v.url!,
      type: "mp4" as const,
    }));

  const episodes = d.episodes ?? [];
  const idx = episodes.findIndex((e) => e.episode === ep.episode);
  const prev = idx > 0 ? episodes[idx - 1] : undefined;
  const next = idx >= 0 && idx < episodes.length - 1 ? episodes[idx + 1] : undefined;
  const base = `/live-tv/${encodeURIComponent(id)}/watch`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-4">
        <Link
          href={`/live-tv/${encodeURIComponent(id)}`}
          className="text-sm text-white/60 hover:text-white"
        >
          ← {d.title}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black mt-1">
          {d.title}{" "}
          <span className="text-white/50 font-semibold text-lg">
            · Ep {ep.episode}
          </span>
        </h1>
      </div>
      <VideoPlayer sources={sources} poster={d.poster} />
      <div className="mt-6 flex items-center justify-between">
        {prev ? (
          <Link href={`${base}?ep=${prev.episode}`} className="btn-secondary">
            <ChevronLeft className="h-4 w-4" /> Ep {prev.episode}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${base}?ep=${next.episode}`} className="btn-secondary">
            Ep {next.episode} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
      <section className="mt-10">
        <h3 className="text-lg font-bold mb-3">Daftar Episode</h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {episodes.map((e) => (
            <Link
              key={e.episode}
              href={`${base}?ep=${e.episode}`}
              className={`text-center text-sm py-2 rounded border transition ${
                e.episode === ep.episode
                  ? "bg-netflix-red border-netflix-red"
                  : "bg-netflix-surface border-white/5 hover:border-white/40"
              }`}
            >
              {e.episode}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
