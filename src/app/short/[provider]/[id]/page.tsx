import { apiSafe } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import { PROVIDERS } from "@/lib/providers";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 300;

type ProviderSpec = {
  detail: string;
  title: string[];
  poster: string[];
  desc: string[];
  episodes?: string[];
  episodeKey?: string[];
  videoKey?: string[];
  coverKey?: string[];
};

// How to fetch detail + episodes + video URL for each provider.
const SPEC: Record<string, ProviderSpec> = {
  reelshort: {
    detail: "/reelshort/api/v1/drama/:id",
    title: ["data.name", "data.title", "name", "title"],
    poster: ["data.cover", "data.coverUrl", "data.poster", "cover"],
    desc: ["data.introduction", "data.description", "introduction"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "episodeId", "index"],
    videoKey: ["videoUrl", "url", "playUrl"],
    coverKey: ["cover", "coverUrl", "thumbnail"],
  },
  dramaboxv2: {
    detail: "/dramaboxv2/api/drama/:id",
    title: ["data.name", "data.title"],
    poster: ["data.cover", "data.coverUrl", "data.poster"],
    desc: ["data.introduction", "data.description"],
    episodes: ["data.chapters", "data.episodes"],
    episodeKey: ["index", "id", "episodeId"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover", "coverUrl"],
  },
  dramapops: {
    detail: "/dramapops/api/v1/drama/:id",
    title: ["data.title", "title", "data.name"],
    poster: ["data.cover", "data.poster", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["episode", "id", "index"],
    videoKey: ["video", "videoUrl", "url"],
    coverKey: ["cover", "thumbnail"],
  },
  dramawave: {
    detail: "/dramawave/api/v1/dramas/:id",
    title: ["data.name", "name"],
    poster: ["data.cover", "cover"],
    desc: ["data.introduction", "introduction"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "index"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  flextv: {
    detail: "/flextv/api/v1/series/:id",
    title: ["data.name", "name"],
    poster: ["data.poster", "data.cover", "poster"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "index"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  bilitv: {
    detail: "/bilitv/api/v1/drama/:id",
    title: ["data.title", "title"],
    poster: ["data.cover", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["episode", "ep"],
    videoKey: ["url", "videoUrl"],
    coverKey: ["cover"],
  },
  dotdrama: {
    detail: "/dotdrama/api/v1/dramas/:id",
    title: ["data.title", "title"],
    poster: ["data.cover", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "index"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  flickreels: {
    detail: "/flickreels/api/v1/play/:id",
    title: ["data.name", "name"],
    poster: ["data.cover", "cover"],
    desc: ["data.introduction", "introduction"],
    episodes: ["data.chapters", "chapters"],
    episodeKey: ["id", "chapterId"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  freereels: {
    detail: "/freereels/api/v1/dramas/:id",
    title: ["data.name", "name"],
    poster: ["data.cover", "cover"],
    desc: ["data.introduction", "introduction"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "episode"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  netshort: {
    detail: "/netshort/api/v1/drama/:id",
    title: ["data.title", "title"],
    poster: ["data.cover", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "episode"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  shortmax: {
    detail: "/shortmax/api/v1/drama/:id",
    title: ["data.title", "title"],
    poster: ["data.cover", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "episode"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
  snackshort: {
    detail: "/snackshort/api/v1/drama/:id",
    title: ["data.title", "title"],
    poster: ["data.cover", "cover"],
    desc: ["data.description", "description"],
    episodes: ["data.episodes", "episodes"],
    episodeKey: ["id", "episode"],
    videoKey: ["videoUrl", "url"],
    coverKey: ["cover"],
  },
};

function get(obj: unknown, paths: string[]): unknown {
  for (const p of paths) {
    const parts = p.split(".");
    let cur: unknown = obj;
    let ok = true;
    for (const k of parts) {
      if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[k];
      } else {
        ok = false;
        break;
      }
    }
    if (ok && cur !== undefined && cur !== null && cur !== "") return cur;
  }
  return undefined;
}

export default async function ShortDetailPage({
  params,
  searchParams,
}: {
  params: { provider: string; id: string };
  searchParams: { ep?: string };
}) {
  const provider = params.provider;
  const info = PROVIDERS.find((p) => p.key === provider);
  const spec = SPEC[provider];
  if (!info || !spec) notFound();
  const id = decodeURIComponent(params.id);
  const path = spec.detail.replace(":id", encodeURIComponent(id));
  const data = await apiSafe<unknown>(path);
  if (!data) notFound();

  const title = (get(data, spec.title) as string) ?? id;
  const poster = get(data, spec.poster) as string | undefined;
  const description = get(data, spec.desc) as string | undefined;
  const episodesArr = (get(data, spec.episodes ?? []) as unknown[]) || [];
  const episodes = episodesArr.map((e, i) => {
    const rec = e as Record<string, unknown>;
    const ek = spec.episodeKey ?? ["id"];
    const vk = spec.videoKey ?? ["videoUrl", "url"];
    const ck = spec.coverKey ?? ["cover"];
    const key =
      ek
        .map((k) => rec[k])
        .find((v) => v !== undefined && v !== null) ?? i + 1;
    const video = vk.map((k) => rec[k]).find((v) => typeof v === "string");
    const cover = ck.map((k) => rec[k]).find((v) => typeof v === "string");
    return {
      key: String(key),
      index: i + 1,
      video: video as string | undefined,
      cover: cover as string | undefined,
    };
  });

  const selectedEp = searchParams.ep
    ? episodes.find((e) => e.key === searchParams.ep) ||
      episodes.find((e) => String(e.index) === searchParams.ep) ||
      episodes[0]
    : episodes[0];

  const sources: VideoSource[] = selectedEp?.video
    ? [
        {
          label: `Episode ${selectedEp.index}`,
          url: selectedEp.video,
          type: /\.(m3u8)(\?|$)/i.test(selectedEp.video) ? "hls" : "mp4",
        },
      ]
    : [];

  const base = `/short/${provider}/${encodeURIComponent(id)}`;

  return (
    <>
      <DetailHero
        title={title}
        poster={poster}
        description={description}
        backHref={info.basePath}
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {sources.length > 0 ? (
          <section>
            <h2 className="text-xl font-bold mb-3">
              Sedang diputar · Episode {selectedEp?.index}
            </h2>
            <VideoPlayer sources={sources} poster={poster} />
          </section>
        ) : null}

        {episodes.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-3">Daftar Episode</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {episodes.map((e) => (
                <Link
                  key={e.key}
                  href={`${base}?ep=${encodeURIComponent(e.key)}`}
                  className={`text-center text-sm py-2 rounded border transition ${
                    selectedEp?.key === e.key
                      ? "bg-netflix-red border-netflix-red"
                      : "bg-netflix-surface border-white/5 hover:border-white/40"
                  }`}
                >
                  {e.index}
                </Link>
              ))}
            </div>
          </section>
        )}

        {sources.length === 0 && episodes.length === 0 && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-200 text-sm">
            Sumber episode tidak tersedia atau struktur data provider belum
            didukung untuk pemutaran langsung.
          </div>
        )}
      </div>
    </>
  );
}
