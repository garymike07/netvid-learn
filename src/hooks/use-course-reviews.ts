import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CourseReview = {
  id: string;
  courseId: string;
  author: string;
  role: string;
  rating: number;
  headline: string;
  comment: string;
  createdAt: string;
};

const FALLBACK_REVIEWS: Record<string, CourseReview[]> = {
  "network-foundations": [
    {
      id: "nf-1",
      courseId: "network-foundations",
      author: "Kevin M.",
      role: "Junior Network Technician",
      rating: 5,
      headline: "Crystal clear explanations",
      comment:
        "Finally understand subnetting and topologies without second guessing. The labs mirror exactly what I see onsite.",
      createdAt: new Date("2024-03-11").toISOString(),
    },
    {
      id: "nf-2",
      courseId: "network-foundations",
      author: "Annette K.",
      role: "IT Support Assistant",
      rating: 4,
      headline: "Perfect launchpad",
      comment:
        "Loved the mix of video and reading. Mika's nudges kept me accountable each evening after work.",
      createdAt: new Date("2024-05-02").toISOString(),
    },
  ],
  "cloud-networking-essentials": [
    {
      id: "cne-1",
      courseId: "cloud-networking-essentials",
      author: "Ian W.",
      role: "Cloud Infrastructure Engineer",
      rating: 5,
      headline: "Hybrid designs demystified",
      comment:
        "Transit gateway walkthroughs and IaC templates made my AWS + Azure rollout painless. The incident playbooks were gold.",
      createdAt: new Date("2024-06-18").toISOString(),
    },
  ],
  "network-automation-devops": [
    {
      id: "nad-1",
      courseId: "network-automation-devops",
      author: "Faith L.",
      role: "Automation Specialist",
      rating: 5,
      headline: "Pipelines that actually work",
      comment:
        "I copied the GitHub Actions pipeline and shipped change automation in a week. The drift detection lab is now part of our runbook.",
      createdAt: new Date("2024-07-08").toISOString(),
    },
  ],
};

const fetchReviews = async (courseId: string): Promise<CourseReview[]> => {
  try {
    const { data, error } = await supabase
      .from("course_reviews")
      .select("id,course_id,author,role,rating,headline,comment,created_at")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.warn("course reviews fetch error", error.message);
      return FALLBACK_REVIEWS[courseId] ?? [];
    }

    if (!data || data.length === 0) {
      return FALLBACK_REVIEWS[courseId] ?? [];
    }

    return data.map((row) => ({
      id: row.id,
      courseId: row.course_id,
      author: row.author ?? "Anonymous",
      role: row.role ?? "Learner",
      rating: Number(row.rating ?? 5),
      headline: row.headline ?? "Great course",
      comment: row.comment ?? "",
      createdAt: row.created_at ?? new Date().toISOString(),
    }));
  } catch (error) {
    console.warn("course reviews fetch failure", error);
    return FALLBACK_REVIEWS[courseId] ?? [];
  }
};

export const useCourseReviews = (courseId: string | undefined) => {
  const result = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => fetchReviews(courseId ?? ""),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 30,
  });

  const meta = useMemo(() => {
    const reviews = result.data ?? [];
    if (reviews.length === 0) {
      return { average: 0, total: 0 };
    }
    const total = reviews.length;
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total;
    return { average: Math.round(average * 10) / 10, total };
  }, [result.data]);

  return {
    ...result,
    average: meta.average,
    total: meta.total,
  };
};
