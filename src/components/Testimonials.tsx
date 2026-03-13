import Image from "next/image";

export type TestimonialItem = {
  id?: string;
  quote: string;
  result: string;
  name: string;
  role: string;
  company: string;
  rating: number;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    quote: "Torq Studio delivered our mobile app on time and under budget. The team understood our vision from day one and the quality exceeded our expectations.",
    result: "On time, under budget",
    name: "Sarah Al-Rashid",
    role: "Product Director",
    company: "FinTech, UAE",
    rating: 5,
  },
  {
    quote: "We needed a partner who could scale with us. Their remote developers integrated seamlessly and we cut our development costs significantly without compromising on delivery.",
    result: "Costs cut, delivery intact",
    name: "Marcus Weber",
    role: "CTO",
    company: "E-commerce, Germany",
    rating: 5,
  },
  {
    quote: "From concept to launch, Torq Studio was professional and responsive. The AI solution they built has transformed how we handle customer support.",
    result: "Transformed our operations",
    name: "Layla Hassan",
    role: "Operations Lead",
    company: "Logistics, Saudi Arabia",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[var(--color-primary)]" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

type Props = { items?: TestimonialItem[] };

export default function Testimonials({ items }: Props) {
  const testimonials = items?.length ? items : defaultTestimonials;
  return (
    <section
      id="testimonials"
      className="relative border-t border-[var(--color-border)]/50 bg-[var(--surface)] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            What clients say
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Results our clients see
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">
            Trusted by businesses around the world to deliver
            real outcomes.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id ?? t.name}
              className="card-hover flex flex-col rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface-elevated)] p-6 sm:p-8"
            >
              <span
                className="text-4xl leading-none text-[var(--color-primary)]/30"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="mt-2 flex-1 text-[var(--color-muted)] leading-relaxed">
                {t.quote}
              </p>
              <p className="mt-3 inline-flex w-fit rounded-full bg-[var(--color-primary-muted)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                {t.result}
              </p>
              <Stars count={t.rating} />
              <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-border)]/50 pt-4">
                <Image
                  src="/images/avatar-placeholder.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full text-[var(--color-primary)]"
                  unoptimized
                />
                <div>
                  <p className="font-display font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
