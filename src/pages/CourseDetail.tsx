import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Clock, ExternalLink, Film, Layers, PlayCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseBySlug } from "@/data/courses";
import { loadProgress, saveProgress, updateLessonCompletion, type UserProgress } from "@/lib/progress";
import { toast } from "sonner";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(user?.id));
  const [videoDialog, setVideoDialog] = useState<{ lessonId: string; title: string; videoUrl: string } | null>(null);

  const course = useMemo(() => (slug ? getCourseBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    setProgress(loadProgress(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (!course && slug) {
      navigate("/courses", { replace: true });
    }
  }, [course, slug, navigate]);

  if (!course) {
    return null;
  }

  const courseProgress = progress.courses[course.id] ?? { courseId: course.id, completedLessons: [] };
  const completedSet = new Set(courseProgress.completedLessons);
  const lessons = course.modules.flatMap((module) => module.lessons);
  const completedCount = lessons.filter((lesson) => completedSet.has(lesson.id)).length;
  const totalLessons = lessons.length;
  const completionPercentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const coursePath = `/courses/${course.slug}`;
  const authRedirect = `/auth?redirect=${encodeURIComponent(coursePath)}`;
  const isGuest = !user;

  const handleToggleLesson = (lessonId: string, checked: boolean) => {
    if (isGuest) {
      toast.info("Sign in to track your progress.");
      navigate(authRedirect);
      return;
    }
    const updated = updateLessonCompletion(progress, course.id, lessonId, checked);
    setProgress(updated);
    saveProgress(updated, user?.id);
  };

  const handleStartLearning = () => {
    if (isGuest) {
      toast.info("Sign in to start learning.");
      navigate(authRedirect);
      return;
    }
    const nextLesson = lessons.find((lesson) => !completedSet.has(lesson.id)) ?? lessons[0];
    if (!nextLesson) return;

    const element = document.getElementById(nextLesson.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("ring", "ring-primary", "ring-offset-2");
      setTimeout(() => element.classList.remove("ring", "ring-primary", "ring-offset-2"), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/courses" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to courses
              </Link>
            </Button>
            <Badge variant={course.isPremium ? "default" : "secondary"}>{course.level}</Badge>
          </div>
          <Button size="lg" className="gap-2" onClick={handleStartLearning}>
            <PlayCircle className="h-5 w-5" />
            {isGuest ? "Sign in to start" : "Start learning"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-12">
        <Dialog open={Boolean(videoDialog)} onOpenChange={(open) => !open && setVideoDialog(null)}>
          <DialogContent className="max-w-3xl">
            {videoDialog ? (
              <>
                <DialogHeader>
                  <DialogTitle>{videoDialog.title}</DialogTitle>
                  <DialogDescription>Watch the lesson without leaving the course.</DialogDescription>
                </DialogHeader>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe
                    title={videoDialog.title}
                    src={`${videoDialog.videoUrl}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        {isGuest && (
          <section className="rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="text-lg font-semibold text-foreground">Sign in to track your learning</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to mark lessons complete, resume where you left off, and unlock premium training.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link to={authRedirect}>Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/auth?redirect=%2Fdashboard">Create free account</Link>
              </Button>
            </div>
          </section>
        )}

        <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>

            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              <iframe
                title={course.title}
                src={`${course.heroVideo}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration}
                  </span>
                  <span>Lessons: {totalLessons}</span>
                </div>
                <div className="w-full max-w-sm">
                  <Progress value={completionPercentage} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {completedCount} of {totalLessons} lessons completed ({completionPercentage}%)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="self-start border-2">
            <CardHeader>
              <CardTitle>What you will achieve</CardTitle>
              <CardDescription>Master skills that Kenyan employers look for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {course.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-2 text-sm">
                    <Layers className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{outcome}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-secondary/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Prerequisites</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {course.prerequisites.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Course modules</h2>
            <p className="text-sm text-muted-foreground">
              Track progress by marking each lesson complete after you finish watching or labbing.
            </p>
          </div>

          <div className="space-y-4">
            {course.modules.map((module) => (
              <Card key={module.id} className="border border-border/60">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Film className="h-5 w-5 text-primary" />
                        {module.title}
                      </CardTitle>
                      <CardDescription className="mt-2 max-w-3xl text-base text-muted-foreground">
                        {module.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{module.lessons.length} lessons</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {module.lessons.map((lesson) => {
                    const completed = completedSet.has(lesson.id);
                    return (
                      <div
                        id={lesson.id}
                        key={lesson.id}
                        className="flex flex-col gap-4 rounded-lg border border-border/80 bg-muted/30 p-4 transition hover:border-primary/60 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-1 items-start gap-4">
                          <Checkbox
                            checked={completed}
                            disabled={isGuest}
                            onCheckedChange={(checked) => handleToggleLesson(lesson.id, Boolean(checked))}
                            aria-label={`Mark ${lesson.title} ${completed ? "incomplete" : "complete"}`}
                          />
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-3 py-1">
                                <Clock className="h-3 w-3" /> {lesson.duration}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-3 py-1 capitalize">
                                <Layers className="h-3 w-3" /> {lesson.type}
                              </span>
                            </div>
                            {lesson.resources && lesson.resources.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {lesson.resources.map((resource) => (
                                  <a
                                    key={resource.label}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-primary hover:border-primary"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {resource.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {lesson.videoUrl && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() =>
                              setVideoDialog({ lessonId: lesson.id, title: lesson.title, videoUrl: lesson.videoUrl })
                            }
                          >
                            Watch lesson
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-secondary/20 p-6">
          <h2 className="text-xl font-semibold text-foreground">Next steps</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete all lessons and labs to unlock a downloadable certificate. Stay consistent – the platform saves your
            progress every time you mark a lesson complete.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="lg" className="gap-2" onClick={handleStartLearning}>
              {isGuest ? "Sign in to start" : "Continue from current lesson"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={isGuest ? "/auth?redirect=%2Fdashboard" : "/dashboard"}>View dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseDetail;
