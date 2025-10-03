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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">Network Academy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/courses" className="text-foreground hover:text-primary transition-colors">
            Courses
          </Link>
          <Link to="/#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          {user && !loading && (
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
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
              <Link to="/auth">
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
