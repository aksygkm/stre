"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─── SVG Decorations ─── */

function LaurelWreath({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6" stroke="#C9A96E" strokeWidth="1.2">
        {/* Left branch */}
        <path d="M100 70 Q60 60 40 40" />
        <path d="M70 55 Q60 45 55 35" />
        <path d="M80 60 Q68 52 62 42" />
        <path d="M60 48 Q50 40 48 30" />
        <path d="M50 40 Q42 32 42 22" />
        <path d="M42 32 Q36 24 38 14" />
        {/* Left leaves */}
        <ellipse cx="55" cy="35" rx="8" ry="4" transform="rotate(-30 55 35)" fill="#C9A96E" fillOpacity="0.15" />
        <ellipse cx="48" cy="28" rx="7" ry="3.5" transform="rotate(-40 48 28)" fill="#C9A96E" fillOpacity="0.12" />
        <ellipse cx="62" cy="42" rx="8" ry="4" transform="rotate(-25 62 42)" fill="#C9A96E" fillOpacity="0.15" />
        <ellipse cx="42" cy="20" rx="7" ry="3.5" transform="rotate(-50 42 20)" fill="#C9A96E" fillOpacity="0.1" />
        <ellipse cx="70" cy="50" rx="7" ry="3.5" transform="rotate(-20 70 50)" fill="#C9A96E" fillOpacity="0.12" />

        {/* Right branch (mirrored) */}
        <path d="M100 70 Q140 60 160 40" />
        <path d="M130 55 Q140 45 145 35" />
        <path d="M120 60 Q132 52 138 42" />
        <path d="M140 48 Q150 40 152 30" />
        <path d="M150 40 Q158 32 158 22" />
        <path d="M158 32 Q164 24 162 14" />
        {/* Right leaves */}
        <ellipse cx="145" cy="35" rx="8" ry="4" transform="rotate(30 145 35)" fill="#C9A96E" fillOpacity="0.15" />
        <ellipse cx="152" cy="28" rx="7" ry="3.5" transform="rotate(40 152 28)" fill="#C9A96E" fillOpacity="0.12" />
        <ellipse cx="138" cy="42" rx="8" ry="4" transform="rotate(25 138 42)" fill="#C9A96E" fillOpacity="0.15" />
        <ellipse cx="158" cy="20" rx="7" ry="3.5" transform="rotate(50 158 20)" fill="#C9A96E" fillOpacity="0.1" />
        <ellipse cx="130" cy="50" rx="7" ry="3.5" transform="rotate(20 130 50)" fill="#C9A96E" fillOpacity="0.12" />
      </g>
    </svg>
  );
}

function OrnamentalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-greek-gold/40" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="#C9A96E"
          fillOpacity="0.5"
        />
      </svg>
      <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-greek-gold/40" />
    </div>
  );
}

function ColumnSVG({ side }: { side: "left" | "right" }) {
  const mirror = side === "right";
  return (
    <svg
      viewBox="0 0 60 400"
      className={`absolute top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-[60px] opacity-[0.06] hidden lg:block`}
      style={mirror ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Capital */}
      <rect x="5" y="10" width="50" height="8" rx="2" fill="#C9A96E" />
      <path d="M10 18 Q15 30 10 35 Q25 25 30 18" fill="#C9A96E" fillOpacity="0.5" />
      <path d="M50 18 Q45 30 50 35 Q35 25 30 18" fill="#C9A96E" fillOpacity="0.5" />
      {/* Shaft with flutes */}
      <rect x="12" y="35" width="36" height="340" fill="#C9A96E" fillOpacity="0.3" />
      <line x1="18" y1="35" x2="18" y2="375" stroke="#C9A96E" strokeOpacity="0.2" />
      <line x1="24" y1="35" x2="24" y2="375" stroke="#C9A96E" strokeOpacity="0.2" />
      <line x1="30" y1="35" x2="30" y2="375" stroke="#C9A96E" strokeOpacity="0.2" />
      <line x1="36" y1="35" x2="36" y2="375" stroke="#C9A96E" strokeOpacity="0.2" />
      <line x1="42" y1="35" x2="42" y2="375" stroke="#C9A96E" strokeOpacity="0.2" />
      {/* Base */}
      <rect x="8" y="375" width="44" height="6" rx="1" fill="#C9A96E" fillOpacity="0.4" />
      <rect x="4" y="381" width="52" height="8" rx="1" fill="#C9A96E" fillOpacity="0.3" />
    </svg>
  );
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-down">
      <span className="text-greek-gold/50 font-cormorant text-xs tracking-[0.3em] uppercase">
        Gulir ke bawah
      </span>
      <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
        <rect x="1" y="1" width="18" height="28" rx="9" stroke="#C9A96E" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="#C9A96E" fillOpacity="0.6">
          <animate attributeName="cy" values="10;18;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ─── Data ─── */

const PHILOSOPHERS = [
  {
    name: "Socrates",
    greek: "Σωκράτης",
    years: "470 – 399 SM",
    quote: "Kehidupan yang tidak ditelaah tidak layak untuk dijalani.",
    quoteOriginal: "ὁ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ",
    desc: "Bapak filsafat Barat, sang pencari kebenaran melalui dialog dan pertanyaan abadi yang mengubah cara manusia berpikir selamanya.",
  },
  {
    name: "Plato",
    greek: "Πλάτων",
    years: "428 – 348 SM",
    quote: "Sentuhan cinta menjadikan semua orang penyair.",
    quoteOriginal: "ἅπτεται γὰρ ἔρωτος ποιητὴν γιγνόμενον",
    desc: "Pendiri Akademia, penjelajah dunia ide, yang mengajarkan bahwa kebenaran sejati melampaui apa yang terlihat oleh mata.",
  },
  {
    name: "Aristoteles",
    greek: "Ἀριστοτέλης",
    years: "384 – 322 SM",
    quote: "Kita adalah apa yang kita lakukan berulang-ulang. Keunggulan bukanlah tindakan, melainkan kebiasaan.",
    quoteOriginal: "ἐσμὲν γὰρ ἅπερ πράττομεν κατ᾽ ἐπανάληψιν",
    desc: "Guru segala ilmu, sang polymath yang meletakkan fondasi logika, etika, politik, dan hampir seluruh cabang pengetahuan manusia.",
  },
];

const VIRTUES = [
  {
    greek: "Σοφία",
    name: "Sophia",
    title: "Kebijaksanaan",
    desc: "Kemampuan untuk melihat melampaui permukaan, memahami hakikat kebenaran, dan menerapkan pengetahuan dengan penuh kearifan.",
    symbol: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
  },
  {
    greek: "Ἀνδρεία",
    name: "Andreia",
    title: "Keberanian",
    desc: "Kekuatan hati untuk menghadapi ketakutan, bertahan di tengah cobaan, dan berdiri teguh demi kebenaran meski harus sendirian.",
    symbol: "M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-3l6-9H6l6 9z",
  },
  {
    greek: "Δικαιοσύνη",
    name: "Dikaiosyne",
    title: "Keadilan",
    desc: "Harmoni sempurna di mana setiap jiwa dan masyarakat menemukan tempatnya — memberikan yang semestinya kepada yang berhak.",
    symbol: "M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13",
  },
  {
    greek: "Σωφροσύνη",
    name: "Sophrosyne",
    title: "Pengendalian Diri",
    desc: "Keseimbangan jiwa yang lahir dari penguasaan diri — mengetahui batas, merangkul ketenangan, dan hidup dengan harmoni.",
    symbol: "M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-4a6 6 0 100-12 6 6 0 000 12zm0-3a3 3 0 100-6 3 3 0 000 6z",
  },
];

const TIMELINE = [
  { year: "624 SM", name: "Thales dari Miletus", title: "Bapak Filsafat", desc: "Yang pertama mencari penjelasan rasional tentang alam semesta, memulai tradisi berpikir kritis yang mengubah peradaban." },
  { year: "570 SM", name: "Pythagoras", title: "Sang Matematikawan Mistis", desc: "Menyatukan angka dan harmoni, mengungkap bahwa matematika adalah bahasa rahasia alam semesta." },
  { year: "535 SM", name: "Heraclitus", title: "Filsuf Perubahan", desc: "Πάντα ῥεῖ — Segalanya mengalir. Mengajarkan bahwa perubahan adalah satu-satunya ketetapan." },
  { year: "470 SM", name: "Socrates", title: "Guru Kebijaksanaan", desc: "Melalui dialog dan pertanyaan, ia membuktikan bahwa kebijaksanaan dimulai dari mengakui ketidaktahuan." },
  { year: "428 SM", name: "Plato", title: "Pendiri Akademia", desc: "Mendirikan sekolah pertama dunia Barat dan mengajarkan bahwa realitas sejati ada di dunia Ide." },
  { year: "384 SM", name: "Aristoteles", title: "Guru Segala Ilmu", desc: "Murid Plato yang melampaui gurunya, menyistematisasi seluruh pengetahuan manusia dalam satu kerangka berpikir." },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=800&h=600&fit=crop", title: "Kuil Parthenon", subtitle: "Athena, Yunani" },
  { src: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=800&fit=crop", title: "Arsitektur Klasik", subtitle: "Kolom Korintia" },
  { src: "https://images.unsplash.com/photo-1608730558899-38tried?w=800&h=500&fit=crop", title: "Pemandangan Aegean", subtitle: "Laut Tengah" },
  { src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=800&fit=crop", title: "Keindahan Mediterania", subtitle: "Warisan Peradaban" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop", title: "Seni Patung", subtitle: "Keindahan Abadi" },
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=500&fit=crop", title: "Teater Kuno", subtitle: "Arena Seni & Drama" },
];

/* ─── Main Page ─── */

export default function GreekLandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    });

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [observerCallback]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      heroRef.current.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = particleContainerRef.current;
    if (!container) return;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.setProperty("--x", `${Math.random() * 100}%`);
      p.style.setProperty("--delay", `${Math.random() * 12}s`);
      p.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
      const size = 2 + Math.random() * 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      container.appendChild(p);
      particles.push(p);
    }
    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div className="greek-page -mt-16 overflow-hidden marble-bg min-h-screen">
      {/* ─── Particles ─── */}
      <div
        ref={particleContainerRef}
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* ─── Greek Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div className="bg-greek-dark/80 backdrop-blur-md border-b border-greek-gold/10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <span className="gold-text font-cinzel text-xl font-bold tracking-[0.15em]">
                ATHENAEUM
              </span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              {["Beranda", "Filsuf", "Kebajikan", "Galeri", "Kronologi"].map(
                (item, i) => (
                  <a
                    key={item}
                    href={`#section-${i}`}
                    className="font-cormorant text-[15px] text-greek-marble-cream/60 hover:text-greek-gold transition-colors tracking-wider"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
            <div className="font-cormorant text-xs text-greek-gold/40 tracking-[0.2em] hidden lg:block">
              EST. MMXXIV
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
      <section
        id="section-0"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <ColumnSVG side="left" />
        <ColumnSVG side="right" />

        {/* Radial glow behind title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-greek-gold/[0.03] blur-[120px]" />
        </div>

        <div ref={heroRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <LaurelWreath className="w-48 h-auto mx-auto mb-6 opacity-0 animate-fade-in-up" />

          <div className="space-y-6">
            <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.2em] gold-shimmer leading-none">
              ATHENAEUM
            </h1>

            <div className="greek-key-border-animated mx-auto max-w-md" />

            <p className="font-cormorant text-xl sm:text-2xl md:text-3xl text-greek-marble-cream/70 tracking-wide font-light">
              Tempat Kebijaksanaan Bertemu Keindahan
            </p>

            <p className="font-cormorant text-lg text-greek-gold/50 italic tracking-wider">
              γνῶθι σεαυτόν — Kenali Dirimu
            </p>
          </div>
        </div>

        <ScrollIndicator />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-greek-dark to-transparent" />
      </section>

      {/* ═══════════════════════ INTRODUCTION ═══════════════════════ */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal">
            <OrnamentalDivider className="mb-12" />
            <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-greek-marble-cream/80 leading-relaxed font-light max-w-3xl mx-auto">
              Di zaman keemasan Athena, para filsuf berjalan di bawah cahaya
              matahari Mediterania, mencari jawaban atas pertanyaan terbesar
              umat manusia — tentang{" "}
              <span className="gold-text font-medium">kebenaran</span>,{" "}
              <span className="gold-text font-medium">keindahan</span>, dan{" "}
              <span className="gold-text font-medium">kebajikan</span>.
            </p>
            <OrnamentalDivider className="mt-12" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PHILOSOPHERS ═══════════════════════ */}
      <section id="section-1" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="font-cormorant text-sm text-greek-gold/50 tracking-[0.4em] uppercase block mb-4">
              Pemikir Agung
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl gold-text font-bold tracking-[0.15em]">
              TIGA PILAR KEBIJAKSANAAN
            </h2>
            <div className="greek-key-border mx-auto max-w-xs mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger">
            {PHILOSOPHERS.map((p) => (
              <div key={p.name} className="philosopher-card p-8 group">
                <div className="text-center space-y-4">
                  {/* Ornamental circle with initial */}
                  <div className="w-24 h-24 mx-auto rounded-full border-2 border-greek-gold/20 flex items-center justify-center mb-6 group-hover:border-greek-gold/50 transition-colors group-hover:shadow-gold-subtle">
                    <span className="font-cinzel text-3xl gold-text font-bold">
                      {p.name[0]}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl gold-text font-semibold tracking-[0.1em]">
                    {p.name}
                  </h3>
                  <p className="font-cormorant text-lg text-greek-gold/40 italic">
                    {p.greek}
                  </p>
                  <p className="text-xs text-greek-marble-cream/40 tracking-[0.2em] font-cormorant">
                    {p.years}
                  </p>

                  <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-greek-gold/30 to-transparent my-4" />

                  <blockquote className="font-playfair text-lg text-greek-marble-cream/80 italic leading-relaxed">
                    &ldquo;{p.quote}&rdquo;
                  </blockquote>

                  <p className="font-cormorant text-xs text-greek-gold/30 italic mt-2">
                    {p.quoteOriginal}
                  </p>

                  <p className="font-cormorant text-sm text-greek-marble-cream/50 leading-relaxed mt-4">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PARALLAX QUOTE ═══════════════════════ */}
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1920&h=1080&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-greek-dark via-greek-dark/90 to-greek-dark" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center reveal-scale">
          <LaurelWreath className="w-36 h-auto mx-auto mb-8 opacity-60" />

          <blockquote className="font-playfair text-3xl sm:text-4xl md:text-5xl text-greek-marble/90 italic leading-snug font-light">
            &ldquo;Pendidikan adalah nyala api yang menyala,
            <br className="hidden sm:block" />
            <span className="gold-text"> bukan wadah yang diisi</span>.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-greek-gold/30" />
            <span className="font-cinzel text-greek-gold/60 tracking-[0.2em] text-sm">
              SOCRATES
            </span>
            <div className="h-px w-12 bg-greek-gold/30" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VIRTUES ═══════════════════════ */}
      <section id="section-2" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="font-cormorant text-sm text-greek-gold/50 tracking-[0.4em] uppercase block mb-4">
              Empat Kebajikan Utama
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl gold-text font-bold tracking-[0.15em]">
              ARETĒ — KEBAJIKAN
            </h2>
            <p className="font-cormorant text-lg text-greek-marble-cream/50 mt-4 max-w-2xl mx-auto">
              Menurut Plato, jiwa yang sempurna memerlukan keseimbangan dari
              empat kebajikan utama yang saling melengkapi.
            </p>
            <div className="greek-key-border mx-auto max-w-xs mt-6" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 stagger">
            {VIRTUES.map((v) => (
              <div key={v.name} className="virtue-card corner-ornament group">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full border border-greek-gold/20 flex items-center justify-center group-hover:border-greek-gold/40 transition-colors">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A96E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={v.symbol} />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-cinzel text-xl gold-text font-semibold tracking-wider">
                        {v.title}
                      </h3>
                    </div>
                    <p className="font-cormorant text-greek-gold/40 italic text-sm">
                      {v.greek} · {v.name}
                    </p>
                    <p className="font-cormorant text-base text-greek-marble-cream/60 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ GALLERY ═══════════════════════ */}
      <section id="section-3" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="font-cormorant text-sm text-greek-gold/50 tracking-[0.4em] uppercase block mb-4">
              Keindahan Abadi
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl gold-text font-bold tracking-[0.15em]">
              GALERI KLASIK
            </h2>
            <div className="greek-key-border mx-auto max-w-xs mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger">
            {GALLERY.map((item, i) => (
              <div
                key={i}
                className={`gallery-item group ${
                  i === 0 || i === 5 ? "md:col-span-2" : ""
                } ${i === 1 || i === 3 ? "row-span-2" : ""}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-greek-dark-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-greek-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                    <h4 className="font-cinzel text-sm gold-text font-semibold tracking-wider">
                      {item.title}
                    </h4>
                    <p className="font-cormorant text-xs text-greek-marble-cream/50">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECOND QUOTE ═══════════════════════ */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center reveal-scale">
          <OrnamentalDivider className="mb-10" />
          <blockquote className="font-playfair text-2xl sm:text-3xl md:text-4xl text-greek-marble/80 italic leading-relaxed font-light">
            &ldquo;Keindahan ada dalam keserhanaan,
            <br className="hidden sm:block" />
            dan kebenaran ada dalam <span className="gold-text">keindahan</span>
            .&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-greek-gold/30" />
            <span className="font-cinzel text-greek-gold/60 tracking-[0.2em] text-sm">
              PLATO
            </span>
            <div className="h-px w-12 bg-greek-gold/30" />
          </div>
          <OrnamentalDivider className="mt-10" />
        </div>
      </section>

      {/* ═══════════════════════ TIMELINE ═══════════════════════ */}
      <section id="section-4" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="font-cormorant text-sm text-greek-gold/50 tracking-[0.4em] uppercase block mb-4">
              Perjalanan Waktu
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl gold-text font-bold tracking-[0.15em]">
              KRONOLOGI FILSAFAT
            </h2>
            <div className="greek-key-border mx-auto max-w-xs mt-6" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line" />

            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0
                      ? "md:flex-row"
                      : "md:flex-row-reverse md:text-right"
                  } ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
                >
                  {/* Content */}
                  <div className="flex-1 md:w-[calc(50%-2rem)]">
                    <div className="philosopher-card p-6">
                      <span className="font-cinzel text-xs text-greek-gold/60 tracking-[0.3em]">
                        {item.year}
                      </span>
                      <h3 className="font-cinzel text-lg gold-text font-semibold mt-2 tracking-wider">
                        {item.name}
                      </h3>
                      <p className="font-cormorant text-sm text-greek-gold/40 italic mt-1">
                        {item.title}
                      </p>
                      <p className="font-cormorant text-sm text-greek-marble-cream/50 mt-3 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div
                    className="timeline-dot hidden md:block"
                    style={{ top: "1.5rem" }}
                  />

                  {/* Spacer for the other side */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CLOSING ═══════════════════════ */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full bg-greek-gold/[0.02] blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center reveal-scale">
          <LaurelWreath className="w-52 h-auto mx-auto mb-8" />

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl gold-shimmer font-bold tracking-[0.2em] leading-tight">
            CARPE DIEM
          </h2>

          <p className="font-cormorant text-xl text-greek-marble-cream/60 mt-6 italic">
            Raihlah hari ini, karena waktu terus berjalan
          </p>

          <OrnamentalDivider className="mt-12 mb-12" />

          <p className="font-cormorant text-lg text-greek-marble-cream/40 max-w-xl mx-auto leading-relaxed">
            Keindahan dan kebijaksanaan tidak mengenal batas waktu. Warisan para
            filsuf Yunani kuno terus hidup dalam setiap pertanyaan yang kita
            ajukan dan setiap kebenaran yang kita cari.
          </p>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative border-t border-greek-gold/10">
        <div className="greek-key-border-animated" />

        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h3 className="font-cinzel text-2xl gold-text font-bold tracking-[0.2em] mb-4">
            ATHENAEUM
          </h3>
          <p className="font-cormorant text-sm text-greek-gold/40 italic tracking-wider mb-8">
            γνῶθι σεαυτόν — Kenali Dirimu
          </p>

          <OrnamentalDivider className="mb-8" />

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {["Beranda", "Filsuf", "Kebajikan", "Galeri", "Kronologi"].map(
              (item, i) => (
                <a
                  key={item}
                  href={`#section-${i}`}
                  className="font-cormorant text-sm text-greek-marble-cream/40 hover:text-greek-gold transition-colors tracking-wider"
                >
                  {item}
                </a>
              ),
            )}
          </div>

          <p className="font-cormorant text-xs text-greek-marble-cream/20 tracking-wider">
            &copy; {new Date().getFullYear()} Athenaeum · Dibuat dengan cinta
            untuk keindahan abadi
          </p>
        </div>
      </footer>
    </div>
  );
}
