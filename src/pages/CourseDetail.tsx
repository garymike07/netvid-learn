import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Award, Clock, ExternalLink, Film, Layers, PlayCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getCourseBySlug, type Lesson, type Module } from "@/data/courses";
import { loadProgress, saveProgress, updateLessonCompletion, type UserProgress } from "@/lib/progress";
import { toast } from "sonner";
import { useCertificates, type CourseCertificatePayload } from "@/contexts/CertificateContext";
import { FadeIn } from "@/components/motion";

type LessonTypeCounts = Record<Lesson["type"], number>;

const durationToMinutes = (duration: string | undefined): number => {
  if (!duration) return 0;
  const normalized = duration.toLowerCase();
  const pattern = /(?<value>\d+(?:\.\d+)?)\s*(?<unit>hours?|hrs?|h|minutes?|mins?|m)/g;
  let total = 0;
  for (const match of normalized.matchAll(pattern)) {
    const value = Number(match.groups?.value ?? 0);
    const unit = match.groups?.unit ?? "";
    if (!Number.isFinite(value)) continue;
    if (/^h/.test(unit)) {
      total += Math.round(value * 60);
    } else {
      total += Math.round(value);
    }
  }
  if (total === 0) {
    const numeric = Number(normalized.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? Math.round(numeric) : 0;
  }
  return total;
};

const formatMinutes = (minutes: number): string => {
  if (minutes <= 0) return "<5 min";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (remainder === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${remainder} min`;
};

const formatLessonTypeLabel = (type: Lesson["type"]): string => {
  switch (type) {
    case "video":
      return "Video";
    case "lab":
      return "Lab";
    case "reading":
      return "Reading";
    case "quiz":
      return "Quiz";
    default:
      return type;
  }
};

const getModuleStats = (module: Module) => {
  const counts: LessonTypeCounts = {
    video: 0,
    lab: 0,
    reading: 0,
    quiz: 0,
  };
  let totalMinutes = 0;
  for (const lesson of module.lessons) {
    counts[lesson.type] += 1;
    totalMinutes += durationToMinutes(lesson.duration);
  }
  return { counts, totalMinutes };
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

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive, hasActiveSubscription, loading: subscriptionLoading, durationMs, openUpgradeDialog, isExpired } = useSubscription();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(user?.id));
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const { ensureCertificate, downloadCertificate, getCertificateByCourse, loading: certificateLoading } = useCertificates();
  const [certificateBusy, setCertificateBusy] = useState(false);
  const isGuest = !user;

  const course = useMemo(() => (slug ? getCourseBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    setProgress(loadProgress(user?.id));
  }, [user?.id]);


  useEffect(() => {
    if (!course && slug) {
      navigate("/courses", { replace: true });
    }
  }, [course, slug, navigate]);

  type LessonCatalogEntry = { moduleId: string; moduleTitle: string; lesson: Lesson };

  const lessonCatalog = useMemo<LessonCatalogEntry[]>(() => {
    if (!course) return [];
    return course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ moduleId: module.id, moduleTitle: module.title, lesson })),
    );
  }, [course]);
  const lessons = useMemo(() => lessonCatalog.map((entry) => entry.lesson), [lessonCatalog]);
  const totalLessons = lessons.length;
  const hasSubscriptionAccess = hasActiveSubscription || isTrialActive;
  const trialCountdown = useMemo(() => formatCountdown(durationMs), [durationMs]);
  const certificatePayload = useMemo<CourseCertificatePayload | null>(
    () =>
      course
        ? {
            id: course.id,
            title: course.title,
            slug: course.slug,
            level: course.level,
            duration: course.duration ?? null,
            totalLessons,
          }
        : null,
    [course, totalLessons],
  );

  useEffect(() => {
    if (!course || !certificatePayload || isGuest) {
      return;
    }
    const progressEntry = progress.courses[course.id];
    const completedLessons = progressEntry?.completedLessons?.length ?? 0;
    if (certificatePayload.totalLessons === 0 || completedLessons < certificatePayload.totalLessons) {
      return;
    }
    if (getCertificateByCourse(course.id)) {
      return;
    }
    void ensureCertificate(certificatePayload);
  }, [course, certificatePayload, ensureCertificate, getCertificateByCourse, progress, isGuest]);

  if (!course) {
    return null;
  }

  const certificateDetails = certificatePayload!;
  const courseProgress = progress.courses[course.id] ?? { courseId: course.id, completedLessons: [] };
  const completedSet = new Set(courseProgress.completedLessons);
  const completedCount = lessons.filter((lesson) => completedSet.has(lesson.id)).length;
  const completionPercentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const certificateRecord = getCertificateByCourse(course.id);
  const coursePath = `/courses/${course.slug}`;
  const authRedirect = `/auth?redirect=${encodeURIComponent(coursePath)}`;
  const certificateEligible = !isGuest && completionPercentage === 100;
  const certificateAccessible = certificateEligible;
  const certificateButtonLabel = certificateBusy
    ? "Preparing..."
    : certificateRecord
      ? "Download certificate"
      : certificateEligible
        ? "Generate certificate"
        : "Complete course to unlock";
  const requiresPremium = course.isPremium;
  const subscriptionPending = subscriptionLoading && requiresPremium;
  const hasAccess = !requiresPremium || hasSubscriptionAccess;
  const interactionsDisabled = isGuest || subscriptionPending || (requiresPremium && !hasSubscriptionAccess);

  const handleDownloadCertificate = async () => {
    if (!certificateAccessible) {
      toast.info("Complete every lesson to unlock your certificate.");
      return;
    }
    setCertificateBusy(true);
    try {
      const record = await downloadCertificate(certificateDetails);
      toast.success("Certificate ready for download.", {
        description: `Certificate number ${record.certificate_number}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to download certificate.";
      toast.error(message);
    } finally {
      setCertificateBusy(false);
    }
  };

  const handleToggleLesson = (lessonId: string, checked: boolean) => {
    if (isGuest) {
      toast.info("Sign in to track your progress.");
      navigate(authRedirect);
      return false;
    }
    if (subscriptionPending) {
      toast.info("Verifying your trial status. Please try again in a moment.");
      return false;
    }
    if (requiresPremium && !hasSubscriptionAccess) {
      toast.info("Your trial has ended. Upgrade to resume learning.");
      openUpgradeDialog();
      return false;
    }
    const updated = updateLessonCompletion(progress, course.id, lessonId, checked);
    setProgress(updated);
    saveProgress(updated, user?.id);
    return true;
  };

  const handleStartLearning = () => {
    if (isGuest) {
      toast.info("Sign in to start learning.");
      navigate(authRedirect);
      return;
    }
    if (subscriptionPending) {
      toast.info("Verifying your trial status. Please try again in a moment.");
      return;
    }
    if (requiresPremium && !hasSubscriptionAccess) {
      toast.info("Your trial has ended. Upgrade to continue learning.");
      openUpgradeDialog();
      return;
    }
    const nextIndex = lessonCatalog.findIndex((entry) => !completedSet.has(entry.lesson.id));
    const targetIndex = nextIndex === -1 ? 0 : nextIndex;
    const targetEntry = lessonCatalog[targetIndex];
    if (!targetEntry) return;

    if (targetEntry.lesson.videoUrl) {
      goToLesson(targetIndex);
      return;
    }

    const element = document.getElementById(targetEntry.lesson.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("ring", "ring-primary", "ring-offset-2");
      setTimeout(() => element.classList.remove("ring", "ring-primary", "ring-offset-2"), 1800);
    }
  };

  const openLesson = (lessonId: string) => {
    if (subscriptionPending) {
      toast.info("Verifying your trial status. Please try again in a moment.");
      return;
    }
    if (requiresPremium && !hasSubscriptionAccess) {
      toast.info("Your trial has ended. Upgrade to continue learning.");
      openUpgradeDialog();
      return;
    }
    if (isGuest) {
      toast.info("Sign in to start learning.");
      navigate(authRedirect);
      return;
    }
    const index = lessonCatalog.findIndex((entry) => entry.lesson.id === lessonId);
    if (index === -1) {
      toast.error("Lesson not found");
      return;
    }
    const entry = lessonCatalog[index];
    if (!entry.lesson.videoUrl) {
      const element = document.getElementById(entry.lesson.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      toast.info("This lesson does not have a video. Review the resources below instead.");
      return;
    }
    goToLesson(index);
  };

  const goToLesson = (index: number | null) => {
    if (index === null) {
      setActiveLessonIndex(null);
      return;
    }
    if (index < 0 || index >= lessonCatalog.length) {
      setActiveLessonIndex(null);
      return;
    }
    setActiveLessonIndex(index);
  };

  const closeLesson = () => goToLesson(null);

  const activeLesson = activeLessonIndex !== null ? lessonCatalog[activeLessonIndex] : null;
  const nextLessonEntry = activeLessonIndex !== null ? lessonCatalog[activeLessonIndex + 1] : undefined;
  const prevLessonEntry = activeLessonIndex !== null && activeLessonIndex > 0 ? lessonCatalog[activeLessonIndex - 1] : undefined;
  const isActiveLessonComplete = activeLesson ? completedSet.has(activeLesson.lesson.id) : false;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,hsla(278,97%,72%,0.2),transparent_55%),radial-gradient(circle_at_85%_10%,hsla(215,91%,65%,0.22),transparent_60%)]" />

      <header className="relative z-20 border-b border-white/10 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
              <Link to="/courses" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to courses
              </Link>
            </Button>
            <Badge
              variant={course.isPremium ? "default" : "secondary"}
              className="border border-white/20 bg-white/10 text-xs font-semibold uppercase tracking-widest"
            >
              {course.level}
            </Badge>
          </div>
          <Button size="lg" variant="pill-primary" className="gap-2" onClick={handleStartLearning}>
            <PlayCircle className="h-5 w-5" />
            {isGuest ? "Sign in to start" : "Start learning"}
          </Button>
        </div>
      </header>

      <main className="relative z-20 container mx-auto space-y-12 px-4 py-16">
        <Dialog open={activeLessonIndex !== null} onOpenChange={(open) => !open && closeLesson()}>
          <DialogContent className="glass-panel max-h-[90vh] max-w-4xl overflow-hidden border-none p-0 sm:rounded-2xl md:max-w-5xl">
            {activeLesson ? (
              <div className="flex h-full max-h-[90vh] flex-col">
                <DialogHeader className="space-y-3 border-b border-white/10 px-6 py-5 text-left">
                  <DialogTitle className="text-2xl font-semibold text-foreground">{activeLesson.lesson.title}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {activeLesson.moduleTitle} • {activeLesson.lesson.duration} • {activeLesson.lesson.type}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {activeLesson.lesson.videoUrl ? (
                    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10">
                      <iframe
                        title={activeLesson.lesson.title}
                        src={`${activeLesson.lesson.videoUrl}?rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-muted-foreground">
                      No embedded video for this lesson. Review the summary and resources below.
                    </div>
                  )}
                  <div className="mt-6 space-y-5">
                    <p className="text-sm text-muted-foreground">{activeLesson.lesson.description}</p>
                    {activeLesson.lesson.resources && activeLesson.lesson.resources.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {activeLesson.lesson.resources.map((resource) => (
                          <a
                            key={resource.label}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-primary transition hover:border-primary"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {resource.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
                  <div className="flex gap-2">
                    {prevLessonEntry ? (
                      <Button
                        variant="outline"
                        onClick={() => goToLesson(activeLessonIndex !== null ? activeLessonIndex - 1 : null)}
                      >
                        Previous lesson
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={closeLesson}>
                        Close
                      </Button>
                    )}
                    {nextLessonEntry ? (
                      <Button
                        variant="outline"
                        onClick={() => goToLesson(activeLessonIndex !== null ? activeLessonIndex + 1 : null)}
                      >
                        Next lesson
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!isGuest ? (
                      <>
                        <Button
                          variant={isActiveLessonComplete ? "secondary" : "default"}
                          disabled={interactionsDisabled}
                          onClick={() => handleToggleLesson(activeLesson.lesson.id, !isActiveLessonComplete)}
                        >
                          {isActiveLessonComplete ? "Mark incomplete" : "Mark complete"}
                        </Button>
                        {nextLessonEntry ? (
                          <Button
                            disabled={interactionsDisabled}
                            onClick={() => {
                              if (handleToggleLesson(activeLesson.lesson.id, true)) {
                                goToLesson(activeLessonIndex !== null ? activeLessonIndex + 1 : null);
                              }
                            }}
                          >
                            Complete & continue
                          </Button>
                        ) : (
                          <Button
                            disabled={interactionsDisabled}
                            onClick={() => {
                              if (handleToggleLesson(activeLesson.lesson.id, true)) {
                                closeLesson();
                              }
                            }}
                          >
                            Complete lesson
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button asChild>
                        <Link to={authRedirect}>Sign in to track progress</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {isGuest && (
          <section className="glass-panel rounded-2xl border-none p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {requiresPremium ? "Sign in to unlock this premium course" : "Sign in to track your learning"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {requiresPremium
                ? "Create a free account to start your 20-day trial and access every premium module."
                : "Create an account to mark lessons complete and resume where you left off."}
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

        {requiresPremium && !isGuest && (
          <section className="glass-panel rounded-2xl border border-primary/30 bg-primary/5 p-6">
            {subscriptionPending ? (
              <p className="text-sm text-muted-foreground">Verifying your trial status...</p>
            ) : hasSubscriptionAccess ? (
              hasActiveSubscription ? (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Premium plan active</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Enjoy unlimited access to every module and downloadable resource.</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">20-day trial in progress</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {trialCountdown ? `Time remaining: ${trialCountdown}` : "Tracking your remaining access in real time."}
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Trial ended</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Upgrade to resume premium lessons, labs, and certifications.</p>
                </div>
                <Button size="sm" className="w-full sm:w-auto" onClick={openUpgradeDialog}>
                  Upgrade plan
                </Button>
              </div>
            )}
          </section>
        )}

        <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <FadeIn>
              <h1 className="text-4xl font-semibold text-foreground md:text-5xl">{course.title}</h1>
            </FadeIn>
            <FadeIn delay={0.06}>
              <p className="text-lg text-muted-foreground">{course.description}</p>
            </FadeIn>
            <FadeIn delay={0.12}>
              <motion.div
                className="glass-panel overflow-hidden rounded-3xl"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-video">
                  <iframe
                    title={course.title}
                    src={`${course.heroVideo}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.18} className="space-y-2">
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
            </FadeIn>

            <FadeIn delay={0.24}>
              <div className="glass-panel rounded-2xl border-none p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Completion certificate</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Finish every lesson to receive a personalised Mike Net Academy certificate with a verifiable number.
                    </p>
                  </div>
                </div>
                {certificateRecord ? (
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-semibold uppercase tracking-widest text-primary">
                    #{certificateRecord.certificate_number}
                  </Badge>
                ) : certificateEligible ? (
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-widest text-primary">
                    Generating
                  </Badge>
                ) : null}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                {isGuest ? (
                  <>
                    <Button asChild size="sm">
                      <Link to={authRedirect}>Sign in to earn certificate</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/auth?redirect=%2Fdashboard">Create free account</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleDownloadCertificate}
                    disabled={certificateBusy || certificateLoading || !certificateAccessible}
                    className="w-full sm:w-auto"
                  >
                    {certificateButtonLabel}
                  </Button>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Issue date and certificate number are stored securely for future verification requests.
              </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <Card className="glass-panel self-start border-none p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-foreground">What you will achieve</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Master skills that Kenyan employers look for.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0 pt-6">
                <div className="space-y-3">
                  {course.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="text-muted-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
                <div className="glass-panel rounded-2xl border-none p-4">
                  <h3 className="text-sm font-semibold text-foreground">Prerequisites</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {course.prerequisites.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between motion-safe:animate-fade-up">
            <h2 className="text-2xl font-semibold text-foreground">Course modules</h2>
            <p className="text-sm text-muted-foreground">
              Track progress by marking each lesson complete after you finish watching or labbing.
            </p>
          </div>

          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => {
              const stats = getModuleStats(module);
              const lessonTypeBadges = Object.entries(stats.counts)
                .filter(([, count]) => count > 0)
                .map(([type, count]) => ({ type: type as Lesson["type"], count }));
              return (
                <FadeIn key={module.id} delay={0.05 * moduleIndex}>
                  <Card className="glass-panel border-none p-6">
                <CardHeader className="p-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        <Film className="h-5 w-5 text-primary" />
                        {module.title}
                      </CardTitle>
                      <CardDescription className="mt-2 max-w-3xl text-base text-muted-foreground">
                        {module.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-white/15 bg-white/5 text-muted-foreground">
                      {module.lessons.length} lessons
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-0 pt-6">
                  {module.notes && module.notes.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                      <h3 className="text-sm font-semibold text-foreground">What you'll cover in this module</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {module.notes.map((note, noteIndex) => (
                          <li key={`${module.id}-note-${noteIndex}`}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="glass-panel rounded-2xl border-none p-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-foreground">
                        <Clock className="h-4 w-4" />
                        {formatMinutes(stats.totalMinutes)} total learning time
                      </span>
                      {lessonTypeBadges.map(({ type, count }) => (
                        <span
                          key={`${module.id}-${type}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize"
                        >
                          <Layers className="h-3 w-3" />
                          {count} {formatLessonTypeLabel(type)}
                          {count > 1 ? "s" : ""}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-3">
                      {module.lessons.map((lesson) => (
                        <li key={`${module.id}-${lesson.id}-overview`} className="border-l-2 border-primary/40 pl-3">
                          <p className="text-sm font-semibold text-foreground">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {module.lessons.map((lesson) => {
                    const completed = completedSet.has(lesson.id);
                    return (
                      <div
                        id={lesson.id}
                        key={lesson.id}
                        className="glass-panel flex flex-col gap-4 rounded-2xl border-none p-4 transition hover:shadow-[0_24px_60px_-30px_hsla(217,91%,65%,0.55)] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-1 items-start gap-4">
                          <Checkbox
                            checked={completed}
                            disabled={interactionsDisabled}
                            onCheckedChange={(checked) => handleToggleLesson(lesson.id, Boolean(checked))}
                            aria-label={`Mark ${lesson.title} ${completed ? "incomplete" : "complete"}`}
                          />
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                <Clock className="h-3 w-3" /> {lesson.duration}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize">
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
                                    className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-primary transition hover:border-primary"
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
                            disabled={interactionsDisabled}
                            onClick={() => openLesson(lesson.id)}
                          >
                            {completed ? "Rewatch lesson" : "Watch lesson"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
                  </Card>
                </FadeIn>
            );
          })}
          </div>
        </section>

        <FadeIn>
          <section className="glass-panel rounded-2xl border-none p-6">
            <h2 className="text-xl font-semibold text-foreground">Next steps</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete all lessons and labs to unlock a downloadable certificate. Stay consistent – the platform saves your
              progress every time you mark a lesson complete.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="pill-primary" className="gap-2" onClick={handleStartLearning}>
                {isGuest ? "Sign in to start" : "Continue from current lesson"}
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={isGuest ? "/auth?redirect=%2Fdashboard" : "/dashboard"}>View dashboard</Link>
              </Button>
            </div>
          </section>
        </FadeIn>
      </main>
    </div>
  );
};

export default CourseDetail;
