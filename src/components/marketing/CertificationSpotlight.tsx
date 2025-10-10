import { ArrowRight, Award, ShieldCheck, Share2 } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { certificationSpotlight } from "@/data/marketing";

const icons = [Award, ShieldCheck, Share2];

const CertificationSpotlight = () => {
  return (
    <section id="certification" className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="rounded-3xl border border-primary/20 bg-primary/10 p-12 shadow-xl shadow-primary/20">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Certification spotlight
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
                {certificationSpotlight.headline}
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                {certificationSpotlight.description}
              </p>
              <Button asChild size="lg" variant="pill-primary" className="mt-8">
                <a href={certificationSpotlight.ctaHref}>
                  {certificationSpotlight.ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {certificationSpotlight.benefits.map((benefit, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <div key={benefit} className="glass-card rounded-2xl border border-white/10 bg-white/10 p-6">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{benefit}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CertificationSpotlight;
