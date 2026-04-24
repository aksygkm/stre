import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { apiSafe } from "@/lib/api";
import {
  normalizeAnimeItem,
  normalizeKDramaItem,
  normalizeMovieItem,
  normalizeRapidTv,
  type AnimeItem,
  type KDramaItem,
  type MovieItem,
  type RapidTvItem,
} from "@/lib/normalize";
import type { CatalogItem } from "@/lib/types";
import Link from "next/link";
import { HUBS } from "@/lib/providers";

export const revalidate = 600;

type MovieList = { success: boolean; items: MovieItem[] };
type AnimeHome = {
  status: string;
  data: { anime: AnimeItem[] };
};
type KHome = {
  status: string;
  data: { ongoing?: KDramaItem[]; latest?: KDramaItem[] };
};

async function fetchMovieRow(path: string): Promise<CatalogItem[]> {
  const r = await apiSafe<MovieList>(path);
  return (r?.items ?? []).map(normalizeMovieItem);
}

export default async function HomePage() {
  const [
    trending,
    indoMovies,
    indoDrama,
    kdrama,
    shortTv,
    animeCategory,
    adultComedy,
    westernTv,
    indoDub,
    animeHome,
    kHome,
    rapidList,
  ] = await Promise.all([
    fetchMovieRow("/movie/api/v1/trending"),
    fetchMovieRow("/movie/api/v1/indonesian-movies"),
    fetchMovieRow("/movie/api/v1/indonesian-drama"),
    fetchMovieRow("/movie/api/v1/kdrama"),
    fetchMovieRow("/movie/api/v1/short-tv"),
    fetchMovieRow("/movie/api/v1/anime"),
    fetchMovieRow("/movie/api/v1/adult-comedy"),
    fetchMovieRow("/movie/api/v1/western-tv"),
    fetchMovieRow("/movie/api/v1/indo-dub"),
    apiSafe<AnimeHome>("/anime/home"),
    apiSafe<KHome>("/drama-korea/home"),
    apiSafe<RapidTvItem[]>("/rapidtv/api/v1/dramas"),
  ]);

  const animeRow = (animeHome?.data?.anime ?? [])
    .slice(0, 20)
    .map(normalizeAnimeItem);
  const kOngoing = (kHome?.data?.ongoing ?? []).map(normalizeKDramaItem);
  const kLatest = (kHome?.data?.latest ?? []).map(normalizeKDramaItem);
  const rapid = (rapidList ?? []).slice(0, 20).map(normalizeRapidTv);

  const heroPool = trending
    .filter((i) => i.poster && i.description)
    .slice(0, 5);

  return (
    <>
      <Hero items={heroPool.length ? heroPool : trending.slice(0, 5)} />

      <div className="relative -mt-20 z-20 pb-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 mb-6">
          <h3 className="text-xs tracking-widest text-white/60 font-semibold mb-3">
            JELAJAHI HUB
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {HUBS.map((h) => (
              <Link
                key={h.id}
                href={h.href}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-netflix-surface/80 p-4 hover:border-netflix-red hover:bg-netflix-red/10 transition-colors"
              >
                <div className="text-2xl mb-1">{h.emoji}</div>
                <div className="text-sm font-semibold">{h.label}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/0 to-netflix-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        <Row title="🔥 Sedang Tren" items={trending} seeMoreHref="/movies/trending" />
        <Row title="🇰🇷 K-Drama Terbaru" items={kdrama} seeMoreHref="/drama-korea" />
        <Row title="🇰🇷 K-Drama Ongoing" items={kOngoing} seeMoreHref="/drama-korea" />
        <Row title="✨ Anime Sub Indo" items={animeRow} seeMoreHref="/anime" />
        <Row title="🎬 Film Indonesia" items={indoMovies} seeMoreHref="/movies" />
        <Row title="📺 Drama Indonesia" items={indoDrama} seeMoreHref="/movies" />
        <Row title="📱 Hot Short TV" items={shortTv} seeMoreHref="/short" />
        <Row title="🎥 Anime (Kategori)" items={animeCategory} seeMoreHref="/anime" />
        <Row title="🎭 Komedi Dewasa" items={adultComedy} />
        <Row title="🌎 Western TV" items={westernTv} />
        <Row title="🇮🇩 Dub Indo Terbaik" items={indoDub} />
        <Row title="📡 Drama Populer (RapidTV)" items={rapid} seeMoreHref="/live-tv" />
        <Row title="🇰🇷 Drama Korea Terbaru" items={kLatest} seeMoreHref="/drama-korea" />
      </div>
    </>
  );
}
