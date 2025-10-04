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

const Courses = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() =>
    typeof window === "undefined" ? createEmptyProgress() : loadProgress(user?.id),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setProgress(loadProgress(user?.id));
  }, [user?.id]);

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
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          {user ? (
            <Link to="/dashboard">
              <Button variant="default" size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/auth?redirect=%2Fcourses">
              <Button variant="default" size="lg">Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Complete Network Engineering Curriculum
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Progressive learning path from beginner to expert. Each module includes written lessons, 
              video tutorials, hands-on labs, and assessments.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Course Library</h2>
              <p className="mt-2 text-muted-foreground">
                Choose a track that matches your experience. Your enrollment syncs automatically with the dashboard.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courseCards.map(({ course, totalLessons, completion, hasProgress, ctaLabel, ctaTarget }) => (
                <Card
                  key={course.id}
                  className={`flex h-full flex-col border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary/80 ${
                    course.isPremium ? "hover:shadow-xl" : "hover:shadow-lg"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      {course.isPremium && <Lock className="h-4 w-4 text-accent" />}
                    </div>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{course.level}</span>
                      {course.duration && <span className="text-muted-foreground">{course.duration}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{course.summary}</p>
                      <div className="flex items-center gap-2 text-sm text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        Includes labs, quizzes, and certifications
                      </div>
                      {user ? (
                        <p className="text-xs font-medium text-muted-foreground">
                          {hasProgress
                            ? `${completion}% complete • ${totalLessons} lessons`
                            : `Not started • ${totalLessons} lessons`}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-muted-foreground">
                          {course.isPremium ? "Premium access requires sign in" : "Free preview available"}
                        </p>
                      )}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={ctaTarget}>{ctaLabel}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Curriculum />

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sign up now and get immediate access to Level 1 content completely free.
            </p>
            <Link to={user ? "/dashboard" : "/auth?redirect=%2Fdashboard"}>
              <Button size="xl" className="gap-2">
                <PlayCircle className="w-5 h-5" />
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
