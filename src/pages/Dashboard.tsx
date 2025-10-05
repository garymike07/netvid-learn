import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Loader2, PlayCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { COURSES } from "@/data/courses";
import { calculateMetrics, loadProgress, resetProgress, type UserProgress } from "@/lib/progress";
import { toast } from "sonner";

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

const formatCountdown = (ms: number | null) => {
  if (ms === null) return null;
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { hasActiveSubscription, isTrialActive, loading: subscriptionLoading, durationMs, openUpgradeDialog } = useSubscription();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(user?.id));
  const [signingOut, setSigningOut] = useState(false);
  const metrics = useMemo(() => calculateMetrics(progress), [progress]);
  const continueLearning = useMemo(() => deriveContinueList(progress), [progress]);
  const hasSubscriptionAccess = hasActiveSubscription || isTrialActive;
  const showUpgradeOverlay = !subscriptionLoading && !hasSubscriptionAccess;
  const trialCountdown = useMemo(() => formatCountdown(durationMs), [durationMs]);

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

  const handleLockedNavigation = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    openUpgradeDialog();
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
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 motion-safe:animate-fade-up">
          <h1 className="mb-4 text-4xl font-semibold text-foreground">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        <div className="mb-8 motion-safe:animate-fade-up">
          <div
            className={`glass-panel rounded-2xl border p-6 ${
              subscriptionLoading
                ? "border-white/10 bg-white/5"
                : showUpgradeOverlay
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-primary/30 bg-primary/10"
            }`}
          >
            {subscriptionLoading ? (
              <p className="text-sm text-muted-foreground">Checking your trial status...</p>
            ) : hasActiveSubscription ? (
              <div>
                <h2 className="text-lg font-semibold text-foreground">Premium plan active</h2>
                <p className="mt-2 text-sm text-muted-foreground">Enjoy unlimited access to every course, lab, and certification.</p>
              </div>
            ) : isTrialActive ? (
              <div>
                <h2 className="text-lg font-semibold text-foreground">20-day trial in progress</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {trialCountdown ? `Time remaining: ${trialCountdown}` : "Your access counter updates every second."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Trial ended</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Upgrade to regain access to premium lessons and labs.</p>
                </div>
                <Button size="sm" className="w-full sm:w-auto" onClick={openUpgradeDialog}>
                  Upgrade plan
                </Button>
              </div>
            )}
          </div>
        </div>

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
              {showUpgradeOverlay ? (
                <Button onClick={openUpgradeDialog}>Upgrade plan</Button>
              ) : (
                <Button asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              )}
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
                    to={showUpgradeOverlay ? "#upgrade" : `/courses/${course.slug}`}
                    onClick={showUpgradeOverlay ? handleLockedNavigation : undefined}
                    className={`rounded-full border border-white/15 px-3 py-1 text-sm font-semibold transition ${
                      showUpgradeOverlay
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-white/5 text-primary hover:bg-white/10"
                    }`}
                  >
                    {showUpgradeOverlay ? "Unlock course" : `${course.progress}% complete`}
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
