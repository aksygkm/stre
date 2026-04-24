import { apiSafe } from "@/lib/api";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type KStream = {
  status: string;
  data: {
    slug: string;
    episode: string;
    url: string;
    streams?: Array<{
      resolution?: string;
      server?: string;
      url: string;
      mode?: string;
    }>;
  };
};

function absolutizeDramaId(u: string): string {
  if (/^https?:\/\//i.test(u)) return u;
  return "https://drama-id.com" + (u.startsWith("/") ? u : "/" + u);
}

export default async function KDramaWatch({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { ep?: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const episode = searchParams.ep ?? "1";
  const d = await apiSafe<KStream>("/drama-korea/stream", {
    slug,
    episode,
  });
  if (!d?.data) notFound();
  const streams = d.data.streams ?? [];
  const sources: VideoSource[] = streams
    .filter((s) => s.url)
    .map((s) => ({
      label: `${s.resolution ?? "Auto"} · ${s.server ?? ""}`.trim(),
      url: absolutizeDramaId(s.url),
      type: "iframe" as const,
    }));
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-4">
        <Link
          href={`/drama-korea/${encodeURIComponent(slug)}`}
          className="text-sm text-white/60 hover:text-white"
        >
          ← Kembali
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black mt-1">
          {slug.replace(/-/g, " ")}{" "}
          <span className="text-white/50 font-semibold text-lg">
            · Episode {episode}
          </span>
        </h1>
      </div>
      <VideoPlayer sources={sources} />
      {sources.length === 0 && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-200 text-sm">
          Tidak ada sumber streaming yang tersedia untuk episode ini.
        </div>
      )}
    </div>
  );
}
