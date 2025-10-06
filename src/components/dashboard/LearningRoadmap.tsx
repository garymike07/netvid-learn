import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export type RoadmapStatus = "upcoming" | "active" | "complete";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  progress: number;
  status: RoadmapStatus;
  action?: {
    label: string;
    href?: string;
    locked?: boolean;
  };
};

type LearningRoadmapProps = {
  items: RoadmapItem[];
  onLockedRequest?: () => void;
};

const StatusIcon = ({ status }: { status: RoadmapStatus }) => {
  if (status === "complete") {
    return <CheckCircle2 className="h-5 w-5 text-success" />;
  }
  if (status === "active") {
    return <Play className="h-5 w-5 text-primary" />;
  }
  return <Circle className="h-5 w-5 text-muted-foreground" />;
};

const LearningRoadmapComponent = ({ items, onLockedRequest }: LearningRoadmapProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 shadow-lg">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 20%, rgba(80,120,255,0.12), transparent 60%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="relative mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Learning roadmap</p>
          <h2 className="text-2xl font-semibold text-foreground">Next up on your journey</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Follow the guided milestones tailored to your current progress. Complete the active step to unlock the next stage.
        </p>
      </div>

      <ol className="relative space-y-6 border-l border-white/10 pl-6">
        {items.map((item, index) => {
          const percentage = Math.round(item.progress * 100);
          const isLocked = item.action?.locked;
          const showButton = Boolean(item.action);

          return (
            <motion.li
              key={item.id}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className={cn(
                  "absolute -left-[39px] flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                  item.status === "complete"
                    ? "border-success/40 bg-success/20 text-success"
                    : item.status === "active"
                      ? "border-primary/40 bg-primary/20 text-primary"
                      : "border-white/15 bg-white/5 text-muted-foreground",
                )}
              >
                <StatusIcon status={item.status} />
              </span>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-background/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{item.badge}</p>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  </div>
                  {showButton ? (
                    isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive"
                        onClick={() => {
                          trackEvent("roadmap_locked_cta", { itemId: item.id });
                          onLockedRequest?.();
                        }}
                      >
                        <Lock className="h-4 w-4" /> Unlock access
                      </Button>
                    ) : item.action?.href ? (
                      <Button asChild size="sm" className="gap-2">
                        <Link
                          to={item.action.href}
                          onClick={() =>
                            trackEvent("roadmap_action_click", { itemId: item.id, destination: item.action?.href })
                          }
                        >
                          {item.action.label}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => trackEvent("roadmap_action_click", { itemId: item.id })}
                      >
                        {item.action?.label}
                      </Button>
                    )
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex-row md:items-center md:justify-between">
                  <span>Progress: {percentage}%</span>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 md:max-w-sm">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export const LearningRoadmap = memo(LearningRoadmapComponent);
