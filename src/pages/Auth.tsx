import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = async (values: AuthFormValues) => {
    setSubmitting(true);
    setFormMessage(null);

    try {
      if (mode === "signin") {
        const { error } = await signIn(values);
        if (error) {
          setFormMessage(error);
          return;
        }
        toast.success("Welcome back!", { description: "Redirecting you now" });
        navigate(redirectTo, { replace: true });
      } else {
        const { error, requiresVerification } = await signUp(values);
        if (error) {
          setFormMessage(error);
          return;
        }
        if (requiresVerification) {
          toast.success("Check your inbox to confirm your email");
          setFormMessage("We've sent a confirmation link to your email");
          return;
        }
        toast.success("Account created!", { description: "You are now signed in" });
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setFormMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">
              {mode === "signin" ? "Welcome Back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Sign in to continue your learning journey"
                : "Start learning networking the right way"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {mode === "signup"
                          ? "Use at least 6 characters. You can change this later."
                          : "Enter the password associated with your account."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formMessage && <p className="text-sm font-medium text-destructive">{formMessage}</p>}

                <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                  {submitting ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => {
                setMode((prev) => (prev === "signin" ? "signup" : "signin"));
                setFormMessage(null);
              }}
              className="text-primary hover:underline"
            >
              {toggleLabel}
            </button>
            <p>By continuing you agree to receive important updates about your learning progress.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
