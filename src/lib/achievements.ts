import { COURSES } from "@/data/courses";
import type { UserProgress } from "@/lib/progress";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  current: number;
  requirement: number;
};

export type AchievementTotals = {
  lessonsCompleted: number;
  videosCompleted: number;
  labsCompleted: number;
  quizzesCompleted: number;
  readingsCompleted: number;
  coursesFinished: number;
  coursesInProgress: number;
};

const calculateTotals = (progress: UserProgress): AchievementTotals => {
  let lessonsCompleted = 0;
  let videosCompleted = 0;
  let labsCompleted = 0;
  let quizzesCompleted = 0;
  let readingsCompleted = 0;
  let coursesFinished = 0;
  let coursesInProgress = 0;

  for (const course of COURSES) {
    const lessonList = course.modules.flatMap((module) => module.lessons);
    const courseProgress = progress.courses[course.id];
    const completedSet = new Set(courseProgress?.completedLessons ?? []);

    if (completedSet.size > 0) {
      coursesInProgress += 1;
    }

    const courseCompleted = lessonList.length > 0 && lessonList.every((lesson) => completedSet.has(lesson.id));
    if (courseCompleted) {
      coursesFinished += 1;
    }

    for (const lesson of lessonList) {
      if (!completedSet.has(lesson.id)) continue;
      lessonsCompleted += 1;
      switch (lesson.type) {
        case "video":
          videosCompleted += 1;
          break;
        case "lab":
          labsCompleted += 1;
          break;
        case "quiz":
          quizzesCompleted += 1;
          break;
        case "reading":
          readingsCompleted += 1;
          break;
        default:
          break;
      }
    }
  }

  return {
    lessonsCompleted,
    videosCompleted,
    labsCompleted,
    quizzesCompleted,
    readingsCompleted,
    coursesFinished,
    coursesInProgress,
  };
};

export const getAchievementTotals = (progress: UserProgress): AchievementTotals => calculateTotals(progress);

const clampProgress = (value: number, requirement: number) => {
  if (requirement <= 0) return 1;
  return Math.max(0, Math.min(1, value / requirement));
};

export const evaluateAchievements = (progress: UserProgress): Achievement[] => {
  const totals = calculateTotals(progress);
  const now = Date.now();
  const lastUpdated = Number.isNaN(Date.parse(progress.lastUpdated)) ? now : new Date(progress.lastUpdated).getTime();
  const daysSinceUpdate = Math.max(0, Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24)));

  const definitions: Array<Omit<Achievement, "unlocked" | "progress" | "current"> & { metric: number }> = [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first lesson.",
      icon: "Flag",
      requirement: 1,
      metric: totals.lessonsCompleted,
    },
    {
      id: "video-sprinter",
      title: "Video Sprinter",
      description: "Finish 5 video lessons.",
      icon: "Video",
      requirement: 5,
      metric: totals.videosCompleted,
    },
    {
      id: "lab-specialist",
      title: "Lab Specialist",
      description: "Complete 3 hands-on labs.",
      icon: "FlaskConical",
      requirement: 3,
      metric: totals.labsCompleted,
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Ace 3 knowledge checks.",
      icon: "ListChecks",
      requirement: 3,
      metric: totals.quizzesCompleted,
    },
    {
      id: "course-hunter",
      title: "Course Hunter",
      description: "Start 2 different courses.",
      icon: "Compass",
      requirement: 2,
      metric: totals.coursesInProgress,
    },
    {
      id: "completionist",
      title: "Completionist",
      description: "Finish an entire course.",
      icon: "Trophy",
      requirement: 1,
      metric: totals.coursesFinished,
    },
    {
      id: "momentum-keeper",
      title: "Momentum Keeper",
      description: "Return within 3 days to keep your streak alive.",
      icon: "Flame",
      requirement: 3,
      metric: Math.max(0, 3 - daysSinceUpdate),
    },
    {
      id: "knowledge-diver",
      title: "Knowledge Diver",
      description: "Explore 6 reading or reference lessons.",
      icon: "BookOpen",
      requirement: 6,
      metric: totals.readingsCompleted,
    },
    {
      id: "marathon-learner",
      title: "Marathon Learner",
      description: "Complete 20 total lessons across the academy.",
      icon: "Sparkles",
      requirement: 20,
      metric: totals.lessonsCompleted,
    },
  ];

  return definitions.map((definition) => {
    const progressValue = clampProgress(definition.metric, definition.requirement);
    return {
      ...definition,
      current: definition.metric,
      unlocked: progressValue >= 1,
      progress: progressValue,
    } satisfies Achievement;
  });
};
