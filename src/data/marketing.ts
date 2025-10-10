export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

export type Partner = {
  id: string;
  name: string;
  url: string;
  logo?: string;
  fallback?: string;
};

export type TrackHighlight = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  accent: string;
  icon: string;
  stats: Array<{ label: string; value: string }>;
};

export type MarketingEvent = {
  id: string;
  title: string;
  date: string;
  mode: "virtual" | "in_person";
  blurb: string;
  registerUrl: string;
};

export type CertificationSpotlight = {
  headline: string;
  description: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "joy-n",
    quote:
      "Mike Net Academy condensed years of networking experience into a roadmap that made sense. I landed a network engineer role in Nairobi within three months of finishing the expert track.",
    author: "Joy N.",
    role: "Network Engineer, Safaricom",
    avatar: "/images/testimonials/joy-n.png",
  },
  {
    id: "brian-k",
    quote:
      "The labs and troubleshooting drills felt like on-call rotations. My team now trusts me to lead production changes because I have a playbook for every scenario.",
    author: "Brian K.",
    role: "Infrastructure Specialist, Equity Bank",
    avatar: "/images/testimonials/brian-k.png",
  },
  {
    id: "leah-w",
    quote:
      "Our graduates transitioned from theory to hands-on confidence. Their certification pass rate doubled after adopting Mike Net Academy as the primary curriculum.",
    author: "Leah W.",
    role: "Director of ICT, TUM",
    avatar: "/images/testimonials/leah-w.png",
  },
];

export const partners: Partner[] = [
  { id: "telkom", name: "Telkom Kenya", url: "https://telkom.co.ke", fallback: "TK" },
  { id: "cisco", name: "Cisco", url: "https://www.cisco.com", fallback: "Cisco" },
  { id: "akamai", name: "Akamai", url: "https://www.akamai.com", fallback: "Akamai" },
  { id: "equity", name: "Equity Group", url: "https://equitygroupholdings.com", fallback: "Equity" },
  { id: "liquid", name: "Liquid", url: "https://www.liquid.tech", fallback: "Liquid" },
  { id: "mtn", name: "MTN Business", url: "https://www.mtnbusiness.co.za", fallback: "MTN" },
];

export const trackHighlights: TrackHighlight[] = [
  {
    id: "design",
    title: "Design Enterprise Networks",
    description:
      "Architect scalable, redundant infrastructures that meet uptime SLAs and security requirements for high-growth organisations across Africa.",
    ctaLabel: "Explore Architecture Track",
    ctaHref: "/courses/network-security-pro",
    accent: "from-[#6366f1] via-[#8b5cf6] to-[#ec4899]",
    icon: "CircuitBoard",
    stats: [
      { label: "Capstone labs", value: "12" },
      { label: "Design playbooks", value: "8" },
    ],
  },
  {
    id: "operations",
    title: "Master Network Operations",
    description:
      "Turn troubleshooting into reflex with live packet captures, automated diagnostics, and incident response scenarios from real NOCs.",
    ctaLabel: "View Operations Track",
    ctaHref: "/courses/routing-essentials",
    accent: "from-[#22d3ee] via-[#0ea5e9] to-[#6366f1]",
    icon: "Activity",
    stats: [
      { label: "Mean time to resolve", value: "↓ 48%" },
      { label: "Automation scripts", value: "24" },
    ],
  },
  {
    id: "leadership",
    title: "Lead High-Impact Teams",
    description:
      "Bridge technical excellence with leadership. Coach peers, create roadmaps, and deliver metrics executives understand.",
    ctaLabel: "Discover Leadership Labs",
    ctaHref: "/dashboard",
    accent: "from-[#f97316] via-[#fb7185] to-[#f472b6]",
    icon: "Users",
    stats: [
      { label: "Mentorship sessions", value: "18" },
      { label: "Strategy frameworks", value: "6" },
    ],
  },
];

export const marketingEvents: MarketingEvent[] = [
  {
    id: "packet-pioneers",
    title: "Packet Pioneers Live Lab",
    date: "Nov 16, 2024",
    mode: "virtual",
    blurb: "Debug latency issues alongside senior engineers in this guided lab featuring live traffic traces.",
    registerUrl: "https://lu.ma/packet-pioneers",
  },
  {
    id: "campus-tour",
    title: "Kenyan Campus Tour",
    date: "Dec 3, 2024",
    mode: "in_person",
    blurb: "Join the Mike Net team in Mombasa, Eldoret, and Nairobi for hands-on demos and career coaching.",
    registerUrl: "https://lu.ma/mikenet-tour",
  },
  {
    id: "noc-night",
    title: "NOC Night Challenge",
    date: "Jan 11, 2025",
    mode: "virtual",
    blurb: "Respond to mock incidents with automation and analytics tools during this 3-hour scenario sprint.",
    registerUrl: "https://lu.ma/noc-night",
  },
];

export const certificationSpotlight: CertificationSpotlight = {
  headline: "Verify expertise instantly",
  description:
    "Issue verifiable certificates with tamper-proof IDs and dedicated verification pages partners can trust.",
  benefits: [
    "Automated PDF certificates with custom branding per track",
    "Public verification lookup with QR code access",
    "Share-ready social cards for LinkedIn and Twitter",
  ],
  ctaLabel: "Preview certification experience",
  ctaHref: "/verify",
};
