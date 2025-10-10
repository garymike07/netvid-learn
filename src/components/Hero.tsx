import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";
import { useLandingMetrics } from "@/hooks/use-landing-metrics";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-KE", { notation: value > 9999 ? "compact" : "standard" }).format(value);

const Hero = () => {
  const { data: metrics = { totalLearners: 0, courseHours: 0, completionRate: 0, partnerCount: 0 }, isFetching } =
    useLandingMetrics();

  const statItems = useMemo(
    () => [
      { label: "Learners mastering enterprise networks", value: formatNumber(metrics.totalLearners) },
      { label: "Hours of guided labs and lessons", value: `${formatNumber(metrics.courseHours)} hrs` },
      { label: "Average completion rate across tracks", value: `${Math.round(metrics.completionRate * 100)}%` },
      { label: "Hiring partners offering placements", value: formatNumber(metrics.partnerCount) },
    ],
    [metrics.completionRate, metrics.courseHours, metrics.partnerCount, metrics.totalLearners],
  );

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/futuristic-dashboard.png"
        >
          <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24 md:py-36">
          <div className="grid gap-16 lg:grid-cols-[3fr,2fr] lg:items-center">
            <div className="space-y-10">
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Built for Africa's next million network leaders
                </span>
              </FadeIn>
              <FadeIn delay={0.05}>
                <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl xl:text-7xl">
                  World-class networking mastery, crafted for emerging markets
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Mike Net Academy pairs cinematic explainers with live troubleshooting drills, AI-assisted mentorship, and
                  verifiable certifications so your career accelerates from the first login.
                </p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link to="/courses" className="w-full sm:w-auto" onClick={() => trackEvent("hero_primary_cta")}> 
                    <Button variant="pill-primary" size="xl" className="w-full gap-3">
                      Start learning free
                      <motion.span
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                        initial={{ scale: 0.85, rotate: 0 }}
                        whileHover={{ scale: 1.05, rotate: 8 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Play className="h-4 w-4" aria-hidden="true" />
                      </motion.span>
                    </Button>
                  </Link>
                  <Link to="/verify" className="w-full sm:w-auto" onClick={() => trackEvent("hero_employer_cta")}> 
                    <Button
                      variant="outline"
                      size="xl"
                      className="w-full gap-3 border-white/15 bg-white/10 text-foreground backdrop-blur transition duration-sm ease-emphasized hover:border-primary hover:text-primary"
                    >
                      <Building2 className="h-5 w-5" aria-hidden="true" />
                      Hire certified talent
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Mika, your AI guide</p>
                      <p>Get nudges, translations, and lab hints tailored to your current module.</p>
                    </div>
                    <Button variant="ghost" size="lg" className="justify-between border border-white/10 bg-white/5">
                      Launch guided tour
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.12} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-muted-foreground">
                <span>Network excellence dashboard</span>
                <span className={`text-xs font-semibold ${isFetching ? "text-muted-foreground" : "text-primary"}`}>
                  {isFetching ? "Syncing" : "Live"}
                </span>
              </div>
              <div className="mt-8 grid gap-5">
                {statItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-background/40 p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-3xl font-semibold text-foreground">{item.value}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{item.label}</div>
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
