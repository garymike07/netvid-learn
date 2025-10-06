import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section id="cta" className="relative overflow-hidden py-24 md:py-32">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, hsla(217,91%,65%,0.35), transparent 60%)" }}
        initial={{ opacity: 0.3, scale: 0.95 }}
        whileInView={{ opacity: 0.8, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "var(--gradient-promo)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <FadeIn className="mx-auto max-w-3xl text-center space-y-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Limited Time Offer
          </div>

          <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Start Your Networking Journey Today
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join hundreds of Kenyans building successful careers in networking. Access Level 1 immediately and stay for the live labs, certificates, and community.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/courses" className="w-full sm:w-auto">
              <Button variant="pill-primary" size="xl" className="group w-full">
                Get Started Free
                <motion.span
                  className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15"
                  initial={{ scale: 1, x: 0 }}
                  whileHover={{ scale: 1.1, x: 6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
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

          <p className="text-sm text-muted-foreground">
            No credit card required • Access Level 1 immediately • Join 500+ students
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default CTA;
