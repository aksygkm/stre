import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return new Response("missing u", { status: 400 });
  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return new Response("invalid url", { status: 400 });
  }
  if (!/^https?:$/.test(target.protocol)) {
    return new Response("invalid protocol", { status: 400 });
  }
  // Unwrap known broken upstream proxies (streamapi.web.id image-proxy.php is currently 404).
  if (
    /image-proxy\.php$/i.test(target.pathname) &&
    target.searchParams.get("url")
  ) {
    const encoded = target.searchParams.get("url")!;
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const inner = new URL(decoded);
      if (/^https?:$/.test(inner.protocol)) target = inner;
    } catch {
      /* keep original */
    }
  }
  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Referer: `${target.origin}/`,
        Accept: "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });
    if (!upstream.ok) {
      return new Response("upstream " + upstream.status, { status: 502 });
    }
    const ct = upstream.headers.get("content-type") || "image/jpeg";
    const buf = await upstream.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new Response("fetch error", { status: 502 });
  }
}
