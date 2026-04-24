import { apiSafe } from "@/lib/api";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type Server = { name: string; type: "embed" | "iframe" | string; url: string };
type AnimeWatch = {
  status: string;
  data: {
    title?: string;
    streaming_servers?: Server[];
    download_links?: unknown;
  };
};

export default async function AnimeWatchPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const d = await apiSafe<AnimeWatch>("/anime/watch", { slug });
  if (!d?.data) notFound();

  const servers = (d.data.streaming_servers ?? []).filter(
    (s) =>
      s.url &&
      /^https?:\/\//i.test(s.url) &&
      !/Video Not Available/i.test(s.url),
  );

  const sources: VideoSource[] = servers.map((s) => ({
    label: s.name,
    url: s.url,
    type: "iframe",
  }));

  const title = d.data.title ?? slug.replace(/-/g, " ");
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-4">
        <Link
          href={`/anime/${encodeURIComponent(slug)}`}
          className="text-sm text-white/60 hover:text-white"
        >
          ← Kembali
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black mt-1">{title}</h1>
      </div>
      <VideoPlayer sources={sources} />
      {sources.length === 0 && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-200 text-sm">
          Tidak ada server streaming yang tersedia untuk episode ini.
        </div>
      )}
    </div>
  );
}
