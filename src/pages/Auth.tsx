import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "transparent",
    colorInputBackground: "hsl(var(--background))",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none p-0",
    headerTitle: "text-2xl font-semibold text-foreground",
    headerSubtitle: "text-sm text-muted-foreground",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    footerAction__signIn: "hidden",
    footerAction__signUp: "hidden",
  },
};

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signin" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  const toggleLabel = useMemo(
    () => (mode === "signin" ? "Need an account? Create one" : "Already registered? Sign in"),
    [mode],
  );

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

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
        <Card className="w-full max-w-md">
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
            {mode === "signin" ? (
              <SignIn routing="hash" redirectUrl={redirectTo} appearance={clerkAppearance} />
            ) : (
              <SignUp routing="hash" redirectUrl={redirectTo} afterSignUpUrl={redirectTo} appearance={clerkAppearance} />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
            <Button
              type="button"
              variant="link"
              className="p-0 text-primary"
              onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
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
