export const API_BASE = "https://scripapi.web.id/gateway.php";

export type ApiInit = RequestInit & { revalidate?: number };

export async function api<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  init: ApiInit = {},
): Promise<T> {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), {
    ...init,
    next: { revalidate: init.revalidate ?? 300 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      Accept: "application/json,*/*",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    throw new Error(`API ${url.pathname} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiSafe<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  init: ApiInit = {},
): Promise<T | null> {
  try {
    return await api<T>(path, params, init);
  } catch (e) {
    console.error("[apiSafe]", path, e);
    return null;
  }
}

export function proxiedImage(src?: string | null): string {
  if (!src) return "/placeholder.svg";
  if (src.startsWith("/")) return src;
  return `/api/img?u=${encodeURIComponent(src)}`;
}
