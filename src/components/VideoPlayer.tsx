"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type VideoSource = {
  label: string;
  url: string;
  type: "mp4" | "hls" | "iframe" | "auto";
  poster?: string;
};

export default function VideoPlayer({
  sources,
  poster,
}: {
  sources: VideoSource[];
  poster?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);

  const source = sources[activeIdx];

  useEffect(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
    setLoading(true);
    if (!source) return;
    if (source.type === "iframe") {
      setLoading(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    const type =
      source.type === "auto"
        ? /\.m3u8(\?|$)/i.test(source.url)
          ? "hls"
          : "mp4"
        : source.type;

    const onReady = () => setLoading(false);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", () => setLoading(false));

    if (type === "hls") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source.url;
      } else {
        import("hls.js").then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true });
            hls.loadSource(source.url);
            hls.attachMedia(video);
            hlsRef.current = hls;
          } else {
            video.src = source.url;
          }
        });
      }
    } else {
      video.src = source.url;
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [source]);

  if (!sources.length) {
    return (
      <div className="aspect-video flex items-center justify-center bg-black text-white/60 rounded-lg">
        Tidak ada sumber video tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {source.type === "iframe" ? (
          <iframe
            key={source.url}
            src={source.url}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            onLoad={() => setLoading(false)}
          />
        ) : (
          <video
            key={source.url}
            ref={videoRef}
            controls
            playsInline
            poster={poster}
            className="h-full w-full bg-black"
            preload="metadata"
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <Loader2 className="h-10 w-10 animate-spin text-white/80" />
          </div>
        )}
      </div>
      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((s, i) => (
            <button
              key={`${s.url}-${i}`}
              onClick={() => setActiveIdx(i)}
              className={`text-xs px-3 py-1.5 rounded border transition ${
                i === activeIdx
                  ? "bg-netflix-red border-netflix-red text-white"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
