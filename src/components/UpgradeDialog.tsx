import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";

const UpgradeDialog = () => {
  const { upgradeDialogOpen, setUpgradeDialogOpen } = useSubscription();

  return (
    <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
      <DialogContent className="glass-panel max-w-lg border-none sm:rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold text-foreground">Upgrade to keep learning</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Continue accessing premium modules, labs, and downloadable resources after your 14-day trial ends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4">
            {[{
              label: "All premium video courses",
              accent: "Unlimited streaming",
            }, {
              label: "Hands-on lab simulations",
              accent: "Unlimited attempts",
            }, {
              label: "Career accelerator toolkit",
              accent: "Resume & interview prep",
            }].map((feature) => (
              <div key={feature.label} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <Badge variant="secondary" className="border-white/10 bg-primary/15 text-primary">
                  {feature.accent}
                </Badge>
                <span className="text-sm text-muted-foreground">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-primary">
            <p className="font-semibold">Coming soon</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Secure checkout with M-Pesa and cards</li>
              <li>Referral rewards for inviting friends</li>
              <li>Automated progress summary emails</li>
            </ul>
          </div>

          <Button size="lg" className="w-full" onClick={() => setUpgradeDialogOpen(false)}>
            Notify me when billing launches
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
