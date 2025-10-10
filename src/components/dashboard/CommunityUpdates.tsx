import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { CommunityUpdate } from "@/hooks/use-community-feed";
import { Link } from "react-router-dom";
import { MessageCircle, Share2 } from "lucide-react";

type CommunityUpdatesProps = {
  updates: CommunityUpdate[];
};

const CommunityUpdatesComponent = ({ updates }: CommunityUpdatesProps) => {
  return (
    <Card className="glass-panel border-none">
      <CardHeader className="p-6 pb-4">
        <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-primary">
          Peer updates
        </Badge>
        <CardTitle className="text-foreground">What your peers shipped</CardTitle>
        <p className="text-sm text-muted-foreground">
          Celebrate wins and jump into conversations from the community feed.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        {updates.map((update) => {
          const relativeTime = formatDistanceToNow(new Date(update.createdAt), { addSuffix: true });
          return (
            <div key={update.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border border-white/10 bg-primary/10 text-primary">
                  <AvatarFallback>{update.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{update.learner}</p>
                    <span className="text-xs text-muted-foreground">{update.role}</span>
                    <span className="text-xs text-muted-foreground">• {relativeTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{update.message}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-primary/70">
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[11px] uppercase tracking-[0.25em] text-primary">
                      {update.highlight}
                    </Badge>
                    {update.courseSlug ? (
                      <Link to={`/courses/${update.courseSlug}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <MessageCircle className="h-3 w-3" /> View course
                      </Link>
                    ) : null}
                    <a
                      href="https://community.mikenet.academy/feed"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Share2 className="h-3 w-3" /> Join discussion
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const CommunityUpdates = memo(CommunityUpdatesComponent);
