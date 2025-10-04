import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const TrialBanner = () => {
  const { user } = useAuth();
  const { loading, hasActiveSubscription, isTrialActive, isExpired, daysRemaining, openUpgradeDialog } = useSubscription();

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
            Your free trial is active{typeof daysRemaining === "number" ? ` • ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left` : ""}. Upgrade now to keep access to premium modules.
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
