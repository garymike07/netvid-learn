import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type SiteGuideContext = "index" | "courses" | "dashboard";

type GuideContent = {
  headline: string;
  message: string;
  bullets: string[];
  primary: { label: string; href: string; event: string };
  secondary?: { label: string; href: string; event: string };
};

const GUIDE_STORAGE_KEY = "mna.site-guide.dismissed";

const CONTENT: Record<SiteGuideContext, GuideContent> = {
  index: {
    headline: "Welcome aboard!",
    message: "I can point you to the right starting point, whether you're brand new or ready for advanced routing.",
    bullets: ["Follow the quick-start tour on this page", "Pick a course track that fits your level", "See how certificates unlock as you progress"],
    primary: { label: "Explore courses", href: "/courses", event: "guide_index_primary" },
    secondary: { label: "Peek at the dashboard", href: "/dashboard", event: "guide_index_secondary" },
  },
  courses: {
    headline: "Choosing a path?",
    message: "Use the filters, check the premium badges, and I'll keep track of labs and quizzes once you sign in.",
    bullets: ["Start with Level 1 if you're new", "Premium tracks unlock during trial", "Progress saves instantly on each lesson"],
    primary: { label: "Sign in to save progress", href: "/auth?redirect=%2Fcourses", event: "guide_courses_primary" },
    secondary: { label: "Jump to dashboard", href: "/dashboard", event: "guide_courses_secondary" },
  },
  dashboard: {
    headline: "Staying on course",
    message: "Here you can reset progress, monitor your trial, and open the next recommended module in seconds.",
    bullets: ["Continue the highlighted course", "Review labs and quizzes you've completed", "Claim certificates once courses hit 100%"],
    primary: { label: "Resume learning", href: "/courses", event: "guide_dashboard_primary" },
    secondary: { label: "Manage subscription", href: "/dashboard#subscription", event: "guide_dashboard_secondary" },
  },
};

type SiteGuideProps = {
  context: SiteGuideContext;
  className?: string;
};

export const SiteGuide = ({ context, className }: SiteGuideProps) => {
  const content = useMemo(() => CONTENT[context] ?? CONTENT.index, [context]);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(GUIDE_STORAGE_KEY) === "true";
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dismissed) {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(GUIDE_STORAGE_KEY);
    }
  }, [dismissed]);

  if (dismissed) {
    return null;
  }

  if (collapsed) {
    return (
      <div className={cn("pointer-events-auto fixed bottom-6 right-4 z-40", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left text-sm text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary/20"
            >
              <img
                src="/assets/hero-avatar.png"
                alt="Mika avatar"
                className="h-9 w-9 rounded-full border border-white/20 object-cover"
                loading="lazy"
              />
              <span className="font-medium">Need help navigating?</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Tap to bring Mika back.
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <FadeIn delay={0.2}>
      <div
        className={cn(
          "pointer-events-auto fixed bottom-6 right-4 z-40 w-full max-w-sm rounded-3xl border border-white/10 bg-background/85 p-5 text-left shadow-xl backdrop-blur",
          className,
        )}
      >
        <div className="flex items-start gap-4">
          <img
            src="/assets/hero-avatar.png"
            alt="Mika, the NetVid guide"
            className="h-14 w-14 shrink-0 rounded-full border border-white/20 object-cover shadow-glow"
            loading="lazy"
          />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Mika says</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{content.headline}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{content.message}</p>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3 w-3 text-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                size="sm"
                className="gap-2"
                onClick={() => trackEvent(content.primary.event)}
              >
                <Link to={content.primary.href}>{content.primary.label}</Link>
              </Button>
              {content.secondary ? (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-white/5"
                  onClick={() => trackEvent(content.secondary!.event)}
                >
                  <Link to={content.secondary.href}>{content.secondary.label}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full border border-white/10 px-3 py-1 transition hover:border-primary/40 hover:text-primary"
          >
            Minimize
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 transition hover:border-destructive/40 hover:text-destructive"
          >
            <X className="h-3 w-3" />
            Dismiss
          </button>
        </div>
      </div>
    </FadeIn>
  );
};

export default SiteGuide;
