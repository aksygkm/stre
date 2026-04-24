import type { CatalogItem } from "./types";

// ------- Movie (scripapi /movie) -------
export type MovieItem = {
  id: string;
  title: string;
  poster?: string;
  rating?: string;
  year?: string;
  type?: string;
  detailPath?: string;
  genre?: string;
  description?: string;
};

export function normalizeMovieItem(x: MovieItem): CatalogItem {
  return {
    id: x.id,
    title: x.title,
    poster: x.poster,
    rating: x.rating,
    year: x.year,
    description: x.description,
    genre: x.genre,
    badge: x.type ? x.type.toUpperCase() : undefined,
    href: x.detailPath ? `/movie/${encodeURIComponent(x.detailPath)}` : "#",
  };
}

// ------- Anime (scripapi /anime/home) -------
export type AnimeItem = {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  latest_episode?: string;
};

export function normalizeAnimeItem(x: AnimeItem): CatalogItem {
  return {
    id: x.slug,
    title: x.title.replace(/\s*Subtitle Indonesia$/i, ""),
    poster: x.thumbnail,
    badge: x.latest_episode || x.type,
    genre: x.type,
    href: `/anime/${encodeURIComponent(x.slug)}`,
  };
}

// ------- Drama Korea -------
export type KDramaItem = {
  slug: string;
  title: string;
  thumbnail: string;
  url?: string;
  genres?: string[];
};

export function normalizeKDramaItem(x: KDramaItem): CatalogItem {
  return {
    id: x.slug,
    title: x.title.replace(/\s*Subtitle Indonesia$/i, "").trim(),
    poster: x.thumbnail,
    genre: (x.genres || []).slice(0, 3).join(" · "),
    href: `/drama-korea/${encodeURIComponent(x.slug)}`,
  };
}

// ------- RapidTV -------
export type RapidTvItem = {
  id: string;
  title: string;
  poster: string;
  description?: string;
  totalEpisodes?: number;
};

export function normalizeRapidTv(x: RapidTvItem): CatalogItem {
  return {
    id: x.id,
    title: x.title,
    poster: x.poster,
    badge: x.totalEpisodes ? `${x.totalEpisodes} eps` : undefined,
    description: x.description,
    href: `/live-tv/${encodeURIComponent(x.id)}`,
  };
}

// ------- Generic short drama normalizer -------
export type GenericShortItem = Record<string, unknown>;

export function normalizeGeneric(
  x: GenericShortItem,
  providerBase: string,
): CatalogItem | null {
  const id = (x.id ??
    x.bookId ??
    x.dramaId ??
    x.shortId ??
    x.vid ??
    x.seriesId ??
    x._id ??
    x.uid) as string | undefined;
  const title = (x.title ??
    x.name ??
    x.dramaName ??
    x.seriesName ??
    x.bookName) as string | undefined;
  const poster = (x.cover ??
    x.coverUrl ??
    x.poster ??
    x.thumbnail ??
    x.image ??
    x.pic ??
    x.img ??
    x.coverImage) as string | undefined;
  if (!id || !title) return null;
  return {
    id: String(id),
    title: String(title),
    poster: poster ? String(poster) : undefined,
    description: (x.description ?? x.introduction ?? x.intro ?? x.summary) as
      | string
      | undefined,
    badge: (x.totalEpisodes || x.episodeCount
      ? `${x.totalEpisodes || x.episodeCount} eps`
      : undefined) as string | undefined,
    href: `${providerBase}/${encodeURIComponent(String(id))}`,
  };
}

export function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of [
      "data",
      "items",
      "list",
      "dramas",
      "result",
      "results",
      "videos",
      "records",
      "content",
    ]) {
      const v = obj[key];
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") {
        const inner = extractArray(v);
        if (inner.length) return inner;
      }
    }
  }
  return [];
}
