import Image from "next/image";
import { sitePhotos } from "@/data/site-photos";

const shots = [
  sitePhotos.galleryTeam,
  sitePhotos.galleryMobile,
  sitePhotos.galleryCode,
] as const;

export default function WorkGalleryStrip() {
  return (
    <section
      className="border-y border-[var(--color-border)]/40 bg-[var(--background)] py-14 sm:py-16"
      aria-label="How we work"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
          Beyond slide decks
        </p>
        <h2 className="mt-2 text-center font-display text-2xl font-bold text-white sm:text-3xl">
          Product, mobile, and platform delivery
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-muted)] sm:text-base">
          Collaboration, mobile product work, and deep implementation—not just strategy decks.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {shots.map((photo, i) => (
            <figure
              key={photo.src}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] shadow-lg ${
                i === 1 ? "sm:mt-6" : ""
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent opacity-90"
                  aria-hidden
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
