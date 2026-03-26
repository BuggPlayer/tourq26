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
        <span key={i} className="text-primary" aria-hidden>
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
      className="relative border-t border-border/40 bg-surface py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            What clients say
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Results our clients see
          </h2>
          <p className="mt-4 text-muted-foreground">
            Trusted globally to deliver real outcomes.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id ?? t.name}
              className="card-hover flex flex-col rounded-2xl border border-border/40 bg-surface-elevated p-6 sm:p-8"
            >
              <span className="text-4xl leading-none text-primary/25" aria-hidden>
                &ldquo;
              </span>
              <p className="mt-2 flex-1 text-muted-foreground leading-relaxed text-sm">
                {t.quote}
              </p>
              <p className="mt-3 inline-flex w-fit rounded-full bg-primary-muted px-3 py-1.5 text-xs font-semibold text-primary">
                {t.result}
              </p>
              <Stars count={t.rating} />
              <div className="mt-5 flex items-center gap-4 border-t border-border/40 pt-4">
                <Image
                  src="/images/avatar-placeholder.svg"
                  alt={`Client testimonial avatar for ${t.name}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full ring-2 ring-border/50 text-primary"
                  unoptimized
                />
                <div>
                  <p className="font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
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
