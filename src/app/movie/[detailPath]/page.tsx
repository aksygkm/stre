import { apiSafe, proxiedImage } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";

export const revalidate = 600;

type Episode = {
  episode: number;
  title?: string;
  cover?: string;
  streamUrl?: string;
  playerUrl?: string;
};
type Season = { season: number; episodes: Episode[] };
type MovieDetail = {
  success: boolean;
  data: {
    id: string;
    title: string;
    poster?: string;
    rating?: string;
    year?: string;
    type?: string;
    genre?: string;
    description?: string;
    duration?: number;
    releaseDate?: string;
    country?: string;
    subtitles?: string;
    detailPath?: string;
    cast?: Array<{ name: string; character?: string; avatar?: string }>;
    seasons?: Season[];
    totalSeasons?: number;
    trailerUrl?: string;
  };
};

export default async function MovieDetailPage({
  params,
}: {
  params: { detailPath: string };
}) {
  const detailPath = decodeURIComponent(params.detailPath);
  const r = await apiSafe<MovieDetail>("/movie/api/v1/detail", { detailPath });
  if (!r?.success || !r.data) notFound();
  const d = r.data;
  const firstEp = d.seasons?.[0]?.episodes?.[0];
  const playHref = firstEp
    ? `/movie/${encodeURIComponent(detailPath)}/watch?s=${d.seasons![0].season}&e=${firstEp.episode}`
    : undefined;

  const meta: string[] = [];
  if (d.country) meta.push(d.country);
  if (d.duration && d.duration > 0) meta.push(`${d.duration} min`);
  if (d.totalSeasons && d.totalSeasons > 1) meta.push(`${d.totalSeasons} Seasons`);

  return (
    <>
      <DetailHero
        title={d.title}
        poster={d.poster}
        description={d.description}
        rating={d.rating}
        year={d.year}
        genre={d.genre}
        meta={meta}
        playHref={playHref}
        backHref="/movies"
      />
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 space-y-10">
        {d.seasons?.map((s) => (
          <section key={s.season}>
            <h2 className="text-xl font-bold mb-3">
              Season {s.season}{" "}
              <span className="text-white/50 text-sm">
                ({s.episodes.length} episode)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {s.episodes.map((ep) => (
                <Link
                  key={ep.episode}
                  href={`/movie/${encodeURIComponent(detailPath)}/watch?s=${s.season}&e=${ep.episode}`}
                  className="group flex gap-3 bg-netflix-surface rounded-lg overflow-hidden border border-white/5 hover:border-netflix-red transition-colors"
                >
                  <div className="relative w-32 aspect-video shrink-0 bg-black">
                    {ep.cover && (
                      <Image
                        src={proxiedImage(ep.cover)}
                        alt={ep.title || `Ep ${ep.episode}`}
                        fill
                        sizes="128px"
                        className="object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="h-9 w-9 rounded-full bg-black/60 border border-white/40 flex items-center justify-center group-hover:bg-netflix-red group-hover:border-netflix-red transition">
                        <Play className="h-4 w-4 fill-white" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-2 pr-3">
                    <div className="text-xs text-white/60">
                      Episode {ep.episode}
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {ep.title || `Episode ${ep.episode}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {d.cast && d.cast.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">Pemeran</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {d.cast.map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  className="w-32 shrink-0 text-center"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-netflix-surface">
                    {c.avatar ? (
                      <Image
                        src={proxiedImage(c.avatar)}
                        alt={c.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
                        {c.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-xs font-semibold truncate">
                    {c.name}
                  </div>
                  {c.character && (
                    <div className="text-[11px] text-white/50 truncate">
                      {c.character}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
