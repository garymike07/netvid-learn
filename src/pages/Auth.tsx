import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthenticateWithRedirectCallback, SignIn, SignUp } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorText: "hsl(var(--foreground))",
    colorTextOnPrimary: "hsl(var(--primary-foreground))",
    colorBackground: "hsl(var(--card))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    borderRadius: "1.25rem",
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card:
      "relative overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/15 via-background/95 to-background/95 p-0 shadow-[0_32px_95px_-48px_hsl(var(--primary))] backdrop-blur-2xl",
    headerTitle: "text-3xl font-bold tracking-tight text-primary-foreground drop-shadow-[0_6px_18px_rgba(30,64,175,0.45)]",
    headerSubtitle: "text-base text-primary/80 font-medium",
    formFieldLabel: "text-xs font-semibold uppercase tracking-[0.24em] text-foreground/70",
    formFieldInput:
      "bg-foreground/10 border border-primary/40 text-foreground placeholder:text-foreground/40 shadow-inner shadow-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 focus:ring-offset-background",
    formFieldInputShowPasswordButton: "text-primary hover:text-primary/80",
    formButtonPrimary:
      "bg-gradient-to-r from-primary via-accent to-primary/85 text-primary-foreground font-semibold shadow-[0_22px_45px_-28px_hsl(var(--primary))] hover:from-primary/90 hover:to-accent/90 hover:shadow-[0_28px_55px_-25px_hsl(var(--primary))] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    socialButtons: "gap-3",
    socialButtonsProvider:
      "bg-background/70 border border-primary/40 text-foreground hover:bg-primary/20 hover:border-primary/60 transition-colors duration-300",
    dividerRow: "text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80",
    footerAction__signIn: "hidden",
    footerAction__signUp: "hidden",
  },
};

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";
  const redirectQueryString = `redirect=${encodeURIComponent(redirectTo)}`;
  const signInUrl = `/auth?mode=signin&${redirectQueryString}`;
  const signUpUrl = `/auth?mode=signup&${redirectQueryString}`;
  const callbackPath = `/auth/sso-callback`;
  const callbackRedirect =
    typeof window !== "undefined" ? window.sessionStorage.getItem("auth:redirectTo") ?? redirectTo : redirectTo;
  const isCallbackRoute = location.pathname === callbackPath;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = origin ? `${origin}${callbackPath}` : callbackPath;

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signin" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("auth:redirectTo", redirectTo);
    }
  }, [redirectTo]);

  const toggleLabel = useMemo(
    () => (mode === "signin" ? "Need an account? Create one" : "Already registered? Sign in"),
    [mode],
  );

  if (isCallbackRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <AuthenticateWithRedirectCallback afterSignInUrl={callbackRedirect} afterSignUpUrl={callbackRedirect} />
      </div>
    );
  }

  const alreadyAuthenticated = !loading && Boolean(user);
  const displayName = user?.fullName?.trim()?.length ? user.fullName : user?.email;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 to-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-background/90 to-background/95 shadow-[0_40px_120px_-55px_hsl(var(--primary))] backdrop-blur-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold text-foreground">
              {mode === "signin" ? "Welcome Back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue your learning journey"
                : "Start learning networking the right way"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alreadyAuthenticated ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
                <p className="font-semibold">You're already signed in{displayName ? ` as ${displayName}` : ""}.</p>
                <p className="mt-1 text-primary/80">You can continue browsing below or head straight to your dashboard.</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button asChild size="sm" variant="default" className="sm:flex-1">
                    <Link to={redirectTo}>Go to dashboard</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="sm:flex-1">
                    <Link to="/">Back to home</Link>
                  </Button>
                </div>
              </div>
            ) : null}
            {mode === "signin" ? (
              <SignIn
                routing="path"
                path="/auth"
                appearance={clerkAppearance}
                redirectUrl={callbackUrl}
                afterSignInUrl={redirectTo}
                signUpUrl={signUpUrl}
              />
            ) : (
              <SignUp
                routing="path"
                path="/auth"
                appearance={clerkAppearance}
                redirectUrl={callbackUrl}
                afterSignUpUrl={redirectTo}
                signInUrl={signInUrl}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
            <Button
              type="button"
              variant="link"
              className="p-0 text-primary"
              onClick={() => {
                setMode((prev) => {
                  const next = prev === "signin" ? "signup" : "signin";
                  navigate(next === "signin" ? signInUrl : signUpUrl, { replace: true });
                  return next;
                });
              }}
            >
              {toggleLabel}
            </Button>
            <p>By continuing you agree to receive important updates about your learning progress.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
