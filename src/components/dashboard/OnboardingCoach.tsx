import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";

type CoachStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: {
    label: string;
    href: string;
  };
};

const STORAGE_KEY_PREFIX = "mna.coach.dismissed";

const steps: CoachStep[] = [
  {
    id: "survey",
    title: "Pick your next module",
    description: "Browse the curriculum and mark the lessons you want to tackle this week.",
    icon: <Compass className="h-4 w-4" />,
    cta: { label: "Explore courses", href: "/courses" },
  },
  {
    id: "lesson",
    title: "Complete one lesson today",
    description: "Short sessions keep momentum high. Aim for a 15 minute video or lab.",
    icon: <Sparkles className="h-4 w-4" />,
    cta: { label: "Resume learning", href: "/dashboard#continue" },
  },
  {
    id: "share",
    title: "Celebrate your progress",
    description: "Share certificates or wins with your network to stay accountable.",
    icon: <Trophy className="h-4 w-4" />,
    cta: { label: "View certificates", href: "/dashboard#certificates" },
  },
];

export const OnboardingCoach = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const storageKey = useMemo(() => `${STORAGE_KEY_PREFIX}:${user?.id ?? "guest"}`, [user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(storageKey);
    if (!dismissed) {
      const timer = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(timer);
    }
    setVisible(false);
  }, [storageKey]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "true");
    }
    setVisible(false);
    trackEvent("coach_dismissed", { userId: user?.id ?? "guest" });
  };

  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          key="onboarding-coach"
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-background/90 p-5 shadow-2xl backdrop-blur-lg"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Coach tips</p>
              <h3 className="text-lg font-semibold text-foreground">Stay on track this week</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss coach</span>
            </Button>
          </div>

          <ul className="mt-4 space-y-4">
            {steps.map((step) => (
              <li key={step.id} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  {step.icon}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-1 h-auto p-0 text-sm text-primary"
                    onClick={() => trackEvent("coach_cta_clicked", { step: step.id })}
                  >
                    <Link to={step.cta.href}>{step.cta.label}</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};
