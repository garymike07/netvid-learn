import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookmarkCheck,
  ClipboardList,
  Clock,
  ExternalLink,
  Film,
  Layers,
  MessageCircle,
  PlayCircle,
  Sparkles,
  Star,
  StickyNote,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getCourseBySlug, type Lesson, type Module } from "@/data/courses";
import {
  loadProgress,
  saveProgress,
  setLastLesson,
  toggleBookmark,
  updateLessonCompletion,
  type UserProgress,
} from "@/lib/progress";
import { toast } from "sonner";
import { useCertificates, type CourseCertificatePayload } from "@/contexts/CertificateContext";
import { FadeIn } from "@/components/motion";
import { useCourseReviews } from "@/hooks/use-course-reviews";
import { useLessonNotes } from "@/hooks/use-lesson-notes";
import { cn } from "@/lib/utils";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TWITTER, SITE_URL } from "@/config/site";

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

const deriveChecklistSteps = (lesson: Lesson): string[] => {
  const base: string[] = [];
  if (lesson.type === "video") {
    base.push("Watch the full lesson video without skipping key sections.");
    base.push("Pause to capture your own summary in notes.");
  } else if (lesson.type === "lab") {
    base.push("Read through the lab brief and prerequisites.");
    base.push("Complete the lab tasks and validate outputs.");
  } else if (lesson.type === "quiz") {
    base.push("Attempt every question without guessing.");
    base.push("Review explanations before moving on.");
  } else {
    base.push("Read the lesson thoroughly and flag unfamiliar terms.");
  }

  if (Array.isArray(lesson.resources) && lesson.resources.length > 0) {
    base.push("Open the linked resources for deeper context.");
  }

  base.push("Reflect on how this lesson applies to your current projects.");
  return base;
};

const getLabDifficulty = (moduleIndex: number): { label: string; className: string } => {
  if (moduleIndex === 0) {
    return { label: "Guided", className: "bg-emerald-500/10 text-emerald-300" };
  }
  if (moduleIndex === 1) {
    return { label: "Scenario", className: "bg-amber-500/10 text-amber-300" };
  }
  return { label: "Challenge", className: "bg-rose-500/10 text-rose-300" };
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive, hasActiveSubscription, loading: subscriptionLoading, durationMs, openUpgradeDialog, isExpired } = useSubscription();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(user?.id));
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, number[]>>({});
  const { ensureCertificate, downloadCertificate, getCertificateByCourse, loading: certificateLoading } = useCertificates();
  const [certificateBusy, setCertificateBusy] = useState(false);
  const isGuest = !user;

  const course = useMemo(() => (slug ? getCourseBySlug(slug) : undefined), [slug]);
  const { data: reviews = [], average: reviewAverage, total: reviewTotal, isLoading: reviewsLoading } = useCourseReviews(course?.id);
  const courseMetadata = useMemo(() => {
    const fallbackUrl = typeof window !== "undefined" ? window.location.href : `${SITE_URL}/courses`;

    if (!course) {
      return {
        title: `Course | ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
        canonical: fallbackUrl,
        openGraph: {
          title: `Course | ${SITE_NAME}`,
          description: SITE_DESCRIPTION,
          type: "website",
          url: fallbackUrl,
          image: `${SITE_URL}/images/mike-net-logo.png`,
        },
        twitter: {
          title: `Course | ${SITE_NAME}`,
          description: SITE_DESCRIPTION,
          image: `${SITE_URL}/images/mike-net-logo.png`,
          card: "summary_large_image",
        },
      };
    }

    const canonical = `${SITE_URL}/courses/${course.slug}`;
    const description = course.description ?? course.summary;
    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description,
      url: canonical,
      courseCode: course.id,
      educationalLevel: course.level,
      keywords: course.tags.join(", "),
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        sameAs: [`https://twitter.com/${SITE_TWITTER.replace(/^@/, "")}`],
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: course.isPremium ? "online paid" : "online free",
        location: {
          "@type": "VirtualLocation",
          url: canonical,
        },
      },
    };

    if (reviewTotal > 0) {
      structuredData.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: reviewAverage,
        reviewCount: reviewTotal,
      };
    }

    return {
      title: `${course.title} | ${SITE_NAME}`,
      description,
      canonical,
      openGraph: {
        title: `${course.title} | ${SITE_NAME}`,
        description,
        type: "website",
        url: canonical,
        image: `${SITE_URL}/images/mike-net-logo.png`,
      },
      twitter: {
        title: `${course.title} | ${SITE_NAME}`,
        description,
        image: `${SITE_URL}/images/mike-net-logo.png`,
        card: "summary_large_image",
      },
      structuredData,
    };
  }, [course, reviewAverage, reviewTotal]);

  useDocumentMetadata(courseMetadata);

  useEffect(() => {
    setProgress(loadProgress(user?.id));
  }, [user?.id]);

  const updateProgressState = useCallback(
    (updater: (current: UserProgress) => UserProgress) => {
      setProgress((current) => {
        const next = updater(current);
        saveProgress(next, user?.id);
        return next;
      });
    },
    [user?.id],
  );

  const setLastLessonPointer = (lessonId: string | undefined) => {
    if (!course) return;
    updateProgressState((current) => setLastLesson(current, course.id, lessonId));
  };

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

  const activeLesson = activeLessonIndex !== null ? lessonCatalog[activeLessonIndex] : null;
  const nextLessonEntry = activeLessonIndex !== null ? lessonCatalog[activeLessonIndex + 1] : undefined;
  const prevLessonEntry = activeLessonIndex !== null && activeLessonIndex > 0 ? lessonCatalog[activeLessonIndex - 1] : undefined;
  const { note, setNote: setLessonNote, clearNote } = useLessonNotes(user?.id ?? null, course?.id, activeLesson?.lesson.id);

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
  const courseProgress =
    progress.courses[course.id] ?? {
      courseId: course.id,
      completedLessons: [],
      bookmarkedLessons: [],
      lastLessonId: undefined,
    };
  const focusAreas = course.focusAreas ?? [];
  const completedSet = new Set(courseProgress.completedLessons);
  const bookmarkedLessons = courseProgress.bookmarkedLessons ?? [];
  const bookmarkedSet = new Set(bookmarkedLessons);
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

  const handleToggleBookmark = (lessonId: string) => {
    if (isGuest) {
      toast.info("Sign in to save bookmarks.");
      navigate(authRedirect);
      return;
    }
    if (subscriptionPending) {
      toast.info("Verifying your trial status. Please try again in a moment.");
      return;
    }
    if (course.isPremium && !hasSubscriptionAccess) {
      toast.info("Your trial has ended. Upgrade to keep your place.");
      openUpgradeDialog();
      return;
    }
    updateProgressState((current) => toggleBookmark(current, course.id, lessonId));
  };

  const lessonCatalogById = Object.fromEntries(lessonCatalog.map((entry) => [entry.lesson.id, entry]));
  const nextIncompleteEntry = lessonCatalog.find((entry) => !completedSet.has(entry.lesson.id));
  const lastLessonEntry = courseProgress.lastLessonId ? lessonCatalogById[courseProgress.lastLessonId] : undefined;
  const continueEntry =
    (lastLessonEntry && !completedSet.has(lastLessonEntry.lesson.id)
      ? lastLessonEntry
      : nextIncompleteEntry ?? lastLessonEntry ?? lessonCatalog[0]) ?? null;
  const continueLessonIndex = continueEntry ? lessonCatalog.findIndex((entry) => entry.lesson.id === continueEntry.lesson.id) : -1;

  const bookmarkedEntries = bookmarkedLessons
    .map((lessonId) => lessonCatalogById[lessonId])
    .filter((entry): entry is (typeof lessonCatalog)[number] => Boolean(entry));
  const moduleProgress = course.modules.map((module) => {
    const lessonIds = module.lessons.map((lesson) => lesson.id);
    const completedLessonsCount = lessonIds.filter((id) => completedSet.has(id)).length;
    return { moduleId: module.id, completed: completedLessonsCount, total: lessonIds.length };
  });

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
    updateProgressState((current) => updateLessonCompletion(current, course.id, lessonId, checked));
    if (checked) {
      setLastLessonPointer(lessonId);
    } else if (courseProgress.lastLessonId === lessonId) {
      setLastLessonPointer(undefined);
    }
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

    setLastLessonPointer(targetEntry.lesson.id);

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
      setLastLessonPointer(entry.lesson.id);
      const element = document.getElementById(entry.lesson.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      toast.info("This lesson does not have a video. Review the resources below instead.");
      return;
    }
    goToLesson(index);
  };

  const handleContinueLearning = () => {
    if (!continueEntry) {
      handleStartLearning();
      return;
    }
    openLesson(continueEntry.lesson.id);
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
  const entry = lessonCatalog[index];
  setActiveLessonIndex(index);
  setLastLessonPointer(entry.lesson.id);
  };

  const closeLesson = () => goToLesson(null);

  const handleModuleNavigate = (moduleId: string) => {
    const element = document.getElementById(moduleId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isActiveLessonComplete = activeLesson ? completedSet.has(activeLesson.lesson.id) : false;
  const checklistSteps = activeLesson ? deriveChecklistSteps(activeLesson.lesson) : [];
  const activeChecklistSet = activeLesson ? new Set(checklistState[activeLesson.lesson.id] ?? []) : new Set<number>();
  const toggleChecklistStep = (lessonId: string, stepIndex: number) => {
    setChecklistState((previous) => {
      const existing = new Set(previous[lessonId] ?? []);
      if (existing.has(stepIndex)) {
        existing.delete(stepIndex);
      } else {
        existing.add(stepIndex);
      }
      return { ...previous, [lessonId]: Array.from(existing) };
    });
  };
  const checklistCompletion = activeLesson && checklistSteps.length > 0 ? Math.round((activeChecklistSet.size / checklistSteps.length) * 100) : 0;

  return (
    <TooltipProvider>
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

      <main id="main-content" role="main" className="relative z-20 container mx-auto space-y-12 px-4 py-16">
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
                  <Separator className="my-6" />
                  <div className="grid gap-6 lg:grid-cols-[2fr,1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          Lesson checklist
                        </div>
                        {checklistSteps.length > 0 ? (
                          <span className="text-xs text-muted-foreground">{checklistCompletion}% complete</span>
                        ) : null}
                      </div>
                      {checklistSteps.length > 0 ? (
                        <div className="space-y-3">
                          {checklistSteps.map((step, index) => (
                            <label
                              key={`${activeLesson.lesson.id}-check-${index}`}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground"
                            >
                              <Checkbox
                                checked={activeChecklistSet.has(index)}
                                onCheckedChange={() => toggleChecklistStep(activeLesson.lesson.id, index)}
                                aria-label={`Toggle checklist step ${index + 1}`}
                              />
                              <span>{step}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Make note of your key takeaways as you progress.</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <StickyNote className="h-4 w-4 text-primary" />
                          Personal notes
                        </span>
                        {note ? (
                          <Button variant="ghost" size="sm" className="text-xs" onClick={clearNote}>
                            Clear
                          </Button>
                        ) : null}
                      </div>
                      <Textarea
                        value={note}
                        onChange={(event) => setLessonNote(event.target.value)}
                        placeholder="Capture commands, troubleshooting tips, or insights from this lesson."
                        rows={6}
                      />
                    </div>
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
                    loading="lazy"
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

        <section className="grid gap-8 lg:grid-cols-[3fr,1fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between motion-safe:animate-fade-up">
              <h2 className="text-2xl font-semibold text-foreground">Course modules</h2>
              <p className="text-sm text-muted-foreground">
                Track progress by marking each lesson complete after you finish watching or labbing.
              </p>
            </div>

            <div className="space-y-5">
              {course.modules.map((module, moduleIndex) => {
                const stats = getModuleStats(module);
                const lessonTypeBadges = Object.entries(stats.counts)
                  .filter(([, count]) => count > 0)
                  .map(([type, count]) => ({ type: type as Lesson["type"], count }));
                const moduleMeta = moduleProgress[moduleIndex] ?? { completed: 0, total: module.lessons.length };
                return (
                  <FadeIn key={module.id} delay={0.05 * moduleIndex}>
                    <Card id={module.id} className="glass-panel border-none p-6">
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
                          <div className="text-right text-xs text-muted-foreground">
                            <Badge variant="outline" className="border-white/15 bg-white/5 text-muted-foreground">
                              {module.lessons.length} lessons
                            </Badge>
                            <p className="mt-1">
                              {moduleMeta.completed}/{moduleMeta.total} complete
                            </p>
                          </div>
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
                          const labBadge = lesson.type === "lab" ? getLabDifficulty(moduleIndex) : null;
                          return (
                            <div
                              id={lesson.id}
                              key={lesson.id}
                              className="glass-panel flex flex-col gap-4 rounded-2xl border-none p-4 transition hover:shadow-[0_24px_60px_-30px_hsla(217,91%,65%,0.55)]"
                            >
                              <div className="flex flex-1 items-start gap-4">
                                <Checkbox
                                  checked={completed}
                                  disabled={interactionsDisabled}
                                  onCheckedChange={(checked) => handleToggleLesson(lesson.id, Boolean(checked))}
                                  aria-label={`Mark ${lesson.title} ${completed ? "incomplete" : "complete"}`}
                                />
                                <div className="w-full space-y-2">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-1">
                                      <p className="text-base font-semibold text-foreground">{lesson.title}</p>
                                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                    </div>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-primary"
                                          onClick={() => handleToggleBookmark(lesson.id)}
                                          disabled={interactionsDisabled}
                                        >
                                          {bookmarkedSet.has(lesson.id) ? (
                                            <BookmarkCheck className="h-4 w-4 text-primary" />
                                          ) : (
                                            <Bookmark className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>{bookmarkedSet.has(lesson.id) ? "Remove bookmark" : "Bookmark lesson"}</TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                      <Clock className="h-3 w-3" /> {lesson.duration}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize">
                                      <Layers className="h-3 w-3" /> {lesson.type}
                                    </span>
                                    {labBadge ? (
                                      <span
                                        className={cn(
                                          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
                                          labBadge.className,
                                        )}
                                      >
                                        <Sparkles className="h-3 w-3" /> {labBadge.label} lab
                                      </span>
                                    ) : null}
                                  </div>
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
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
                                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                                    <Button
                                      variant={lesson.videoUrl ? "outline" : "ghost"}
                                      className="w-full sm:w-auto"
                                      disabled={interactionsDisabled}
                                      onClick={() => openLesson(lesson.id)}
                                    >
                                      {lesson.videoUrl ? (completed ? "Revisit lesson" : "Watch lesson") : "Review resources"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <Card className="glass-panel border-none p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Continue learning</p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {continueEntry ? continueEntry.lesson.title : "Start your first lesson"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {continueEntry ? continueEntry.moduleTitle : "We’ll keep your place once you begin."}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Button
                onClick={handleContinueLearning}
                variant="pill-primary"
                className="mt-4 w-full gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {continueEntry ? (completedSet.has(continueEntry.lesson.id) ? "Review lesson" : "Resume lesson") : "Start learning"}
              </Button>
            </Card>

            {bookmarkedEntries.length > 0 ? (
              <Card className="glass-panel border-none p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Bookmarked lessons</span>
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-muted-foreground">
                    {bookmarkedEntries.length}
                  </Badge>
                </div>
                <div className="mt-3 space-y-3">
                  {bookmarkedEntries.map((entry) => (
                    <button
                      key={entry.lesson.id}
                      type="button"
                      onClick={() => openLesson(entry.lesson.id)}
                      className="group w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <p className="font-semibold text-foreground group-hover:text-primary">{entry.lesson.title}</p>
                      <p className="text-xs">{entry.moduleTitle}</p>
                    </button>
                  ))}
                </div>
              </Card>
            ) : null}

            <Card className="glass-panel border-none p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Module outline</span>
                <span className="text-xs text-muted-foreground">Tap to jump</span>
              </div>
              <div className="mt-3 space-y-3">
                {course.modules.map((module, moduleIndex) => {
                  const meta = moduleProgress[moduleIndex] ?? { completed: 0, total: module.lessons.length };
                  const percent = meta.total === 0 ? 0 : Math.round((meta.completed / meta.total) * 100);
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => handleModuleNavigate(module.id)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-foreground">{module.title}</span>
                        <span className="text-xs">{percent}%</span>
                      </div>
                      <Progress value={percent} className="mt-2 h-1.5" />
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="glass-panel border-none p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> Course snapshot
              </div>
              <p className="text-xs text-muted-foreground">
                {course.stats.totalLessons} total lessons • {course.stats.labCount} labs • {course.stats.quizCount} quizzes
              </p>
              <p className="text-xs text-muted-foreground">
                {course.stats.videoCount} video sessions • {course.stats.readingCount} deep dives
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {focusAreas.map((focus) => (
                  <span key={focus} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    {focus}
                  </span>
                ))}
              </div>
            </Card>
          </aside>
        </section>

        <FadeIn>
          <section className="glass-panel rounded-2xl border-none p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Learner reviews</h2>
                <p className="text-sm text-muted-foreground">Experiences from professionals who completed this course.</p>
              </div>
              {reviewTotal > 0 ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 text-primary" /> {reviewAverage.toFixed(1)} · {reviewTotal} review{reviewTotal === 1 ? "" : "s"}
                </div>
              ) : null}
            </div>
            {reviewsLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((index) => (
                  <div key={`review-skeleton-${index}`} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full rounded bg-white/10" />
                      <div className="h-3 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-2/3 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => {
                  const date = new Date(review.createdAt);
                  const formattedDate = date.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
                  return (
                    <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{review.author}</p>
                          <p className="text-xs text-muted-foreground">{review.role}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <Star className="h-4 w-4" /> {review.rating}
                        </div>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-foreground">{review.headline}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> Verified graduate
                        </span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-muted-foreground">
                First to take this advanced module? Share your experience after completing the labs to help other learners.
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn>
          <section className="glass-panel rounded-2xl border-none p-6">
            <h2 className="text-xl font-semibold text-foreground">Next steps</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete all lessons and labs to unlock a downloadable certificate. Stay consistent – the platform saves your
              progress every time you mark a lesson complete.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="pill-primary"
                className="gap-2"
                onClick={() => (isGuest ? handleStartLearning() : handleContinueLearning())}
              >
                {isGuest ? "Sign in to start" : "Resume learning"}
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={isGuest ? "/auth?redirect=%2Fdashboard" : "/dashboard"}>View dashboard</Link>
              </Button>
            </div>
          </section>
        </FadeIn>
      </main>
      </div>
    </TooltipProvider>
  );
};

export default CourseDetail;
