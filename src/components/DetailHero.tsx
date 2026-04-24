import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, Star } from "lucide-react";
import { proxiedImage } from "@/lib/api";

export default function DetailHero({
  title,
  poster,
  backdrop,
  description,
  rating,
  year,
  genre,
  meta,
  playHref,
  backHref,
}: {
  title: string;
  poster?: string;
  backdrop?: string;
  description?: string;
  rating?: string | number;
  year?: string | number;
  genre?: string;
  meta?: string[];
  playHref?: string;
  backHref?: string;
}) {
  return (
    <section className="relative min-h-[60vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={proxiedImage(backdrop || poster)}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-netflix-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pt-24 pb-8 flex flex-col md:flex-row gap-8 items-start">
        {backHref && (
          <Link
            href={backHref}
            className="absolute top-20 left-4 sm:left-6 lg:left-10 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        )}
        {poster && (
          <div className="w-40 sm:w-52 shrink-0">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-card">
              <Image
                src={proxiedImage(poster)}
                alt={title}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight drop-shadow-lg">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
            {rating ? (
              <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                <Star className="h-4 w-4 fill-green-400" /> {rating}
              </span>
            ) : null}
            {year ? <span>{year}</span> : null}
            {genre && <span className="chip">{genre}</span>}
            {meta?.map((m, i) => (
              <span key={i} className="chip">
                {m}
              </span>
            ))}
          </div>
          {description && (
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/80 leading-relaxed">
              {description}
            </p>
          )}
          {playHref && (
            <div className="mt-6">
              <Link href={playHref} className="btn-primary">
                <Play className="h-5 w-5 fill-black" /> Tonton Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
