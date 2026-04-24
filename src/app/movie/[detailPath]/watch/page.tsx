import { apiSafe } from "@/lib/api";
import Link from "next/link";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 300;

type Episode = {
  episode: number;
  title?: string;
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
    seasons?: Season[];
    trailerUrl?: string;
  };
};

function isUpstreamBroken(u: string | undefined): boolean {
  if (!u) return false;
  try {
    const url = new URL(u);
    return (
      url.hostname === "streamapi.web.id" &&
      (url.pathname === "/player.php" || url.pathname === "/stream.php")
    );
  } catch {
    return false;
  }
}

export default async function WatchMovie({
  params,
  searchParams,
}: {
  params: { detailPath: string };
  searchParams: { s?: string; e?: string };
}) {
  const detailPath = decodeURIComponent(params.detailPath);
  const r = await apiSafe<MovieDetail>("/movie/api/v1/detail", { detailPath });
  if (!r?.success || !r.data) notFound();
  const d = r.data;
  const seasonNum = Number(searchParams.s ?? d.seasons?.[0]?.season ?? 1);
  const season = d.seasons?.find((s) => s.season === seasonNum) || d.seasons?.[0];
  const epNum = Number(searchParams.e ?? season?.episodes[0]?.episode ?? 1);
  const ep = season?.episodes.find((x) => x.episode === epNum);

  if (!season || !ep) notFound();

  const sources: VideoSource[] = [];
  const playerBroken = isUpstreamBroken(ep.playerUrl);
  const streamBroken = isUpstreamBroken(ep.streamUrl);
  const usablePlayer = ep.playerUrl && !playerBroken;
  const usableStream = ep.streamUrl && !streamBroken;
  if (usablePlayer) sources.push({ label: "Player HD", url: ep.playerUrl!, type: "iframe" });
  if (usableStream) sources.push({ label: "Direct Stream", url: ep.streamUrl!, type: "auto" });
  const upstreamDown = !usablePlayer && !usableStream && Boolean(ep.streamUrl || ep.playerUrl);
  if (upstreamDown && d.trailerUrl) {
    sources.push({ label: "Trailer", url: d.trailerUrl, type: "auto" });
  }

  const idxInSeason = season.episodes.findIndex((x) => x.episode === ep.episode);
  const prevEp = idxInSeason > 0 ? season.episodes[idxInSeason - 1] : undefined;
  const nextEp =
    idxInSeason >= 0 && idxInSeason < season.episodes.length - 1
      ? season.episodes[idxInSeason + 1]
      : undefined;

  const base = `/movie/${encodeURIComponent(detailPath)}/watch`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-4">
        <Link
          href={`/movie/${encodeURIComponent(detailPath)}`}
          className="text-sm text-white/60 hover:text-white"
        >
          ← {d.title}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black mt-1">
          {d.title}{" "}
          <span className="text-white/50 font-semibold text-lg">
            · S{season.season} · E{ep.episode}
          </span>
        </h1>
        {ep.title && <p className="text-white/60 text-sm mt-1">{ep.title}</p>}
      </div>
      <VideoPlayer sources={sources} poster={d.poster} />
      {upstreamDown && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-200 text-sm">
          Player film sedang tidak tersedia dari sumber (endpoint <code>streamapi.web.id</code> upstream merespons 404).
          {d.trailerUrl
            ? " Kamu bisa menonton trailer di atas sementara menunggu pemilik API memperbaiki."
            : " Silakan coba judul lain atau section Drama Korea / Anime / Live TV yang sumbernya berbeda."}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {prevEp ? (
          <Link
            href={`${base}?s=${season.season}&e=${prevEp.episode}`}
            className="btn-secondary"
          >
            <ChevronLeft className="h-4 w-4" /> Episode {prevEp.episode}
          </Link>
        ) : (
          <span />
        )}
        {nextEp ? (
          <Link
            href={`${base}?s=${season.season}&e=${nextEp.episode}`}
            className="btn-secondary"
          >
            Episode {nextEp.episode} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <section className="mt-10">
        <h3 className="text-lg font-bold mb-3">Daftar Episode</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {season.episodes.map((e) => (
            <Link
              key={e.episode}
              href={`${base}?s=${season.season}&e=${e.episode}`}
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
