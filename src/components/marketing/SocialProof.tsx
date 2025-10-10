import { Quote } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { partners, testimonials } from "@/data/marketing";

const SocialProof = () => {
  return (
    <section id="social-proof" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Trusted by Africa's network leaders
            </span>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 className="mt-6 text-3xl font-semibold text-foreground md:text-4xl">
              Proof from teams shipping reliable connectivity every day
            </h2>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <FadeIn className="space-y-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="glass-card group relative overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-8"
              >
                <Quote className="absolute -top-8 -right-4 h-24 w-24 text-primary/10" aria-hidden="true" />
                <p className="text-lg leading-relaxed text-muted-foreground">“{testimonial.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-primary/10 text-sm font-semibold uppercase tracking-wide text-primary">
                    {testimonial.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Preferred by hiring partners</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Employers onboard our graduates confident they can manage production-grade infrastructure from day one.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {partners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group/partner flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-card/40 px-3 text-center transition duration-sm ease-emphasized hover:border-primary hover:bg-primary/10"
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-8 max-w-[120px] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground group-hover/partner:text-primary">
                        {partner.fallback ?? partner.name}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
            <Button asChild variant="ghost" size="lg" className="mt-10 justify-between border border-white/10 bg-white/5">
              <a href="/courses">
                View partner case studies
                <span aria-hidden="true">→</span>
              </a>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
