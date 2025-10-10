export type FeaturedTrack = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedWeeks: number;
  focus: string;
  heroImage?: string;
  courseIds: string[];
};

export const FALLBACK_TRACKS: FeaturedTrack[] = [
  {
    id: "foundation-master",
    title: "Network Foundations Mastery",
    description:
      "Start with the absolute fundamentals, build troubleshooting instincts, and connect core routing concepts before specialising.",
    difficulty: "Beginner",
    estimatedWeeks: 10,
    focus: "Network Foundations",
    heroImage: "/images/futuristic-dashboard.png",
    courseIds: ["network-foundations", "routing-essentials", "carrier-network-operations"],
  },
  {
    id: "cloud-sec-ops",
    title: "Cloud Networking & Security Operations",
    description:
      "Design hybrid cloud fabrics, secure critical workloads, and automate response workflows that keep enterprises resilient.",
    difficulty: "Intermediate",
    estimatedWeeks: 12,
    focus: "Cloud & Security",
    heroImage: "/images/futuristic-lab.png",
    courseIds: ["cloud-networking-essentials", "cyber-operations-defense", "network-automation-devops"],
  },
  {
    id: "wireless-edge-expert",
    title: "Wireless & Edge Expert",
    description:
      "Engineer high-density wireless, extend coverage with private 5G, and connect remote regions with satellite backhaul.",
    difficulty: "Advanced",
    estimatedWeeks: 14,
    focus: "Wireless & Edge",
    heroImage: "/images/futuristic-dashboard.png",
    courseIds: ["wireless-design-pro", "edge-5g-engineering", "satellite-rural-connectivity"],
  },
];
