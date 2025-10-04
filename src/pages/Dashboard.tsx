import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Loader2, PlayCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { COURSES } from "@/data/courses";
import { calculateMetrics, loadProgress, resetProgress, type UserProgress } from "@/lib/progress";
import { toast } from "sonner";
import TrialBanner from "@/components/TrialBanner";

type ContinueCourse = {
  id: string;
  title: string;
  level: string;
  progress: number;
  nextLessonTitle: string;
  slug: string;
};

const deriveContinueList = (progress: UserProgress): ContinueCourse[] => {
  return COURSES.map((course) => {
    const courseProgress = progress.courses[course.id];
    const lessonList = course.modules.flatMap((module) => module.lessons);
    const completedSet = new Set(courseProgress?.completedLessons ?? []);
    const nextLesson = lessonList.find((lesson) => !completedSet.has(lesson.id)) ?? lessonList[lessonList.length - 1];

    const totalLessons = lessonList.length;
    const completedCount = lessonList.filter((lesson) => completedSet.has(lesson.id)).length;
    const progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    return {
      id: course.id,
      title: course.title,
      level: course.level,
      progress: progressPercent,
      nextLessonTitle: progressPercent === 100 ? "🎉 Course completed" : nextLesson?.title ?? "Start your first lesson",
      slug: course.slug,
    };
  });
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isTrialActive, hasActiveSubscription, durationMs, openUpgradeDialog, loading: subscriptionLoading } = useSubscription();
  const [msRemaining, setMsRemaining] = useState(durationMs);
  const countdown = useMemo(() => {
    if (msRemaining == null) return null;
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    return { days, hours, minutes };
  }, [msRemaining]);

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
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(user?.id));
  const [signingOut, setSigningOut] = useState(false);
  const metrics = useMemo(() => calculateMetrics(progress), [progress]);
  const continueLearning = useMemo(() => deriveContinueList(progress), [progress]);

  useEffect(() => {
    setProgress(loadProgress(user?.id));
  }, [user?.id]);

  useEffect(() => {
    const syncProgress = () => {
      setProgress(loadProgress(user?.id));
    };

    if (typeof window === "undefined") return;

    window.addEventListener("focus", syncProgress);
    window.addEventListener("storage", syncProgress);

    return () => {
      window.removeEventListener("focus", syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, [user?.id]);

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

  const handleResetProgress = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("This will clear all tracked lesson progress. Continue?");
      if (!confirmed) return;
    }

    const fresh = resetProgress(user?.id);
    setProgress(fresh);
    toast.success("Progress reset", { description: "All lessons are now marked as not started." });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleResetProgress} className="hidden md:inline-flex">
              Reset Progress
            </Button>
            <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2">
              {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {signingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
        <TrialBanner />
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 motion-safe:animate-fade-up">
          <h1 className="mb-4 text-4xl font-semibold text-foreground">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        {!subscriptionLoading && !hasActiveSubscription && (
          <Card
            className={`mb-12 p-6 text-sm ${
              isTrialActive
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {isTrialActive ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary">Your trial is active</h2>
                  <p>Make the most of premium lessons while you have access.</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <span className="text-xs uppercase tracking-widest">Time remaining</span>
                  <span className="text-2xl font-semibold">
                    {countdown
                      ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
                      : "14 days"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold">Trial ended</h2>
                  <p>Upgrade to regain access to premium tracks, labs, and certifications.</p>
                </div>
                <Button onClick={openUpgradeDialog} size="sm">
                  Upgrade now
                </Button>
              </div>
            )}
            {isTrialActive && (
              <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-4 text-xs text-muted-foreground">
                Tip: Finish at least one module per day to maximise your learning streak before the trial ends.
              </div>
            )}
          </Card>
        )}

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[{
            label: "Courses Enrolled",
            value: metrics.coursesEnrolled,
            icon: BookOpen,
          }, {
            label: "Videos Watched",
            value: metrics.videosWatched,
            icon: PlayCircle,
          }, {
            label: "Certificates",
            value: metrics.certificatesEarned,
            icon: Award,
          }, {
            label: "Progress",
            value: `${metrics.progressPercentage}%`,
            icon: TrendingUp,
          }].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 motion-safe:animate-fade-up" style={{ animationDelay: `${0.08 * index}s` }}>
                <CardHeader className="flex items-center justify-between space-y-0 p-0">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="rounded-full bg-primary/15 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="mt-6 p-0">
                  <span className="text-3xl font-semibold text-foreground">{stat.value}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="motion-safe:animate-fade-up">
          <CardHeader className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-foreground">Continue Learning</CardTitle>
              <CardDescription className="text-muted-foreground">Pick up where you left off</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="md:hidden" onClick={handleResetProgress}>
                Reset Progress
              </Button>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {continueLearning.map((course, index) => (
              <div key={course.id} className="glass-panel relative rounded-2xl p-5 motion-safe:animate-fade-up" style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.level} • Next: {course.nextLessonTitle}
                    </p>
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold text-primary transition hover:bg-white/10"
                  >
                    {course.progress}% complete
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
