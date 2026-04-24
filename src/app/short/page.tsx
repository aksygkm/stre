import Link from "next/link";
import { PROVIDERS } from "@/lib/providers";

export const revalidate = 3600;

export default function ShortDramaHub() {
  const providers = PROVIDERS.filter((p) => p.hub === "short");
  return (
    <div className="pt-16">
      <header className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black">Short Drama Hub</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Koleksi lengkap platform short drama. Pilih sumbermu favoritmu di
          bawah ini — dari ReelShort, DramaBox, FlexTV, hingga BiliTV.
        </p>
      </header>
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {providers.map((p) => (
            <Link
              key={p.key}
              href={p.basePath}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-netflix-surface p-5 hover:border-netflix-red hover:shadow-[0_10px_30px_rgba(229,9,20,0.25)] transition"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-netflix-red/20 blur-2xl group-hover:bg-netflix-red/40 transition" />
              <div className="relative">
                <div className="text-xs tracking-widest text-netflix-red font-bold mb-2">
                  {p.key.toUpperCase()}
                </div>
                <div className="text-xl font-black">{p.label}</div>
                <p className="text-sm text-white/60 mt-1 line-clamp-2">
                  {p.description}
                </p>
                <div className="mt-4 text-xs text-white/70 group-hover:text-white">
                  Jelajahi →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
