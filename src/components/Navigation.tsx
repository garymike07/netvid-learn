import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navigation = () => {
  const { user, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();
  const dashboardRedirect = "/auth?redirect=%2Fdashboard";

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out";
      toast.error(message);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/30 backdrop-blur-2xl transition-colors">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-2 text-foreground transition-colors hover:text-primary">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-primary">
            <div className="absolute inset-0 rounded-xl bg-primary/30 blur-2xl" />
            <GraduationCap className="relative h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Network Academy</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link to="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Courses
          </Link>
          <Link to="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Pricing
          </Link>
          {user && !loading && (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">My Space</Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <>
              <Link to={dashboardRedirect}>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/courses">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
