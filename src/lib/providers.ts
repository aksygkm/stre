// Catalog of all supported providers grouped by hub. Used for discovery pages.
export type ProviderInfo = {
  key: string;
  label: string;
  description: string;
  basePath: string; // Path prefix inside the site to browse this provider
  hub: "movies" | "anime" | "drama" | "short" | "live" | "adult";
  accent?: string;
};

export const PROVIDERS: ProviderInfo[] = [
  {
    key: "movie",
    label: "Film & Serial",
    description: "Film layar lebar, drama, anime dub, dan serial populer",
    basePath: "/movies",
    hub: "movies",
    accent: "from-red-600 to-red-900",
  },
  {
    key: "anime",
    label: "Anime Sub Indo",
    description: "Anime terbaru dengan subtitle Indonesia",
    basePath: "/anime",
    hub: "anime",
    accent: "from-fuchsia-600 to-indigo-900",
  },
  {
    key: "drama-korea",
    label: "Drama Korea",
    description: "Drama Korea ongoing & batch sub Indo",
    basePath: "/drama-korea",
    hub: "drama",
    accent: "from-pink-500 to-rose-900",
  },
  {
    key: "rapidtv",
    label: "Live / Short Hits",
    description: "Drama pendek trending harian",
    basePath: "/live-tv",
    hub: "live",
    accent: "from-emerald-500 to-teal-900",
  },
  {
    key: "reelshort",
    label: "ReelShort",
    description: "Short drama For You, trending, romansa",
    basePath: "/short/reelshort",
    hub: "short",
  },
  {
    key: "dramaboxv2",
    label: "DramaBox",
    description: "Home, ranking, rekomendasi dramabox",
    basePath: "/short/dramaboxv2",
    hub: "short",
  },
  {
    key: "dramapops",
    label: "DramaPops",
    description: "Drama trending dan popular dari dramapops",
    basePath: "/short/dramapops",
    hub: "short",
  },
  {
    key: "dramawave",
    label: "DramaWave",
    description: "Feed drama pilihan pria/wanita/coming-soon",
    basePath: "/short/dramawave",
    hub: "short",
  },
  {
    key: "flextv",
    label: "FlexTV",
    description: "Original drama asia",
    basePath: "/short/flextv",
    hub: "short",
  },
  {
    key: "bilitv",
    label: "BiliTV",
    description: "Drama dari bilitv",
    basePath: "/short/bilitv",
    hub: "short",
  },
  {
    key: "dotdrama",
    label: "DotDrama",
    description: "Koleksi hot/for-you dotdrama",
    basePath: "/short/dotdrama",
    hub: "short",
  },
  {
    key: "flickreels",
    label: "FlickReels",
    description: "Hot rank & kategori flickreels",
    basePath: "/short/flickreels",
    hub: "short",
  },
  {
    key: "freereels",
    label: "FreeReels",
    description: "Drama populer & untuk wanita/pria",
    basePath: "/short/freereels",
    hub: "short",
  },
  {
    key: "netshort",
    label: "NetShort",
    description: "Short drama",
    basePath: "/short/netshort",
    hub: "short",
  },
  {
    key: "shortmax",
    label: "ShortMax",
    description: "Drama pendek",
    basePath: "/short/shortmax",
    hub: "short",
  },
  {
    key: "snackshort",
    label: "SnackShort",
    description: "Feed drama snack",
    basePath: "/short/snackshort",
    hub: "short",
  },
  {
    key: "18plus",
    label: "Dewasa 18+",
    description: "Konten hanya untuk 18 tahun ke atas",
    basePath: "/18plus",
    hub: "adult",
    accent: "from-rose-700 to-black",
  },
];

export const HUBS: Array<{
  id: string;
  label: string;
  href: string;
  emoji: string;
}> = [
  { id: "movies", label: "Film", href: "/movies", emoji: "🎬" },
  { id: "drama", label: "Drama Korea", href: "/drama-korea", emoji: "🇰🇷" },
  { id: "anime", label: "Anime", href: "/anime", emoji: "✨" },
  { id: "short", label: "Short Drama", href: "/short", emoji: "📱" },
  { id: "live", label: "Live & Hits", href: "/live-tv", emoji: "📡" },
  { id: "adult", label: "18+", href: "/18plus", emoji: "🔞" },
];
