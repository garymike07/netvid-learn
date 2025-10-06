import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Curriculum from "@/components/Curriculum";
import Footer from "@/components/Footer";
import { COURSES } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { createEmptyProgress, loadProgress, type UserProgress } from "@/lib/progress";
import { trackEvent } from "@/lib/analytics";

const Courses = () => {
  const { user } = useAuth();
  const { hasActiveSubscription, isTrialActive, loading: subscriptionLoading, openUpgradeDialog } = useSubscription();
  const hasSubscriptionAccess = hasActiveSubscription || isTrialActive;
  const subscriptionPending = subscriptionLoading && Boolean(user);
  const [progress, setProgress] = useState<UserProgress>(() =>
    typeof window === "undefined" ? createEmptyProgress() : loadProgress(user?.id),
  );
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setProgressLoading(true);
    setProgress(loadProgress(user?.id));
    setProgressLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sync = () => setProgress(loadProgress(user?.id));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [user?.id]);

  const courseCards = useMemo(() => {
    return COURSES.map((course) => {
      const requiresPremium = course.isPremium;
      const locked = Boolean(user && requiresPremium && !subscriptionPending && !hasSubscriptionAccess);
      const pendingAccess = Boolean(user && requiresPremium && subscriptionPending && !hasSubscriptionAccess);
      const lessonList = course.modules.flatMap((module) => module.lessons);
      const totalLessons = lessonList.length;
      const courseProgress = progress.courses[course.id];
      const completedSet = new Set(courseProgress?.completedLessons ?? []);
      const completedCount = lessonList.filter((lesson) => completedSet.has(lesson.id)).length;
      const completion = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
      const hasProgress = completedSet.size > 0;
      const route = `/courses/${course.slug}`;
      const redirectParam = encodeURIComponent(route);
      const authPath = `/auth?redirect=${redirectParam}`;

      let ctaLabel = "View learning path";
      let ctaTarget = route;
      let ctaMode: "link" | "upgrade" | "disabled" = "link";

      if (!user && requiresPremium) {
        ctaLabel = "Sign in to unlock";
        ctaTarget = authPath;
      } else if (user) {
        if (locked) {
          ctaLabel = "Upgrade to unlock";
          ctaMode = "upgrade";
        } else if (pendingAccess) {
          ctaLabel = "Checking access...";
          ctaMode = "disabled";
        } else if (completion === 100) {
          ctaLabel = "Review course";
        } else if (hasProgress) {
          ctaLabel = `Continue (${completion}% done)`;
        } else {
          ctaLabel = "Start learning";
        }
      }

      return {
        course,
        totalLessons,
        completion,
        hasProgress,
        ctaLabel,
        ctaTarget,
        ctaMode,
        locked,
        pendingAccess,
      };
    });
  }, [progress, user, hasSubscriptionAccess, subscriptionPending]);

  const showSkeleton = progressLoading || subscriptionPending;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Back to Home</span>
          </Link>
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="border-white/10 bg-white/5">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth?redirect=%2Fcourses">
              <Button size="lg">Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, hsla(278,97%,72%,0.2), transparent 60%)" }} />
          <div className="container relative mx-auto px-4 text-center motion-safe:animate-fade-up">
            <h1 className="mb-6 text-4xl font-semibold text-foreground md:text-5xl">
              Complete Network Engineering Curriculum
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Progressive learning path from beginner to expert. Each module includes written lessons, video tutorials, hands-on labs, and assessments.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center motion-safe:animate-fade-up">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Course Library</h2>
              <p className="mt-3 text-muted-foreground">
                Choose a track that matches your experience. Your enrollment syncs automatically with the dashboard.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {showSkeleton
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Card key={`skeleton-${index}`} className="flex h-full flex-col p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-40 rounded-full bg-white/5" />
                        <Skeleton className="h-4 w-28 rounded-full bg-white/5" />
                        <Skeleton className="h-20 w-full rounded-2xl bg-white/5" />
                        <Skeleton className="h-10 w-full rounded-full bg-white/5" />
                      </div>
                    </Card>
                  ))
                : courseCards.map(
                    (
                      {
                        course,
                        totalLessons,
                        completion,
                        hasProgress,
                        ctaLabel,
                        ctaTarget,
                        ctaMode,
                        locked,
                        pendingAccess,
                      },
                      index,
                    ) => (
                      <Card
                        key={course.id}
                        className="flex h-full flex-col p-6 motion-safe:animate-fade-up"
                        style={{ animationDelay: `${0.06 * index}s` }}
                      >
                        <CardHeader className="space-y-4 p-0">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-foreground">{course.title}</CardTitle>
                            {course.isPremium && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                                <Lock className="h-3 w-3" /> Premium
                              </span>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                            <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">{course.level}</span>
                            {course.duration && <span className="text-muted-foreground">{course.duration}</span>}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-between space-y-6 p-0">
                          <div className="space-y-4 text-sm text-muted-foreground">
                            <p>{course.summary}</p>
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle2 className="h-4 w-4" />
                              Includes labs, quizzes, and certifications
                            </div>
                            {user ? (
                              <p className="text-xs font-medium text-muted-foreground">
                                {hasProgress ? `${completion}% complete • ${totalLessons} lessons` : `Not started • ${totalLessons} lessons`}
                              </p>
                            ) : (
                              <p className="text-xs font-medium text-muted-foreground">
                                Sign in to track your learning progress
                              </p>
                            )}
                            {locked ? (
                              <p className="text-xs font-semibold text-destructive">Trial ended. Upgrade to regain access.</p>
                            ) : pendingAccess ? (
                              <p className="text-xs text-muted-foreground">Verifying your trial access...</p>
                            ) : null}
                          </div>
                          {ctaMode === "link" ? (
                            <Button asChild className="w-full">
                              <Link
                                to={ctaTarget}
                                onClick={() =>
                                  trackEvent("courses_navigate", { courseId: course.id, destination: ctaTarget })
                                }
                              >
                                {ctaLabel}
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              disabled={ctaMode === "disabled"}
                              onClick={() => {
                                if (ctaMode === "upgrade") {
                                  trackEvent("courses_upgrade_prompt", { courseId: course.id });
                                  openUpgradeDialog();
                                }
                              }}
                            >
                              {ctaLabel}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ),
                  )}
            </div>
          </div>
        </section>

        <Curriculum />

        <section className="relative py-24">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 10% 20%, hsla(215,91%,65%,0.22), transparent 60%)" }} />
          <div className="container relative mx-auto px-4 text-center motion-safe:animate-fade-up">
            <h2 className="mb-6 text-3xl font-semibold text-foreground">Ready to Start Learning?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Sign up now and get immediate access to Level 1 content completely free.
            </p>
            <Link
              to={user ? "/dashboard" : "/auth?redirect=%2Fdashboard"}
              onClick={() => trackEvent("courses_final_cta", { authenticated: Boolean(user) })}
            >
              <Button size="xl" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                {user ? "Resume learning" : "Start Free"}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
