import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Curriculum from "@/components/Curriculum";
import Footer from "@/components/Footer";
import { COURSES } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { createEmptyProgress, loadProgress, type UserProgress } from "@/lib/progress";
import TrialBanner from "@/components/TrialBanner";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Courses = () => {
  const { user } = useAuth();
  const { isTrialActive, hasActiveSubscription, durationMs, openUpgradeDialog } = useSubscription();
  const [msRemaining, setMsRemaining] = useState(durationMs);
  const countdown = useMemo(() => {
    if (msRemaining == null) return null;
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    return { days, hours, minutes };
  }, [msRemaining]);
  const [progress, setProgress] = useState<UserProgress>(() =>
    typeof window === "undefined" ? createEmptyProgress() : loadProgress(user?.id),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setProgress(loadProgress(user?.id));
  }, [user?.id]);

  useEffect(() => {
    setMsRemaining(durationMs);
  }, [durationMs]);

  useEffect(() => {
    if (!isTrialActive || durationMs == null) return;
    const interval = setInterval(() => {
      setMsRemaining((prev) => (prev == null ? null : Math.max(0, prev - 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTrialActive, durationMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sync = () => setProgress(loadProgress(user?.id));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [user?.id]);

  const courseCards = useMemo(() => {
    return COURSES.map((course) => {
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

      if (!user && course.isPremium) {
        ctaLabel = "Sign in to unlock";
        ctaTarget = authPath;
      } else if (user) {
        if (completion === 100) {
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
      };
    });
  }, [progress, user]);

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
        <TrialBanner />
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
              {courseCards.map(({ course, totalLessons, completion, hasProgress, ctaLabel, ctaTarget }, index) => {
                const premiumLocked =
                  course.isPremium && user && !hasActiveSubscription && !isTrialActive;

                return (
                <Card key={course.id} className="flex h-full flex-col p-6 motion-safe:animate-fade-up" style={{ animationDelay: `${0.06 * index}s` }}>
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
                          {course.isPremium ? "Premium access requires sign in" : "Free preview available"}
                        </p>
                      )}
                    </div>
                    {course.isPremium && user && !hasActiveSubscription && (
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
                        {premiumLocked
                          ? "Trial ended — upgrade to unlock premium modules."
                          : countdown
                            ? `Trial access active • ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m remaining.`
                            : "Trial access active."}
                      </div>
                    )}

                    <Button
                      asChild={!premiumLocked}
                      className="w-full"
                      onClick={premiumLocked ? openUpgradeDialog : undefined}
                      variant={premiumLocked ? "outline" : "default"}
                    >
                      {premiumLocked ? (
                        <span>Upgrade to continue</span>
                      ) : (
                        <Link to={ctaTarget}>{ctaLabel}</Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                );
              })}
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
            <Link to={user ? "/dashboard" : "/auth?redirect=%2Fdashboard"}>
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
