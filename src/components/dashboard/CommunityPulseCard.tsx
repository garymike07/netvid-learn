import { memo } from "react";
import { LineChart, MapPin, Sparkles } from "lucide-react";
import type { CommunityPulse } from "@/hooks/use-community-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type CommunityPulseCardProps = {
  pulse: CommunityPulse;
  trendingHref?: string;
};

const trendColor: Record<CommunityPulse["metrics"][number]["trend"], string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  steady: "text-amber-300",
};

const CommunityPulseCardComponent = ({ pulse, trendingHref }: CommunityPulseCardProps) => {
  const trendingLink = trendingHref ?? `/courses/${pulse.trendingCourse.slug}`;

  return (
    <Card className="glass-panel h-full border-none">
      <CardHeader className="flex flex-col gap-2 p-6">
        <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-primary">
          Community pulse
        </Badge>
        <CardTitle className="text-foreground">Momentum across the academy</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time activity from peers keeps you accountable and inspired.</p>
      </CardHeader>
      <CardContent className="space-y-5 p-6 pt-0">
        <div className="grid gap-3 sm:grid-cols-3">
          {pulse.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{metric.value}</p>
              <span className={cn("text-xs font-semibold", trendColor[metric.trend])}>{metric.delta}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 via-background to-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary/60">Top streak</p>
              <p className="text-base font-semibold text-foreground">{pulse.topContributor.name}</p>
              <p className="text-sm text-muted-foreground">
                {pulse.topContributor.role} • <MapPin className="mr-1 inline h-3 w-3" /> {pulse.topContributor.location}
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Active streak</p>
              <p className="text-lg font-semibold text-foreground">{pulse.topContributor.streakDays} days</p>
              <p className="text-[11px] text-emerald-300">+{pulse.topContributor.delta} this week</p>
            </div>
          </div>
        </div>

        <motion.div
          className="rounded-2xl border border-primary/20 bg-primary/10 p-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Trending focus</p>
              <p className="text-lg font-semibold text-foreground">{pulse.trendingCourse.title}</p>
              <p className="text-sm text-muted-foreground">{pulse.trendingCourse.highlight}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/70">
                <LineChart className="h-3 w-3" /> {pulse.trendingCourse.focus}
              </p>
            </div>
            <Button asChild variant="pill-primary" className="gap-2">
              <Link to={trendingLink}>
                <Sparkles className="h-4 w-4" /> Join cohort
              </Link>
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export const CommunityPulseCard = memo(CommunityPulseCardComponent);
