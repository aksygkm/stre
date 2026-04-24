import Link from "next/link";
import { HUBS } from "@/lib/providers";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-netflix-ink">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-10 text-sm text-white/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-netflix-red font-black text-2xl">
              STREAM<span className="text-white">IX</span>
            </div>
            <p className="mt-2 max-w-md">
              Platform streaming all-in-one. Nonton film, drama Korea, anime,
              short drama, dan drama pendek populer dalam satu tempat.
            </p>
          </div>
          <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
            {HUBS.map((h) => (
              <Link
                key={h.id}
                href={h.href}
                className="hover:text-white transition-colors"
              >
                {h.emoji} {h.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/5 pt-4 text-xs text-white/40">
          &copy; {new Date().getFullYear()} Streamix · Data provided by public APIs ·
          Konten milik pemegang hak cipta masing-masing.
        </div>
      </div>
    </footer>
  );
}
