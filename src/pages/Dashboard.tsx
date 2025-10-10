import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Loader2, PlayCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { COURSES } from "@/data/courses";
import { calculateMetrics, loadProgress, resetProgress, type UserProgress } from "@/lib/progress";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { evaluateAchievements, getAchievementTotals } from "@/lib/achievements";
import { AchievementGrid } from "@/components/dashboard/AchievementGrid";
import { LearningRoadmap, type RoadmapItem } from "@/components/dashboard/LearningRoadmap";
import { CertificateShareCard } from "@/components/dashboard/CertificateShareCard";
import { OnboardingCoach } from "@/components/dashboard/OnboardingCoach";
import { trackEvent } from "@/lib/analytics";
import SiteGuide from "@/components/SiteGuide";
import { CommunityPulseCard } from "@/components/dashboard/CommunityPulseCard";
import { CommunityRecommendations } from "@/components/dashboard/CommunityRecommendations";
import { CommunityUpdates } from "@/components/dashboard/CommunityUpdates";
import { COMMUNITY_FEED_FALLBACK, useCommunityFeed } from "@/hooks/use-community-feed";
import type { CommunityFeed } from "@/hooks/use-community-feed";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";
import { SITE_NAME, SITE_URL } from "@/config/site";

type ContinueCourse = {
  id: string;
  title: string;
  level: string;
  progress: number;
  nextLessonTitle: string;
  slug: string;
};

const resolvePrimaryCourse = (courses: ContinueCourse[]) => {
  const activeCourses = courses.filter((course) => course.progress > 0 && course.progress < 100);
  if (activeCourses.length > 0) {
    return activeCourses.sort((a, b) => b.progress - a.progress)[0];
  }
  return courses[0] ?? null;
};

const formatEventDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-KE", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    console.warn("Failed to format event date", error);
    return "Soon";
  }
};

const buildRoadmapItems = (
  continueCourses: ContinueCourse[],
  totals: ReturnType<typeof getAchievementTotals>,
  showUpgradeOverlay: boolean,
  communityFeed?: Pick<CommunityFeed, "events" | "recommendations" | "updates">,
): RoadmapItem[] => {
  const primary = resolvePrimaryCourse(continueCourses);
  const base: RoadmapItem[] = [];

  if (primary) {
    base.push({
      id: `course-${primary.id}`,
      title: `Advance ${primary.title}`,
      description: `Pick up where you left off and finish the next module. Up next: ${primary.nextLessonTitle}.`,
      badge: "Current focus",
      progress: primary.progress / 100,
      status: "upcoming",
      action: {
        label: primary.progress >= 100 ? "Review course" : "Continue course",
        href: `/courses/${primary.slug}`,
        locked: showUpgradeOverlay,
      },
    });
  }

  base.push({
    id: "labs",
    title: "Complete a hands-on lab",
    description: "Labs turn theory into reflex. Aim for 5 labs to unlock advanced scenarios.",
    badge: "Skill builder",
    progress: Math.min(1, totals.labsCompleted / 5),
    status: "upcoming",
    action: {
      label: "Browse labs",
      href: primary ? `/courses/${primary.slug}` : "/courses",
      locked: showUpgradeOverlay,
    },
  });

  base.push({
    id: "quizzes",
    title: "Check your knowledge",
    description: "Short quizzes confirm you can explain key ideas clearly and confidently.",
    badge: "Confidence check",
    progress: Math.min(1, totals.quizzesCompleted / 3),
    status: "upcoming",
    action: {
      label: "Open quizzes",
      href: primary ? `/courses/${primary.slug}` : "/courses",
      locked: showUpgradeOverlay,
    },
  });

  base.push({
    id: "certificates",
    title: "Claim your certificate",
    description: "Wrap up a course to generate a shareable certificate with verification built in.",
    badge: "Recognition",
    progress: Math.min(1, totals.coursesFinished / 1),
    status: "upcoming",
    action: {
      label: "View certificates",
      href: "/verify",
      locked: false,
    },
  });

  const nextEvent = communityFeed?.events?.[0];
  if (nextEvent) {
    base.push({
      id: `event-${nextEvent.id}`,
      title: nextEvent.type === "live" ? "Join the upcoming live review" : "Enter the async study sprint",
      description: `${nextEvent.title} • ${formatEventDate(nextEvent.startsAt)}`,
      badge: "Community",
      progress: 0,
      status: "upcoming",
      action: {
        label: nextEvent.type === "live" ? "Reserve seat" : "View sprint",
        href: nextEvent.href,
        locked: false,
      },
    });
  }

  const sharePrompt = communityFeed?.recommendations?.find((rec) => rec.type === "community");
  if (sharePrompt) {
    base.push({
      id: `community-${sharePrompt.id}`,
      title: sharePrompt.label,
      description: sharePrompt.description,
      badge: "Accountability",
      progress: 0,
      status: "upcoming",
      action: {
        label: sharePrompt.ctaLabel,
        href: sharePrompt.href,
        locked: false,
      },
    });
  }

  const recentWin = communityFeed?.updates?.[0];
  if (recentWin) {
    base.push({
      id: `shoutout-${recentWin.id}`,
      title: `Congratulate ${recentWin.learner.split(" ")[0]}`,
      description: `${recentWin.highlight} • ${recentWin.message}`,
      badge: "Peer boost",
      progress: 0,
      status: "upcoming",
      action: {
        label: "Send kudos",
        href: "https://community.mikenet.academy/feed",
        locked: false,
      },
    });
  }

  const streakMetric = communityFeed?.pulse?.metrics?.find((metric) => metric.label.toLowerCase().includes("streak"));
  if (streakMetric) {
    base.push({
      id: "streak",
      title: "Protect your learning streak",
      description: `Log a lesson in the next 24 hours to stay ahead of the ${streakMetric.value} community average.`,
      badge: "Streak",
      progress: 0,
      status: "upcoming",
      action: {
        label: primary ? "Resume course" : "Browse lessons",
        href: primary ? `/courses/${primary.slug}` : "/courses",
        locked: showUpgradeOverlay,
      },
    });
  }

  let activated = false;
  return base.map((item) => {
    const complete = item.progress >= 1;
    let status: RoadmapItem["status"] = "upcoming";
    if (complete) {
      status = "complete";
    } else if (!activated) {
      status = "active";
      activated = true;
    }

    return {
      ...item,
      status,
    };
  });
};

const ProgressRing = ({ value }: { value: number }) => {
  const normalized = Math.min(100, Math.max(0, value));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20">
      <circle
        className="text-white/10"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      <motion.circle
        stroke="url(#progressGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        style={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <text x="50" y="55" textAnchor="middle" className="text-base font-semibold fill-foreground">
        {normalized}%
      </text>
    </svg>
  );
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
  const [progressLoading, setProgressLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const { data: communityFeedData } = useCommunityFeed();
  const metrics = useMemo(() => calculateMetrics(progress), [progress]);
  const continueLearning = useMemo(() => deriveContinueList(progress), [progress]);
  const achievementTotals = useMemo(() => getAchievementTotals(progress), [progress]);
  const achievements = useMemo(() => evaluateAchievements(progress), [progress]);
  const nextMilestone = useMemo(() => achievements.find((achievement) => !achievement.unlocked), [achievements]);
  const nextMilestoneRemaining = nextMilestone ? Math.max(0, nextMilestone.requirement - nextMilestone.current) : 0;
  useDocumentMetadata(
    useMemo(
      () => ({
        title: `Dashboard | ${SITE_NAME}`,
        description: "Track your progress, streaks, and community momentum across Mike Net Academy.",
        canonical: `${SITE_URL}/dashboard`,
        openGraph: {
          title: `Dashboard | ${SITE_NAME}`,
          description: "Monitor your learning streaks, achievements, and upcoming live events.",
          type: "website",
          url: `${SITE_URL}/dashboard`,
          image: `${SITE_URL}/images/mike-net-logo.png`,
        },
        twitter: {
          title: `Dashboard | ${SITE_NAME}`,
          description: "Monitor your learning streaks, achievements, and upcoming live events.",
          image: `${SITE_URL}/images/mike-net-logo.png`,
          card: "summary_large_image",
        },
        structuredData: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Dashboard",
              item: `${SITE_URL}/dashboard`,
            },
          ],
        },
      }),
      [],
    ),
  );
  const stats = useMemo(
    () => [
      {
        label: "Courses Enrolled",
        value: metrics.coursesEnrolled,
        icon: BookOpen,
        helper: "Active tracks",
      },
      {
        label: "Videos Watched",
        value: metrics.videosWatched,
        icon: PlayCircle,
        helper: "Lifetime lessons",
      },
      {
        label: "Certificates",
        value: metrics.certificatesEarned,
        icon: Award,
        helper: "Issued so far",
      },
      {
        label: "Progress",
        value: metrics.progressPercentage,
        icon: TrendingUp,
        isProgress: true,
        helper: "Overall completion",
      },
    ],
    [metrics],
  );
  const hasSubscriptionAccess = hasActiveSubscription || isTrialActive;
  const showUpgradeOverlay = !subscriptionLoading && !hasSubscriptionAccess;
  const trialCountdown = useMemo(() => formatCountdown(durationMs), [durationMs]);
  const communityFeed = communityFeedData ?? COMMUNITY_FEED_FALLBACK;
  const roadmapItems = useMemo(
    () => buildRoadmapItems(continueLearning, achievementTotals, showUpgradeOverlay, communityFeed),
    [achievementTotals, communityFeed, continueLearning, showUpgradeOverlay],
  );

  useEffect(() => {
    setProgressLoading(true);
    const next = loadProgress(user?.id);
    setProgress(next);
    setProgressLoading(false);
  }, [user?.id]);

  useEffect(() => {
    const syncProgress = () => {
      const next = loadProgress(user?.id);
      setProgress(next);
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
      trackEvent("dashboard_sign_out", { userId: user?.id ?? "guest" });
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
    trackEvent("dashboard_reset_progress", { userId: user?.id ?? "guest" });
    toast.success("Progress reset", { description: "All lessons are now marked as not started." });
  };

  const handleLockedNavigation = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    trackEvent("dashboard_locked_resource", { userId: user?.id ?? "guest" });
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

      <main id="main-content" role="main" className="container mx-auto px-4 py-16">
        <div className="mb-12 motion-safe:animate-fade-up">
          <h1 className="mb-4 text-4xl font-semibold text-foreground">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        <FadeIn>
          <div
            className={`glass-panel mb-10 rounded-2xl border p-6 ${
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
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Premium plan active</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Enjoy unlimited access to every course, lab, and certification.</p>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                  All access
                </div>
              </div>
            ) : isTrialActive ? (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">20-day trial in progress</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {trialCountdown ? `Time remaining: ${trialCountdown}` : "Your access counter updates every second."}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
                  <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse" />
                  Active trial
                </div>
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
        </FadeIn>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={0.06 * index}>
                <Card className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-6 shadow-lg">
                  <CardHeader className="flex items-center justify-between space-y-0 p-0">
                    <CardTitle className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <div className="rounded-full bg-primary/15 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                <CardContent className="mt-6 flex items-center justify-between gap-4 p-0">
                  <div>
                    <div className="text-3xl font-semibold text-foreground">
                      {stat.isProgress ? `${stat.value}%` : stat.value}
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.helper}</p>
                  </div>
                  {stat.isProgress ? (
                    <ProgressRing value={typeof stat.value === "number" ? stat.value : parseFloat(String(stat.value))} />
                  ) : null}
                    <motion.span
                      className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 * index }}
                    />
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <div className="mb-12 grid gap-6 lg:grid-cols-[2fr,1.2fr]">
            <CommunityPulseCard pulse={communityFeed.pulse} />
            <CommunityRecommendations
              recommendations={communityFeed.recommendations}
              events={communityFeed.events}
              showUpgradeOverlay={showUpgradeOverlay}
              onLockedRequest={openUpgradeDialog}
            />
          </div>
        </FadeIn>

        <FadeIn>
          <section className="mb-16 space-y-6" id="achievements">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Achievements</p>
                <h2 className="text-2xl font-semibold text-foreground">Milestones unlocked so far</h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Keep climbing. Each milestone unlocks guidance tailored to how you love to learn.
              </p>
            </div>
            {nextMilestone ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Next milestone</p>
                <p className="mt-1 text-sm text-foreground">
                  Unlock <span className="font-semibold">{nextMilestone.title}</span> by completing {nextMilestoneRemaining} more step
                  {nextMilestoneRemaining === 1 ? "" : "s"}. {nextMilestone.description}
                </p>
              </div>
            ) : null}
            <AchievementGrid achievements={achievements} />
          </section>
        </FadeIn>

        <FadeIn>
          <CommunityUpdates updates={communityFeed.updates} />
        </FadeIn>

        <FadeIn>
          <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 shadow-xl">
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
            <CardContent className="space-y-6 p-6" id="continue">
              {progressLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((item) => (
                    <Skeleton key={`progress-skeleton-${item}`} className="h-28 w-full rounded-2xl bg-white/5" />
                  ))}
                </div>
              ) : continueLearning.length > 0 ? (
                continueLearning.map((course, index) => (
                  <motion.div
                    key={course.id}
                    className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 p-5"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.level} • Next: {course.nextLessonTitle}
                        </p>
                      </div>
                      <Link
                        to={showUpgradeOverlay ? "#upgrade" : `/courses/${course.slug}`}
                        onClick={showUpgradeOverlay ? handleLockedNavigation : () => trackEvent("dashboard_continue_course", { courseId: course.id })}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-sm ease-emphasized ${
                          showUpgradeOverlay
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "bg-white/5 text-primary hover:bg-white/10"
                        }`}
                      >
                        {showUpgradeOverlay ? "Unlock course" : "Continue"}
                      </Link>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${course.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-muted-foreground">
                  No active courses yet. Explore the curriculum to start your journey.
                </div>
              )}
            </CardContent>
            {showUpgradeOverlay ? (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/30 via-background/80 to-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-white/20 bg-background/80 px-6 py-2 text-sm font-medium text-foreground shadow-lg">
                    Upgrade to unlock premium modules
                  </div>
                </div>
              </motion.div>
            ) : null}
          </Card>
        </FadeIn>

        <FadeIn>
          <div id="roadmap">
            <LearningRoadmap items={roadmapItems} onLockedRequest={openUpgradeDialog} />
          </div>
        </FadeIn>

        <FadeIn>
          <div id="certificates">
            <CertificateShareCard />
          </div>
        </FadeIn>
      </main>

      <SiteGuide context="dashboard" />
      <OnboardingCoach />
    </div>
  );
};

export default Dashboard;
