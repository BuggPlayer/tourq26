import Image from "next/image";
import { sitePhotos } from "@/data/site-photos";

/**
 * Work gallery strip (DESIGN.md → article-card, hairline level 1).
 * 3-up flat-cornered article tiles with a 16:9 image and a mono caption row,
 * matching the brand's "research card" rhythm but on a light band.
 */

const shots = [
  {
    ...sitePhotos.galleryTeam,
    eyebrow: "FIELD WORK",
    caption: "Engineers + product owners in real working sessions, not stock decks.",
  },
  {
    ...sitePhotos.galleryMobile,
    eyebrow: "MOBILE DELIVERY",
    caption: "iOS, Android, and React Native releases reviewed and shipped to store.",
  },
  {
    ...sitePhotos.galleryCode,
    eyebrow: "PRODUCTION CODE",
    caption: "Long-lived platforms — observability, tests, and runbooks baked in.",
  },
] as const;

export default function WorkGalleryStrip() {
  return (
    <section className="band-light border-b border-hairline" aria-label="How we work">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-[80px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="mono-eyebrow text-muted-foreground">BEYOND SLIDE DECKS</p>
          <p className="display-lg max-w-xl text-foreground">
            Product, mobile, and platform delivery — documented as it happens.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((photo) => (
            <figure
              key={photo.src}
              className="card-flat group flex h-full flex-col p-0 overflow-hidden"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b border-hairline">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <figcaption className="flex flex-1 flex-col gap-2 p-6">
                <p className="mono-eyebrow text-muted-foreground">{photo.eyebrow}</p>
                <p className="text-[15px] leading-snug text-foreground">{photo.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
