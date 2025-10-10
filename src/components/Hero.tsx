import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { BookOpen, Play } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero py-24 md:py-36"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,hsla(278,97%,72%,0.18),transparent_60%),radial-gradient(circle_at_80%_0%,hsla(215,91%,65%,0.22),transparent_65%)]" />
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "var(--gradient-accent)" }} />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/40 to-transparent" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 text-center">
          <div className="w-full space-y-8">
            <FadeIn once>
              <div className="glass-card flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <img
                  src="/assets/hero-avatar.png"
                  alt="Mika, your NetVid learning guide"
                  className="h-14 w-14 rounded-full border border-white/20 object-cover shadow-glow"
                  loading="eager"
                />
                <div className="text-left">
                  <span className="block text-sm font-semibold uppercase tracking-wide text-primary">Meet Mika</span>
                  <span className="block text-sm text-muted-foreground">
                    Your friendly avatar, ready to walk you through every network milestone.
                  </span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.08} className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
                Mike Net Academy
                <span className="block bg-gradient-to-r from-primary via-accent to-primary-strong bg-clip-text text-transparent">
                  Guided from Zero to Expert
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Dive into playlists, labs, and challenges with Mika at your side—clarifying jargon, recommending next steps,
                and celebrating wins as you master enterprise-grade networking.
              </p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto"
                  onClick={() => trackEvent("hero_primary_cta")}
                >
                  <Button variant="pill-primary" size="xl" className="group w-full gap-3">
                    Start Learning Free
                    <motion.span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
                      initial={{ scale: 0.9, rotate: 0 }}
                      whileHover={{ scale: 1.1, rotate: 12 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Play className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </Link>
                <Link
                  to="/courses"
                  className="w-full sm:w-auto"
                  onClick={() => trackEvent("hero_curriculum_cta")}
                >
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full border-white/15 bg-white/5 text-foreground backdrop-blur transition duration-sm ease-emphasized hover:text-primary"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    View Curriculum
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
                {[
                  { label: "Video tutorials ready to stream", value: "100+" },
                  { label: "Structured progression levels", value: "5 tracks" },
                  { label: "Monthly access from", value: "KSh 2,500" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="glass-card shimmer-border rounded-2xl p-6"
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-3xl font-semibold text-foreground">{item.value}</div>
                    <div className="pt-2 text-sm text-muted-foreground">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
