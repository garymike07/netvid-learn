import { memo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { Achievement } from "@/lib/achievements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type AchievementGridProps = {
  achievements: Achievement[];
};

const AchievementCard = ({ achievement, index }: { achievement: Achievement; index: number }) => {
  const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon] ?? Icons.Award;
  const unlocked = achievement.unlocked;

  return (
    <motion.div
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-card/70 p-5 shadow-lg",
        unlocked ? "ring-1 ring-primary/60" : "",
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary",
              unlocked ? "shadow-glow" : "",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">Achievement</p>
            <h3 className="text-lg font-semibold text-foreground">{achievement.title}</h3>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]",
            unlocked ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground",
          )}
        >
          {unlocked ? "Unlocked" : "In progress"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{achievement.description}</p>

      <div className="space-y-2">
        <Progress value={Math.round(achievement.progress * 100)} className="h-2 bg-white/5" aria-label={achievement.title} />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {achievement.current} / {achievement.requirement}
        </p>
      </div>

      {unlocked ? (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />
      ) : null}
    </motion.div>
  );
};

const AchievementGridComponent = ({ achievements }: AchievementGridProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {achievements.map((achievement, index) => (
        <AchievementCard key={achievement.id} achievement={achievement} index={index} />
      ))}
    </div>
  );
};

export const AchievementGrid = memo(AchievementGridComponent);
