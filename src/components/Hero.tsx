import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Video } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
      style={{ backgroundImage: 'url("/images/futuristic-dashboard.png")' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,hsla(278,97%,72%,0.2),transparent_55%),radial-gradient(circle_at_80%_0%,hsla(215,91%,65%,0.22),transparent_60%)]" />
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/futuristic-lab.png"
          alt="Immersive network operations hologram"
          className="absolute -right-16 bottom-8 hidden w-[320px] rotate-3 opacity-85 drop-shadow-[0_35px_55px_rgba(59,130,246,0.45)] md:block lg:w-[420px]"
          loading="lazy"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center motion-safe:animate-fade-up">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur">
            <Video className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Immersive video-first learning</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Mike Net Academy
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              From Zero to Expert
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl">
            Dive into curated playlists, guided labs, and a modern journey that keeps you inspired from your first packet to carrier-grade automation.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/courses" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="group w-full">
                Start Learning Free
                <Play className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </Button>
            </Link>
            <Link to="/courses" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="xl"
                className="w-full border-white/15 bg-white/5 text-foreground backdrop-blur transition-colors hover:text-primary"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Curriculum
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { label: "Video tutorials ready to stream", value: "100+" },
              { label: "Structured progression levels", value: "5 tracks" },
              { label: "Monthly access from", value: "KSh 2,500" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6 text-left shadow-[0_18px_40px_-24px_hsla(215,91%,65%,0.45)]">
                <div className="text-3xl font-bold text-foreground">{item.value}</div>
                <div className="pt-2 text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
