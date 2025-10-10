import { ComponentType } from "react";
import { Activity, CircuitBoard, Users } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { trackHighlights } from "@/data/marketing";

const iconRegistry: Record<string, ComponentType<{ className?: string }>> = {
  Activity,
  CircuitBoard,
  Users,
};

const TrackHighlights = () => {
  return (
    <section id="tracks" className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Career-ready tracks</span>
          <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">Blueprints for every stage of your networking career</h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Curated journeys bundle lessons, labs, and mentorship so you can move from fundamentals to leadership without losing momentum.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {trackHighlights.map((track, index) => {
            const Icon = iconRegistry[track.icon] ?? Users;

            return (
              <FadeIn key={track.id} delay={0.05 * index} className="group relative overflow-hidden rounded-3xl border border-white/10">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${track.accent} opacity-10 transition duration-500 ease-emphasized group-hover:opacity-40`}
                />
                <div className="relative flex h-full flex-col justify-between bg-card/70 p-8">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground">{track.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{track.description}</p>
                  </div>
                  <div>
                    <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {track.stats.map((stat) => (
                        <span key={stat.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                          <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                          <span className="text-[0.65rem] uppercase tracking-[0.25em]">{stat.label}</span>
                        </span>
                      ))}
                    </div>
                    <Button asChild size="lg" variant="link" className="mt-6 px-0 text-primary">
                      <a
                        href={track.ctaHref}
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                      >
                        {track.ctaLabel} →
                      </a>
                    </Button>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrackHighlights;
