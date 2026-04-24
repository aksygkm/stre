import { apiSafe } from "@/lib/api";
import DetailHero from "@/components/DetailHero";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 600;

type KDramaDetail = {
  status: string;
  data: {
    slug: string;
    synopsis?: string;
    url?: string;
    info?: {
      title?: string;
      original_title?: string;
      duration?: string;
      score?: string;
      director?: string;
      year?: string;
      age_rating?: string;
      genres?: string[];
      country?: string;
      status?: string;
      network?: string;
      poster?: string;
    };
    thumbnail?: string;
    episodes?: Array<{
      episode: string | number;
      title?: string;
      url?: string;
      released?: string;
    }>;
  };
};

export default async function KDramaDetail({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);
  const d = await apiSafe<KDramaDetail>("/drama-korea/detail", { slug });
  if (!d?.data) notFound();
  const data = d.data;
  const info = data.info ?? {};
  const title = info.title ?? slug.replace(/-/g, " ");
  const episodes = data.episodes ?? [];
  const meta: string[] = [];
  if (info.country) meta.push(info.country);
  if (info.status) meta.push(info.status);
  if (info.network) meta.push(info.network);
  if (info.duration) meta.push(info.duration);

  return (
    <>
      <DetailHero
        title={title}
        poster={data.thumbnail}
        description={data.synopsis}
        rating={info.score}
        year={info.year}
        genre={(info.genres ?? []).slice(0, 3).join(" · ")}
        meta={meta}
        backHref="/drama-korea"
        playHref={
          episodes[0]
            ? `/drama-korea/${encodeURIComponent(slug)}/watch?ep=${episodes[0].episode}`
            : undefined
        }
      />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8">
        <h2 className="text-xl font-bold mb-3">Episode</h2>
        {episodes.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {episodes.map((e) => (
              <Link
                key={String(e.episode)}
                href={`/drama-korea/${encodeURIComponent(slug)}/watch?ep=${e.episode}`}
                className="text-center text-sm py-2 rounded border border-white/10 bg-netflix-surface hover:border-netflix-red transition"
              >
                <div className="font-semibold">Ep {e.episode}</div>
                {e.released && (
                  <div className="text-[10px] text-white/50">{e.released}</div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/60">Belum ada episode yang tersedia.</p>
        )}
      </div>
    </>
  );
}
