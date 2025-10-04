import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section id="cta" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, hsla(217,91%,65%,0.35), transparent 60%)" }} />
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center motion-safe:animate-fade-up">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Limited Time Offer
          </div>

          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Start Your Networking Journey Today
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join hundreds of Kenyans building successful careers in networking. Get started with Level 1 completely free.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/courses" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="group w-full">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/#pricing" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="xl"
                className="w-full border-white/20 bg-white/10 text-foreground backdrop-blur hover:text-primary"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            No credit card required • Access Level 1 immediately • Join 500+ students
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
