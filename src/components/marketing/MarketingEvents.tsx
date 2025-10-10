import { CalendarDays, MapPin, MonitorSmartphone } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { marketingEvents } from "@/data/marketing";

const modeLabel = {
  virtual: {
    icon: MonitorSmartphone,
    label: "Virtual",
  },
  in_person: {
    icon: MapPin,
    label: "In person",
  },
};

const MarketingEvents = () => {
  return (
    <section id="events" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <FadeIn className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Live experiences</span>
            <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">Labs, tours, and challenges that spark momentum</h2>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Join virtual and on-site experiences hosted by senior engineers. Practise under pressure, get feedback, and build your network.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Button variant="pill-primary" size="lg" asChild>
              <a href="https://lu.ma/mikenet" target="_blank" rel="noreferrer">
                View full calendar
              </a>
            </Button>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {marketingEvents.map((event, index) => {
            const config = modeLabel[event.mode];
            const ModeIcon = config.icon;

            return (
              <FadeIn key={event.id} delay={0.05 * index} className="rounded-3xl border border-white/10 bg-card/70 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    <span>{event.date}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    <ModeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {config.label}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{event.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.blurb}</p>
                <Button asChild variant="ghost" size="lg" className="mt-6 justify-between border border-white/10 bg-white/5">
                  <a href={event.registerUrl} target="_blank" rel="noreferrer">
                    Reserve your seat
                    <span aria-hidden="true">→</span>
                  </a>
                </Button>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketingEvents;
