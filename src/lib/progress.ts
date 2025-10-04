import { COURSES, type Course } from "@/data/courses";

const STORAGE_PREFIX = "na-progress";

export type CourseProgress = {
  courseId: string;
  completedLessons: string[];
  lastLessonId?: string;
};

export type UserProgress = {
  courses: Record<string, CourseProgress>;
  lastUpdated: string;
};

const buildEmptyProgress = (courses: Course[]): UserProgress => ({
  courses: Object.fromEntries(
    courses.map((course) => [course.id, { courseId: course.id, completedLessons: [], lastLessonId: undefined }]),
  ),
  lastUpdated: new Date().toISOString(),
});

const getStorageKey = (userId?: string | null) => `${STORAGE_PREFIX}:${userId ?? "guest"}`;

export const createEmptyProgress = (courses: Course[] = COURSES) => buildEmptyProgress(courses);

export const loadProgress = (userId?: string | null, courses: Course[] = COURSES): UserProgress => {
  if (typeof window === "undefined") {
    return createEmptyProgress(courses);
  }

  try {
    const key = getStorageKey(userId);
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      const defaults = createEmptyProgress(courses);
      window.localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as UserProgress;
    const ensured: UserProgress = createEmptyProgress(courses);

    for (const course of courses) {
      const existing = parsed.courses?.[course.id];
      if (existing) {
        ensured.courses[course.id] = {
          courseId: course.id,
          completedLessons: Array.from(new Set(existing.completedLessons)),
          lastLessonId: existing.lastLessonId,
        };
      }
    }
    ensured.lastUpdated = new Date().toISOString();
    window.localStorage.setItem(key, JSON.stringify(ensured));
    return ensured;
  } catch (error) {
    console.warn("Unable to read learning progress from storage", error);
    return buildEmptyProgress(courses);
  }
};

export const saveProgress = (progress: UserProgress, userId?: string | null) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify({ ...progress, lastUpdated: new Date().toISOString() }));
  } catch (error) {
    console.warn("Unable to persist learning progress", error);
  }
};

export const resetProgress = (userId?: string | null, courses: Course[] = COURSES) => {
  const fresh = createEmptyProgress(courses);
  saveProgress(fresh, userId);
  return fresh;
};

export const updateLessonCompletion = (
  progress: UserProgress,
  courseId: string,
  lessonId: string,
  completed: boolean,
): UserProgress => {
  const courseProgress = progress.courses[courseId] ?? { courseId, completedLessons: [] };
  const completedLessons = new Set(courseProgress.completedLessons);

  if (completed) {
    completedLessons.add(lessonId);
  } else {
    completedLessons.delete(lessonId);
  }

  return {
    ...progress,
    courses: {
      ...progress.courses,
      [courseId]: {
        courseId,
        completedLessons: Array.from(completedLessons),
        lastLessonId: completed ? lessonId : courseProgress.lastLessonId === lessonId ? undefined : courseProgress.lastLessonId,
      },
    },
    lastUpdated: new Date().toISOString(),
  };
};

export const calculateMetrics = (progress: UserProgress, courses: Course[] = COURSES) => {
  let videoCount = 0;
  let totalLessons = 0;
  let completedLessons = 0;
  let certificates = 0;
  let coursesEnrolled = 0;

  for (const course of courses) {
    const courseProgress = progress.courses[course.id];
    const courseLessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
    totalLessons += courseLessonIds.length;

    if (!courseProgress) continue;

    const completedSet = new Set(courseProgress.completedLessons);
    if (completedSet.size > 0) {
      coursesEnrolled += 1;
    }
    completedLessons += courseLessonIds.filter((lessonId) => completedSet.has(lessonId)).length;

    const courseVideos = course.modules.flatMap((module) => module.lessons.filter((lesson) => lesson.type === "video"));
    videoCount += courseVideos.filter((lesson) => completedSet.has(lesson.id)).length;

    if (courseLessonIds.every((lessonId) => completedSet.has(lessonId))) {
      certificates += 1;
    }
  }

  const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return {
    coursesEnrolled,
    videosWatched: videoCount,
    certificatesEarned: certificates,
    progressPercentage,
  };
};
