import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Loader2, PlayCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

const Dashboard = () => {
  const { user, signOut } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
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

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.coursesEnrolled}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Videos Watched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.videosWatched}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.certificatesEarned}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.progressPercentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="md:hidden" onClick={handleResetProgress}>
                Reset Progress
              </Button>
              <Button asChild variant="default">
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {continueLearning.map((course) => (
                <div key={course.id} className="rounded-lg border border-border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.level} • Next: {course.nextLessonTitle}
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.slug}`}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary/20"
                    >
                      {course.progress}% complete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
