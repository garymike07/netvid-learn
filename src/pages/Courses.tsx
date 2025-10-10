import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Curriculum from "@/components/Curriculum";
import Footer from "@/components/Footer";
import SiteGuide from "@/components/SiteGuide";
import { COURSES, type Course, type DurationRange } from "@/data/courses";
import { FALLBACK_TRACKS, type FeaturedTrack } from "@/data/tracks";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { createEmptyProgress, loadProgress, type UserProgress } from "@/lib/progress";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useFeaturedTracks } from "@/hooks/use-featured-tracks";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";

type CourseCard = {
  course: Course;
  completion: number;
  totalLessons: number;
  completedLessons: number;
  hasProgress: boolean;
  ctaLabel: string;
  ctaTarget: string;
  ctaMode: "link" | "upgrade" | "disabled";
  locked: boolean;
  pendingAccess: boolean;
};

const unique = (values: string[]) => Array.from(new Set(values));

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatch = (text: string, query: string) => {
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="rounded bg-primary/20 px-1 text-foreground">
        {part}
      </mark>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );
};

const formatDurationRange = (range: DurationRange) =>
  range.min === range.max ? `${range.min} weeks` : `${range.min}-${range.max} weeks`;

const Courses = () => {
  const { user } = useAuth();
  const { hasActiveSubscription, isTrialActive, loading: subscriptionLoading, openUpgradeDialog } = useSubscription();
  const hasSubscriptionAccess = hasActiveSubscription || isTrialActive;
  const subscriptionPending = subscriptionLoading && Boolean(user);

  const [progress, setProgress] = useState<UserProgress>(() =>
    typeof window === "undefined" ? createEmptyProgress() : loadProgress(user?.id),
  );
  const [progressLoading, setProgressLoading] = useState(true);

  const structuredCourseList = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: COURSES.slice(0, 10).map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/courses/${course.slug}`,
        name: course.title,
      })),
    }),
    [],
  );

  useDocumentMetadata(
    useMemo(
      () => ({
        title: `Browse courses | ${SITE_NAME}`,
        description:
          "Explore hands-on networking, automation, and cybersecurity tracks designed with Kenyan telcos and service providers in mind.",
        canonical: `${SITE_URL}/courses`,
        openGraph: {
          title: `Browse courses | ${SITE_NAME}`,
          description:
            "Explore hands-on networking, automation, and cybersecurity tracks designed with Kenyan telcos and service providers in mind.",
          type: "website",
          url: `${SITE_URL}/courses`,
          image: `${SITE_URL}/images/mike-net-logo.png`,
        },
        twitter: {
          title: `Browse courses | ${SITE_NAME}`,
          description:
            "Explore hands-on networking, automation, and cybersecurity tracks tailored for African telco teams.",
          image: `${SITE_URL}/images/mike-net-logo.png`,
          card: "summary_large_image",
        },
        structuredData: structuredCourseList,
      }),
      [structuredCourseList],
    ),
  );

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

  const allLevels = useMemo(() => unique(COURSES.map((course) => course.level)), []);
  const overallDuration = useMemo(() => {
    const mins = COURSES.map((course) => course.durationWeeks.min);
    const maxs = COURSES.map((course) => course.durationWeeks.max);
    return {
      min: Math.min(...mins),
      max: Math.max(...maxs),
    };
  }, []);

  const allTags = useMemo(
    () => unique(COURSES.flatMap((course) => course.tags)).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const [selectedLevels, setSelectedLevels] = useState<string[]>(allLevels);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState<[number, number]>(() => [overallDuration.min, overallDuration.max]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleLevel = useCallback((level: string) => {
    setSelectedLevels((previous) =>
      previous.includes(level) ? previous.filter((item) => item !== level) : [...previous, level],
    );
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((item) => item !== tag) : [...previous, tag],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLevels(allLevels);
    setSelectedTags([]);
    setDurationRange([overallDuration.min, overallDuration.max]);
  }, [allLevels, overallDuration.max, overallDuration.min]);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      if (!selectedLevels.includes(course.level)) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => course.tags.map((value) => value.toLowerCase()).includes(tag.toLowerCase()))
      ) {
        return false;
      }

      const overlapsDuration =
        course.durationWeeks.max >= durationRange[0] && course.durationWeeks.min <= durationRange[1];
      if (!overlapsDuration) return false;

      if (debouncedSearch) {
        const haystack = [
          course.title,
          course.summary,
          course.description,
          course.focusAreas.join(" "),
          course.tags.join(" "),
          Object.values(course.localizedSummaries).join(" "),
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(debouncedSearch)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedLevels, selectedTags, durationRange, debouncedSearch]);

  const courseCards = useMemo<CourseCard[]>(() => {
    return filteredCourses.map((course) => {
      const requiresPremium = course.isPremium;
      const locked = Boolean(user && requiresPremium && !subscriptionPending && !hasSubscriptionAccess);
      const pendingAccess = Boolean(user && requiresPremium && subscriptionPending && !hasSubscriptionAccess);
      const totalLessons = course.stats.totalLessons;
      const courseProgress = progress.courses[course.id];
      const completedSet = new Set(courseProgress?.completedLessons ?? []);
      const completedLessons = completedSet.size;
      const completion = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
      const hasProgress = completedLessons > 0;
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
        completion,
        totalLessons,
        completedLessons,
        hasProgress,
        ctaLabel,
        ctaTarget,
        ctaMode,
        locked,
        pendingAccess,
      };
    });
  }, [filteredCourses, user, subscriptionPending, hasSubscriptionAccess, progress]);

  const showSkeleton = progressLoading || subscriptionPending;

  const { data: featuredTracksData = FALLBACK_TRACKS, isLoading: tracksLoading } = useFeaturedTracks();

  const featuredTracks = useMemo(
    () => featuredTracksData.filter((track) => track.courseIds.some((courseId) => COURSES.some((c) => c.id === courseId))),
    [featuredTracksData],
  );

  const computeTrackMetrics = useCallback(
    (track: FeaturedTrack) => {
      const trackCourses = track.courseIds
        .map((courseId) => COURSES.find((course) => course.id === courseId))
        .filter((course): course is Course => Boolean(course));

      let totalLessons = 0;
      let completedLessons = 0;

      trackCourses.forEach((course) => {
        totalLessons += course.stats.totalLessons;
        const entry = progress.courses[course.id];
        const completed = entry ? new Set(entry.completedLessons).size : 0;
        completedLessons += completed;
      });

      const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
      const completedCourses = trackCourses.filter((course) => {
        const entry = progress.courses[course.id];
        const completed = entry ? new Set(entry.completedLessons).size : 0;
        return completed >= course.stats.totalLessons && course.stats.totalLessons > 0;
      }).length;
      const requiresUpgrade = !hasSubscriptionAccess && trackCourses.some((course) => course.isPremium);

      return {
        percent,
        totalLessons,
        completedLessons,
        completedCourses,
        requiresUpgrade,
        trackCourses,
      };
    },
    [progress, hasSubscriptionAccess],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count += 1;
    if (selectedTags.length > 0) count += 1;
    if (selectedLevels.length !== allLevels.length) count += 1;
    if (durationRange[0] !== overallDuration.min || durationRange[1] !== overallDuration.max) count += 1;
    return count;
  }, [debouncedSearch, selectedTags.length, selectedLevels.length, allLevels.length, durationRange, overallDuration.max, overallDuration.min]);

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

      <main id="main-content" className="flex-1" role="main">
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, hsla(278,97%,72%,0.2), transparent 60%)" }} />
          <div className="container relative mx-auto px-4 text-center motion-safe:animate-fade-up">
            <h1 className="mb-6 text-4xl font-semibold text-foreground md:text-5xl">
              Complete Network Engineering Curriculum
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Discover structured learning journeys with fresh labs, challenges, and certifications engineered for modern
              network teams.
            </p>
          </div>
        </section>

        {featuredTracks.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Curated journeys</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">Featured mentor-built tracks</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Combine related courses, keep momentum with progress tracking, and unlock role-aligned outcomes.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Updated weekly
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {tracksLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <Card key={`track-skeleton-${index}`} className="h-full rounded-3xl border border-white/10 bg-card/60 p-6">
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-24 rounded-full bg-white/5" />
                          <Skeleton className="h-7 w-3/4 rounded bg-white/5" />
                          <Skeleton className="h-20 w-full rounded-2xl bg-white/5" />
                          <Skeleton className="h-2 w-full rounded-full bg-white/5" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
                            <Skeleton className="h-6 w-24 rounded-full bg-white/5" />
                          </div>
                        </div>
                      </Card>
                    ))
                  : featuredTracks.map((track) => {
                      const { percent, totalLessons, completedLessons, completedCourses, requiresUpgrade, trackCourses } =
                        computeTrackMetrics(track);
                      const firstCourse = trackCourses[0];

                      return (
                        <Card
                          key={track.id}
                          className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-6"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition duration-500 group-hover:opacity-80" />
                          <div className="relative flex h-full flex-col justify-between gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="rounded-full border-white/20 bg-white/10 text-xs uppercase">
                                  {track.difficulty}
                                </Badge>
                                {requiresUpgrade ? (
                                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-destructive">
                                    Upgrade for full access
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    {track.estimatedWeeks} week journey
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold text-foreground">{track.title}</h3>
                              <p className="text-sm text-muted-foreground">{track.description}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="rounded-full bg-white/5 px-3 py-1">{track.focus}</span>
                                <span className="rounded-full bg-white/5 px-3 py-1">{completedCourses}/{trackCourses.length} courses</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Progress value={percent} className="h-2" />
                                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{percent}% complete</span>
                                  <span>
                                    {completedLessons}/{totalLessons} lessons
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                {trackCourses.map((course) => (
                                  <span key={course.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                    {course.title}
                                  </span>
                                ))}
                              </div>
                              <Button asChild variant="secondary" className="w-full">
                                <Link to={firstCourse ? `/courses/${firstCourse.slug}` : "/courses"}>
                                  View track outline
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur">
              <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <div>
                  <label htmlFor="course-search" className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Search catalogue
                  </label>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="course-search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search courses, tags, or skills"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="ghost" onClick={resetFilters} className="border border-white/10 bg-white/5">
                    Reset filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Difficulty</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allLevels.map((level) => {
                      const active = selectedLevels.includes(level);
                      return (
                        <Button
                          key={level}
                          type="button"
                          variant={active ? "pill-primary" : "outline"}
                          size="sm"
                          className={cn(
                            "rounded-full",
                            active ? "" : "border-white/15 bg-white/5 text-muted-foreground hover:text-primary",
                          )}
                          onClick={() => toggleLevel(level)}
                        >
                          {level}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Estimated duration (weeks)</p>
                  <div className="mt-4">
                    <Slider
                      value={durationRange}
                      min={overallDuration.min}
                      max={overallDuration.max}
                      step={1}
                      onValueChange={(value) => {
                        if (Array.isArray(value) && value.length === 2) {
                          setDurationRange([value[0], value[1]]);
                        }
                      }}
                      aria-label="Duration range"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{durationRange[0]} weeks</span>
                      <span>{durationRange[1]} weeks</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Focus tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-white/15 bg-white/5 text-muted-foreground hover:border-primary hover:text-primary",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Course Library</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {courseCards.length} {courseCards.length === 1 ? "course matches" : "courses match"} your filters
                </p>
              </div>
            </div>

            {showSkeleton ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="flex h-full flex-col p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-40 rounded-full bg-white/5" />
                      <Skeleton className="h-4 w-28 rounded-full bg-white/5" />
                      <Skeleton className="h-20 w-full rounded-2xl bg-white/5" />
                      <Skeleton className="h-10 w-full rounded-full bg-white/5" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : courseCards.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-card/60 p-10 text-center">
                <h3 className="text-2xl font-semibold text-foreground">No courses found</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Try clearing a few filters or explore the featured tracks above.
                </p>
                <Button className="mt-6" variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {courseCards.map(
                  (
                    {
                      course,
                      completion,
                      totalLessons,
                      completedLessons,
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
                      className="flex h-full flex-col gap-6 p-6 motion-safe:animate-fade-up"
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <CardHeader className="space-y-4 p-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-xl text-foreground">
                              {highlightMatch(course.title, debouncedSearch)}
                            </CardTitle>
                            <CardDescription className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider">
                              <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">{course.level}</span>
                              <span className="rounded-full bg-white/5 px-3 py-1 text-muted-foreground">
                                {formatDurationRange(course.durationWeeks)}
                              </span>
                              {course.categories.map((category) => (
                                <span key={category} className="rounded-full bg-white/5 px-3 py-1 text-muted-foreground">
                                  {category}
                                </span>
                              ))}
                            </CardDescription>
                          </div>
                          {course.isPremium && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                              <Lock className="h-3 w-3" /> Premium
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col justify-between space-y-6 p-0">
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p>{highlightMatch(course.summary, debouncedSearch)}</p>
                          <div className="text-xs italic text-muted-foreground/80">
                            {course.localizedSummaries.sw}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {course.focusAreas.map((focus) => (
                              <span key={focus} className="rounded-full bg-white/5 px-3 py-1">
                                {highlightMatch(focus, debouncedSearch)}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>{course.stats.videoCount} videos</span>
                            <span>{course.stats.labCount} labs</span>
                            <span>{course.stats.quizCount} quizzes</span>
                            <span>{course.stats.readingCount} readings</span>
                          </div>
                          {user ? (
                            <p className="text-xs font-medium text-muted-foreground">
                              {hasProgress
                                ? `${completion}% complete • ${completedLessons}/${totalLessons} lessons`
                                : `Not started • ${totalLessons} lessons`}
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
            )}
          </div>
        </section>

        <Curriculum />

        <section className="relative py-24">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 10% 20%, hsla(215,91%,65%,0.22), transparent 60%)" }} />
          <div className="container relative mx-auto px-4 text-center motion-safe:animate-fade-up">
            <h2 className="mb-6 text-3xl font-semibold text-foreground">Ready to Start Learning?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Sign up now and unlock guided labs, certifications, and real-time progress coaching from the dashboard.
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
      <SiteGuide context="courses" />
    </div>
  );
};

export default Courses;
