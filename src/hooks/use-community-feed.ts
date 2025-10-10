import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PulseTrend = "up" | "down" | "steady";

export type PulseMetric = {
  label: string;
  value: string;
  delta: string;
  trend: PulseTrend;
};

export type TopContributor = {
  name: string;
  role: string;
  streakDays: number;
  delta: number;
  location: string;
};

export type TrendingCourse = {
  id: string;
  title: string;
  slug: string;
  highlight: string;
  focus: string;
};

export type CommunityPulse = {
  metrics: PulseMetric[];
  topContributor: TopContributor;
  trendingCourse: TrendingCourse;
};

export type CommunityRecommendation = {
  id: string;
  label: string;
  description: string;
  type: "course" | "lab" | "community";
  ctaLabel: string;
  href: string;
  highlight?: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  facilitator: string;
  type: "live" | "async";
  seatsLeft?: number;
  href: string;
};

export type CommunityUpdate = {
  id: string;
  learner: string;
  role: string;
  message: string;
  highlight: string;
  courseSlug?: string;
  createdAt: string;
  initials: string;
};

export type CommunityFeed = {
  pulse: CommunityPulse;
  recommendations: CommunityRecommendation[];
  events: CommunityEvent[];
  updates: CommunityUpdate[];
};

const FALLBACK_FEED: CommunityFeed = {
  pulse: {
    metrics: [
      { label: "Learners active today", value: "1,284", delta: "+18%", trend: "up" },
      { label: "Labs completed", value: "362", delta: "+42", trend: "up" },
      { label: "Avg streak", value: "4.2 days", delta: "+0.8", trend: "up" },
    ],
    topContributor: {
      name: "Joy Wairimu",
      role: "NOC Team Lead",
      streakDays: 12,
      delta: 2,
      location: "Nairobi",
    },
    trendingCourse: {
      id: "network-automation-devops",
      title: "Network Automation & DevOps",
      slug: "network-automation-devops",
      highlight: "42 peers automated change windows this week.",
      focus: "GitOps • IaC • Observability",
    },
  },
  recommendations: [
    {
      id: "rec-lab-1",
      label: "Deploy a Zero-Touch Branch Router",
      description: "Replica of Safaricom's field rollout — practice the automation workflow end-to-end.",
      type: "lab",
      ctaLabel: "Start lab",
      href: "/courses/network-automation-devops",
      highlight: "Avg completion 38 min",
    },
    {
      id: "rec-community-1",
      label: "Post your weekly win",
      description: "Share what you shipped in the #network-automation channel to motivate peers.",
      type: "community",
      ctaLabel: "Open community",
      href: "https://community.mikenet.academy/channels/network-automation",
      highlight: "16 replies in the last hour",
    },
    {
      id: "rec-course-1",
      label: "Cloud Networking Essentials, Module 3",
      description: "Deep dive on hybrid transit topologies with live incident reviews.",
      type: "course",
      ctaLabel: "Resume module",
      href: "/courses/cloud-networking-essentials",
    },
  ],
  events: [
    {
      id: "event-1",
      title: "Live Change Review: Automating BGP Failover",
      startsAt: new Date().toISOString(),
      durationMinutes: 60,
      facilitator: "Ian from Safaricom",
      type: "live",
      seatsLeft: 18,
      href: "https://community.mikenet.academy/events/bgp-failover",
    },
    {
      id: "event-2",
      title: "Async Study Sprint: Secure Campus Networks",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      durationMinutes: 120,
      facilitator: "Community mentors",
      type: "async",
      href: "https://community.mikenet.academy/events/campus-security-sprint",
    },
  ],
  updates: [
    {
      id: "update-1",
      learner: "Kelvin Mwangi",
      role: "Field Engineer @ Liquid Telecom",
      message: "Closed my first automation change with zero rollbacks! The GitOps lab made approvals painless.",
      highlight: "Completed Automation & DevOps",
      courseSlug: "network-automation-devops",
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      initials: "KM",
    },
    {
      id: "update-2",
      learner: "Neema Leteipa",
      role: "Cybersecurity Analyst @ KCB",
      message: "Shared our incident response playbook template in the community vault.",
      highlight: "Uploaded new resource",
      courseSlug: "cyber-operations-defense",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      initials: "NL",
    },
    {
      id: "update-3",
      learner: "Brian Otieno",
      role: "Network Support @ Kenya Power",
      message: "Hit a 9-day streak tackling the WAN resiliency path.",
      highlight: "Streak milestone",
      createdAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
      initials: "BO",
    },
  ],
};

const parseFeedRow = (row: Record<string, unknown> | null): CommunityFeed => {
  if (!row) return FALLBACK_FEED;

  try {
    const pulse = (row.pulse as CommunityPulse | undefined) ?? FALLBACK_FEED.pulse;
    const recommendations = (row.recommendations as CommunityRecommendation[] | undefined) ?? FALLBACK_FEED.recommendations;
    const events = (row.events as CommunityEvent[] | undefined) ?? FALLBACK_FEED.events;
    const updates = (row.updates as CommunityUpdate[] | undefined) ?? FALLBACK_FEED.updates;

    return {
      pulse,
      recommendations,
      events,
      updates,
    } satisfies CommunityFeed;
  } catch (error) {
    console.warn("community feed parse failure", error);
    return FALLBACK_FEED;
  }
};

const fetchCommunityFeed = async (): Promise<CommunityFeed> => {
  try {
    const { data, error } = await supabase.from("community_feed").select("pulse,recommendations,events,updates").maybeSingle();

    if (error) {
      console.warn("community feed fetch error", error.message);
      return FALLBACK_FEED;
    }

    return parseFeedRow(data ?? null);
  } catch (error) {
    console.warn("community feed fetch failure", error);
    return FALLBACK_FEED;
  }
};

export const COMMUNITY_FEED_FALLBACK = FALLBACK_FEED;

export const useCommunityFeed = () =>
  useQuery({
    queryKey: ["community-feed"],
    queryFn: fetchCommunityFeed,
    staleTime: 1000 * 60 * 15,
  });
