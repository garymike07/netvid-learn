import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FALLBACK_TRACKS, type FeaturedTrack } from "@/data/tracks";

type TrackRow = {
  id: string;
  title?: string;
  summary?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimated_weeks?: number;
  focus?: string;
  hero_image?: string;
  track_courses?: Array<{ course_id?: string }> | null;
};

const mapRowToTrack = (row: TrackRow): FeaturedTrack => {
  const courseIds = Array.isArray(row.track_courses)
    ? row.track_courses.map((entry) => entry?.course_id).filter((value): value is string => Boolean(value))
    : [];

  return {
    id: row.id,
    title: row.title ?? "Untitled Track",
    description: row.summary ?? "Explore a curated journey built by the Mike Net team.",
    difficulty: row.difficulty ?? "Intermediate",
    estimatedWeeks: row.estimated_weeks ?? 8,
    focus: row.focus ?? row.title ?? "Network Engineering",
    heroImage: row.hero_image ?? "/images/futuristic-dashboard.png",
    courseIds,
  };
};

const fetchFeaturedTracks = async (): Promise<FeaturedTrack[]> => {
  try {
    const { data, error } = await supabase
      .from("tracks")
      .select("id,title,summary,difficulty,estimated_weeks,focus,hero_image,track_courses(course_id)")
      .eq("is_featured", true)
      .order("order_index", { ascending: true })
      .limit(6);

    if (error) {
      console.warn("featured tracks fetch error", error.message);
      return FALLBACK_TRACKS;
    }

    if (!data || data.length === 0) {
      return FALLBACK_TRACKS;
    }

    return data.map(mapRowToTrack);
  } catch (error) {
    console.warn("featured tracks fetch failure", error);
    return FALLBACK_TRACKS;
  }
};

export const useFeaturedTracks = () =>
  useQuery({ queryKey: ["featured-tracks"], queryFn: fetchFeaturedTracks, staleTime: 1000 * 60 * 30 });
