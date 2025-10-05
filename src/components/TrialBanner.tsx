import { useEffect, useMemo, useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const formatDuration = (ms: number | null) => {
  if (ms === null) return null;
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

const TrialBanner = () => {
  const { user } = useAuth();
  const { loading, hasActiveSubscription, isTrialActive, isExpired, durationMs, openUpgradeDialog } = useSubscription();
  const [localMs, setLocalMs] = useState(durationMs);

  useEffect(() => {
    setLocalMs(durationMs);
  }, [durationMs]);

  useEffect(() => {
    if (!isTrialActive || durationMs === null) return;

    const interval = setInterval(() => {
      setLocalMs((prev) => (prev === null ? null : Math.max(0, prev - 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTrialActive, durationMs]);

  const countdown = useMemo(() => formatDuration(localMs), [localMs]);

  if (!user || loading) {
    return null;
  }

  if (hasActiveSubscription) {
    return null;
  }

  if (isTrialActive) {
    return (
      <div className="border-b border-primary/30 bg-primary/10">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-3 text-sm text-primary sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            Your free trial is active
            {countdown
              ? ` • ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s remaining`
              : "."}
            Upgrade now to keep access to premium modules.
          </span>
          <Button size="sm" variant="outline" className="border-primary/40 text-primary" onClick={openUpgradeDialog}>
            Upgrade plan
          </Button>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="border-b border-destructive/30 bg-destructive/10">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">Your trial has ended. Upgrade to resume premium lessons and labs.</span>
          <Button size="sm" variant="default" onClick={openUpgradeDialog}>
            Unlock premium access
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default TrialBanner;
