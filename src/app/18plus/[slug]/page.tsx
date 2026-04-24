import { apiSafe } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import VideoPlayer, { VideoSource } from "@/components/VideoPlayer";
import { notFound } from "next/navigation";

export const revalidate = 60;

type AdultView = {
  data?: {
    title?: string;
    thumbnail?: string;
    description?: string;
    streams?: Array<{ quality?: string; url?: string }>;
    sources?: Array<{ quality?: string; url?: string; label?: string }>;
  };
};

export default async function AdultDetail({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const r = await apiSafe<AdultView>("/18plus/api/v1/view", { slug });
  if (!r) notFound();
  const d = r.data ?? {};
  const title = d.title ?? slug.replace(/-/g, " ");
  const streams: Array<{ quality?: string; url?: string; label?: string }> = [
    ...(d.streams ?? []),
    ...(d.sources ?? []),
  ];
  const sources: VideoSource[] = streams
    .filter((s) => s.url)
    .map((s) => ({
      label: s.quality ?? s.label ?? "Auto",
      url: s.url!,
      type: /\.m3u8(\?|$)/i.test(s.url!) ? "hls" : "mp4",
    }));
  return (
    <>
      <DetailHero
        title={title}
        poster={d.thumbnail}
        description={d.description}
        backHref="/18plus"
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        <VideoPlayer sources={sources} poster={d.thumbnail} />
      </div>
    </>
  );
}
