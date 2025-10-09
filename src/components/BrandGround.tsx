import { FadeIn } from "@/components/motion";

const BrandGround = () => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/assets/brand-ground.jpg"
          alt="NetVid ground team collaborating"
          className="h-full w-full object-cover object-center opacity-45"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/75 to-background/90" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 30%, hsla(215,91%,65%,0.25), transparent 60%)" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <FadeIn once>
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Our Ground
              </span>
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                Rooted in real network operations
              </h2>
              <p className="text-lg text-muted-foreground">
                The NetVid ground team trains where it matters most—inside live data centers, ISP backbones, and campus networks. Every course
                reflects the cables we pull, the outages we solve, and the automation pipelines we ship.
              </p>
              <ul className="grid gap-3 text-sm text-muted-foreground/90 md:grid-cols-2">
                {["Hands-on labs sourced from field playbooks", "Guided walkthroughs of Kenya’s leading network builds", "Career mentoring from coaches who deploy daily", "Community meetups on the same turf you see here"].map(
                  (item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card relative rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why it matters</p>
              <p className="mt-4 text-sm text-muted-foreground">
                This is the ground our learners stand on—where theory meets live fiber, and where your trial transforms into
                employer-ready mastery. Mika will point you to labs that mirror the exact builds pictured here.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-background/70 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Field snapshot</p>
                <p className="mt-1">
                  Captured during a NetVid deployment workshop in Nairobi. Every module you take draws from lessons tested on
                  this ground.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default BrandGround;
