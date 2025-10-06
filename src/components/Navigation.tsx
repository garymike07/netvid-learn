import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Headphones, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Verify", href: "/verify" },
];

const Navigation = () => {
  const { user, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [elevated, setElevated] = useState(false);
  const navigate = useNavigate();
  const dashboardRedirect = "/auth?redirect=%2Fdashboard";

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const authenticatedLinks = useMemo(
    () =>
      user && !loading
        ? [
            ...navLinks,
            { label: "Dashboard", href: "/dashboard" },
          ]
        : navLinks,
    [user, loading],
  );

  return (
    <motion.header
      className="sticky top-0 z-50 transition-colors"
      animate={{
        backgroundColor: elevated ? "rgba(9, 12, 24, 0.82)" : "rgba(9, 12, 24, 0.55)",
        backdropFilter: elevated ? "blur(18px) saturate(140%)" : "blur(26px)",
        borderBottomColor: elevated ? "hsla(220, 88%, 80%, 0.22)" : "hsla(220, 88%, 80%, 0.08)",
        boxShadow: elevated ? "0 18px 45px -32px rgba(64, 126, 255, 0.45)" : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottomWidth: 1 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <FadeIn className="flex items-center gap-3" delay={0.05}>
          <Link to="/" className="group flex items-center gap-3 text-foreground transition-colors hover:text-primary">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/95 p-1.5 shadow-glow ring-1 ring-primary/40 transition duration-md ease-emphasized group-hover:ring-primary">
              <img src="/images/mike-net-logo.png" alt="Mike Net Academy" className="h-full w-full object-contain" />
              <motion.span
                className="absolute inset-0 block bg-white/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.35 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-xl font-semibold tracking-tight">Mike Net Academy</span>
          </Link>
        </FadeIn>
        <nav className="hidden items-center gap-1 md:flex">
          {authenticatedLinks.map((link, index) => (
            <FadeIn key={link.href} delay={0.08 + index * 0.04}>
              <Link
                to={link.href}
                className="group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition duration-sm ease-emphasized hover:text-primary"
              >
                <span>{link.label}</span>
                <motion.span
                  className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-primary/70"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </Link>
            </FadeIn>
          ))}
        </nav>
        <FadeIn className="flex items-center gap-3" delay={0.12}>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="pill-primary" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  My Space
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2 shimmer-border">
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
                <Button variant="pill-primary" className="gap-2">
                  Get Started
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="icon-glow" size="icon" asChild>
              <Link to="/courses">
                <Compass />
              </Link>
            </Button>
            <Button variant="icon-glow" size="icon" asChild>
              <a href="mailto:support@mikenet.academy" aria-label="Contact support">
                <Headphones />
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </motion.header>
  );
};

export default Navigation;
