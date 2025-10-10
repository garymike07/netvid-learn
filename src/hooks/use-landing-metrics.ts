import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LandingMetrics = {
  totalLearners: number;
  courseHours: number;
  completionRate: number;
  partnerCount: number;
};

const FALLBACK_METRICS: LandingMetrics = {
  totalLearners: 12680,
  courseHours: 480,
  completionRate: 0.87,
  partnerCount: 42,
};

const transformMetrics = (payload: Record<string, unknown> | null): LandingMetrics => {
  if (!payload) {
    return FALLBACK_METRICS;
  }

  const totalLearners = typeof payload.total_learners === "number" ? payload.total_learners : FALLBACK_METRICS.totalLearners;
  const courseHours = typeof payload.course_hours === "number" ? payload.course_hours : FALLBACK_METRICS.courseHours;
  const completionRate =
    typeof payload.completion_rate === "number" ? payload.completion_rate : FALLBACK_METRICS.completionRate;
  const partnerCount = typeof payload.partner_count === "number" ? payload.partner_count : FALLBACK_METRICS.partnerCount;

  return {
    totalLearners,
    courseHours,
    completionRate,
    partnerCount,
  };
};

const fetchLandingMetrics = async (): Promise<LandingMetrics> => {
  try {
    const { data, error } = await supabase.from("landing_metrics").select("*").single();

    if (error) {
      console.warn("landing_metrics fetch error", error.message);
      return FALLBACK_METRICS;
    }

    return transformMetrics(data as Record<string, unknown> | null);
  } catch (error) {
    console.warn("landing_metrics fetch failure", error);
    return FALLBACK_METRICS;
  }
};

export const useLandingMetrics = () =>
  useQuery({ queryKey: ["landing-metrics"], queryFn: fetchLandingMetrics, staleTime: 1000 * 60 * 10, suspense: false });
