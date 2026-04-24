import { apiSafe } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";

export const revalidate = 600;

type AnimeDetail = {
  status: string;
  data: {
    thumbnail?: string;
    info?: Array<{ label?: string; value?: string }> | Record<string, string>;
    episodes?: Array<{ slug?: string; title?: string; number?: string }>;
    synopsis?: string;
    title?: string;
  };
};

export default async function AnimeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const d = await apiSafe<AnimeDetail>("/anime/detail", { slug });
  if (!d?.data) notFound();

  const title = d.data.title ?? slug.replace(/-/g, " ");
  const episodes = d.data.episodes ?? [];

  return (
    <>
      <DetailHero
        title={title}
        poster={d.data.thumbnail}
        description={d.data.synopsis}
        backHref="/anime"
        playHref={`/anime/${encodeURIComponent(slug)}/watch`}
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
        <h2 className="text-xl font-bold mb-3">Episode</h2>
        {episodes.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {episodes.map((e, i) => (
              <Link
                key={(e.slug ?? String(i)) + i}
                href={`/anime/${encodeURIComponent(e.slug ?? slug)}/watch`}
                className="text-sm py-2 px-3 rounded border border-white/10 bg-netflix-surface hover:border-netflix-red transition"
              >
                {e.title ?? `Episode ${e.number ?? i + 1}`}
              </Link>
            ))}
          </div>
        ) : (
          <Link
            href={`/anime/${encodeURIComponent(slug)}/watch`}
            className="btn-primary"
          >
            <Play className="h-5 w-5 fill-black" /> Langsung Tonton
          </Link>
        )}
      </div>
    </>
  );
}
