// Normalized catalog item used everywhere for cards/rows
export type CatalogItem = {
  id: string;
  title: string;
  poster?: string;
  backdrop?: string;
  year?: string | number;
  rating?: string | number;
  description?: string;
  genre?: string;
  badge?: string;
  href: string;
};

export type CatalogRow = {
  title: string;
  items: CatalogItem[];
  seeMoreHref?: string;
};
