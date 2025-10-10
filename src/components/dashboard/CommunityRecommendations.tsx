import { memo } from "react";
import { Calendar, Flame, MessageCircle, Network } from "lucide-react";
import type { CommunityEvent, CommunityRecommendation } from "@/hooks/use-community-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type RecommendationSectionProps = {
  recommendations: CommunityRecommendation[];
  events: CommunityEvent[];
  showUpgradeOverlay: boolean;
  onLockedRequest?: () => void;
};

const typeIcon: Record<CommunityRecommendation["type"], React.ComponentType<{ className?: string }>> = {
  course: Network,
  lab: Flame,
  community: MessageCircle,
};

const recommendationTone: Record<CommunityRecommendation["type"], string> = {
  course: "text-sky-300",
  lab: "text-emerald-300",
  community: "text-purple-300",
};

const CommunityRecommendationsComponent = ({ recommendations, events, showUpgradeOverlay, onLockedRequest }: RecommendationSectionProps) => {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-none">
        <CardHeader className="p-6 pb-4">
          <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-primary">
            Recommended next moves
          </Badge>
          <CardTitle className="text-foreground">Stay in flow this week</CardTitle>
          <p className="text-sm text-muted-foreground">
            Commit to short, high-impact actions to keep your streak and connect with the community.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          {recommendations.map((item) => {
            const Icon = typeIcon[item.type];
            const withLock = showUpgradeOverlay && item.type !== "community";
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-primary">
                    <Icon className={cn("h-4 w-4", recommendationTone[item.type])} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.highlight ? <p className="text-xs text-primary/70">{item.highlight}</p> : null}
                  </div>
                </div>
                {withLock ? (
                  <Button size="sm" variant="outline" className="shrink-0" onClick={onLockedRequest}>
                    Upgrade to unlock
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="secondary" className="shrink-0">
                    <Link to={item.href}>{item.ctaLabel}</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="glass-panel border-none">
        <CardHeader className="p-6 pb-4">
          <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-primary">
            Live & async events
          </Badge>
          <CardTitle className="text-foreground">Meet peers building the same skills</CardTitle>
          <p className="text-sm text-muted-foreground">Join a live review or async sprint to stay accountable.</p>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          {events.map((event) => {
            const dateText = formatDistanceToNow(new Date(event.startsAt), { addSuffix: true });
            return (
              <div
                key={event.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                      {event.type === "live" ? "Live session" : "Async sprint"} • {dateText}
                    </p>
                    <p className="text-sm text-muted-foreground">Facilitator: {event.facilitator}</p>
                    {event.seatsLeft !== undefined ? (
                      <p className="text-xs text-emerald-300">{event.seatsLeft} seats remaining</p>
                    ) : null}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0">
                  <a href={event.href} target="_blank" rel="noreferrer">
                    Reserve spot
                  </a>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export const CommunityRecommendations = memo(CommunityRecommendationsComponent);
