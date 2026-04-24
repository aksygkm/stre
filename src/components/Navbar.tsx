"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HUBS } from "@/lib/providers";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("q");
      if (v) setQ(v);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  if (pathname === "/") return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "bg-netflix-black/95 backdrop-blur border-b border-white/5"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-6 h-16">
          <Link
            href="/"
            className="flex items-center gap-1 text-netflix-red font-black text-2xl tracking-tight"
          >
            STREAM<span className="text-white">IX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/"
              className={`nav-link ${
                pathname === "/" ? "text-white font-semibold" : ""
              }`}
            >
              Beranda
            </Link>
            {HUBS.map((h) => (
              <Link
                key={h.id}
                href={h.href}
                className={`nav-link ${
                  isActive(h.href) ? "text-white font-semibold" : ""
                }`}
              >
                {h.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <form
              onSubmit={onSubmit}
              className="hidden sm:flex items-center gap-2 bg-black/60 border border-white/10 focus-within:border-white/40 rounded px-2 h-9 w-56 lg:w-72 transition-colors"
            >
              <Search className="h-4 w-4 text-white/60" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari judul, genre..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/40"
              />
            </form>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-netflix-black/95 border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 bg-black/60 border border-white/10 rounded px-2 h-10"
            >
              <Search className="h-4 w-4 text-white/60" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/40"
              />
            </form>
            <nav className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded bg-white/5 hover:bg-white/10"
              >
                Beranda
              </Link>
              {HUBS.map((h) => (
                <Link
                  key={h.id}
                  href={h.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-3 rounded bg-white/5 hover:bg-white/10"
                >
                  {h.emoji} {h.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
