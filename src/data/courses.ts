export type LessonType = "video" | "lab" | "reading" | "quiz";

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  description: string;
  resources?: Array<{ label: string; url: string }>;
  videoUrl?: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  summary: string;
  description: string;
  duration: string;
  isPremium: boolean;
  heroVideo: string;
  outcomes: string[];
  prerequisites: string[];
  modules: Module[];
};

export const COURSES: Course[] = [
  {
    id: "network-foundations",
    slug: "network-foundations",
    title: "Network Foundations",
    level: "Beginner",
    summary: "Learn the core concepts of computer networking from the ground up.",
    description:
      "Start your networking journey with a comprehensive tour of how modern networks operate. You will understand the building blocks, terminology, and real-world use cases that power today's connected world.",
    duration: "4-6 weeks",
    isPremium: false,
    heroVideo: "https://www.youtube.com/embed/q8NVJG7FOa4",
    outcomes: [
      "Explain how the internet routes traffic end to end",
      "Identify common networking hardware and their responsibilities",
      "Design a basic small-office network topology",
      "Troubleshoot connectivity issues using structured methodology",
    ],
    prerequisites: ["No prior experience required", "Comfort using a computer"],
    modules: [
      {
        id: "foundations-1",
        title: "Getting Started with Networking",
        description: "Discover what a network is, why it matters, and the vocabulary professionals use daily.",
        lessons: [
          {
            id: "foundations-1-1",
            title: "What is a Network?",
            type: "video",
            duration: "12 min",
            description: "Understand nodes, links, and the value of connectivity with real-world analogies.",
            videoUrl: "https://www.youtube.com/embed/Lc1YRx9Jq0A",
            resources: [
              { label: "Slide deck", url: "https://networkacademy.ke/resources/what-is-a-network.pdf" },
            ],
          },
          {
            id: "foundations-1-2",
            title: "Network Topologies",
            type: "reading",
            duration: "15 min",
            description: "Compare bus, ring, mesh, and star topologies and when to use each.",
            resources: [
              { label: "Interactive Lab", url: "https://networkacademy.ke/labs/topology-designer" },
            ],
          },
          {
            id: "foundations-1-3",
            title: "Hands-on: Build Your First LAN",
            type: "lab",
            duration: "25 min",
            description: "Use a guided simulation to connect hosts, switches, and routers.",
            resources: [
              { label: "Lab Simulation", url: "https://networkacademy.ke/labs/lan-builder" },
            ],
          },
        ],
      },
      {
        id: "foundations-2",
        title: "Networking Hardware Essentials",
        description: "Explore switches, routers, firewalls, and wireless access points in detail.",
        lessons: [
          {
            id: "foundations-2-1",
            title: "Routers vs Switches",
            type: "video",
            duration: "14 min",
            description: "Dive into the data-link and network layer responsibilities of routers and switches.",
            videoUrl: "https://www.youtube.com/embed/sYd5S4ltnQA",
          },
          {
            id: "foundations-2-2",
            title: "Wireless Networking Basics",
            type: "reading",
            duration: "12 min",
            description: "Understand Wi-Fi standards, channels, and coverage planning.",
            resources: [
              { label: "Cheat Sheet", url: "https://networkacademy.ke/resources/wireless-cheatsheet.pdf" },
            ],
          },
          {
            id: "foundations-2-3",
            title: "Quiz: Identify the Right Hardware",
            type: "quiz",
            duration: "10 min",
            description: "Check your understanding with scenario-based questions.",
          },
        ],
      },
      {
        id: "foundations-3",
        title: "The Transport and Application Layers",
        description: "Learn how TCP/UDP ensure data delivery and how applications leverage them.",
        lessons: [
          {
            id: "foundations-3-1",
            title: "Understanding TCP/IP",
            type: "video",
            duration: "18 min",
            description: "Visualize the encapsulation process across OSI and TCP/IP models.",
            videoUrl: "https://www.youtube.com/embed/EBY-LzvOj_g",
          },
          {
            id: "foundations-3-2",
            title: "Troubleshoot with Wireshark",
            type: "lab",
            duration: "30 min",
            description: "Capture and analyze packets to diagnose latency issues.",
            resources: [
              { label: "Lab Instructions", url: "https://networkacademy.ke/labs/wireshark-lab" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "routing-essentials",
    slug: "routing-essentials",
    title: "Routing & Switching Essentials",
    level: "Intermediate",
    summary: "Configure dynamic routing protocols and master VLAN segmentation.",
    description:
      "Take your skills to the next level by configuring real Cisco and MikroTik environments. You will implement routing protocols, VLANs, and redundancy technologies used across Kenyan ISPs and enterprises.",
    duration: "6-8 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/S7wCOIaNYEc",
    outcomes: [
      "Deploy VLANs and trunking on managed switches",
      "Configure OSPF and EIGRP in multi-router topologies",
      "Implement static routes and policy-based routing",
      "Use HSRP/VRRP to design highly available gateways",
    ],
    prerequisites: [
      "Complete Network Foundations or equivalent knowledge",
      "Basic command-line configuration experience",
    ],
    modules: [
      {
        id: "routing-1",
        title: "Layer 2 Mastery",
        description: "Segment networks logically using VLANs and understand spanning tree protocols.",
        lessons: [
          {
            id: "routing-1-1",
            title: "Advanced VLAN Design",
            type: "video",
            duration: "20 min",
            description: "Configure access, trunk, and voice VLANs with security best practices.",
            videoUrl: "https://www.youtube.com/embed/8t2TOXSk3iY",
          },
          {
            id: "routing-1-2",
            title: "Lab: Inter-VLAN Routing",
            type: "lab",
            duration: "35 min",
            description: "Bridge VLANs using router-on-a-stick and layer 3 switches.",
            resources: [
              { label: "Packet Tracer File", url: "https://networkacademy.ke/labs/inter-vlan-routing.pkt" },
            ],
          },
          {
            id: "routing-1-3",
            title: "Spanning Tree Deep Dive",
            type: "reading",
            duration: "20 min",
            description: "Prevent switching loops using STP, RSTP, and Rapid PVST+.",
          },
        ],
      },
      {
        id: "routing-2",
        title: "Dynamic Routing Protocols",
        description: "Plan and deploy OSPF and EIGRP to support scalable enterprise networks.",
        lessons: [
          {
            id: "routing-2-1",
            title: "Single-Area OSPF Configuration",
            type: "video",
            duration: "22 min",
            description: "Follow step-by-step configuration of OSPF on Cisco IOS.",
            videoUrl: "https://www.youtube.com/embed/HTQKk9MdQMI",
          },
          {
            id: "routing-2-2",
            title: "EIGRP Metrics & Optimization",
            type: "reading",
            duration: "18 min",
            description: "Tune bandwidth, delay, and variance to optimize path selection.",
          },
          {
            id: "routing-2-3",
            title: "Quiz: Select the Best Routing Protocol",
            type: "quiz",
            duration: "12 min",
            description: "Scenario-based quiz comparing static, OSPF, and EIGRP approaches.",
          },
        ],
      },
      {
        id: "routing-3",
        title: "High Availability & Troubleshooting",
        description: "Build fault-tolerant designs and respond to outages swiftly.",
        lessons: [
          {
            id: "routing-3-1",
            title: "Gateway Redundancy with HSRP",
            type: "video",
            duration: "16 min",
            description: "Configure HSRP for seamless failover between edge routers.",
            videoUrl: "https://www.youtube.com/embed/NZfJOL4956A",
          },
          {
            id: "routing-3-2",
            title: "Lab: Validate Routing Tables",
            type: "lab",
            duration: "40 min",
            description: "Use traceroute and show commands to debug misconfigurations.",
            resources: [
              { label: "MikroTik Config Pack", url: "https://networkacademy.ke/labs/routing-toolkit.zip" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "network-security-pro",
    slug: "network-security-pro",
    title: "Network Security Professional",
    level: "Advanced",
    summary: "Protect enterprise networks with layered security strategies.",
    description:
      "Master modern security controls including firewalls, VPNs, NAC, and threat detection. Apply policy frameworks tailored for African enterprises and telecoms.",
    duration: "8-10 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/qWlwz0GxITg",
    outcomes: [
      "Design secure access control policies across wired and wireless networks",
      "Deploy IPSec VPNs and SSL remote access solutions",
      "Implement Zero Trust principles with identity-aware networking",
      "Monitor networks and respond to incidents with structured playbooks",
    ],
    prerequisites: [
      "Routing & Switching Essentials or equivalent",
      "Familiarity with Linux command line",
    ],
    modules: [
      {
        id: "security-1",
        title: "Perimeter Security",
        description: "Configure next-gen firewalls, intrusion prevention, and DMZ designs.",
        lessons: [
          {
            id: "security-1-1",
            title: "Firewall Policies that Work",
            type: "video",
            duration: "19 min",
            description: "Craft policy rule-sets with least-privilege principles.",
            videoUrl: "https://www.youtube.com/embed/yKsH3TQkzVI",
          },
          {
            id: "security-1-2",
            title: "Lab: Palo Alto Security Profiles",
            type: "lab",
            duration: "45 min",
            description: "Deploy WildFire, URL filtering, and logging for monitored enforcement.",
          },
        ],
      },
      {
        id: "security-2",
        title: "Secure Remote Connectivity",
        description: "Deliver secure remote access using IPSec, SSL VPN, and multi-factor authentication.",
        lessons: [
          {
            id: "security-2-1",
            title: "Site-to-Site VPNs",
            type: "video",
            duration: "21 min",
            description: "Configure IPSec tunnels with IKEv2 and troubleshoot negotiation failures.",
            videoUrl: "https://www.youtube.com/embed/ROLv47P7X9g",
          },
          {
            id: "security-2-2",
            title: "Zero Trust Network Access",
            type: "reading",
            duration: "25 min",
            description: "Adopt identity-aware segmentation and software-defined perimeters.",
          },
          {
            id: "security-2-3",
            title: "Incident Response Playbook",
            type: "quiz",
            duration: "10 min",
            description: "Assess your readiness to respond to common attack scenarios.",
          },
        ],
      },
      {
        id: "security-3",
        title: "Monitoring & Operations",
        description: "Detect anomalies quickly and automate responses with modern tooling.",
        lessons: [
          {
            id: "security-3-1",
            title: "SIEM Integration",
            type: "video",
            duration: "17 min",
            description: "Integrate network logs into Azure Sentinel and Elastic for alerting.",
            videoUrl: "https://www.youtube.com/embed/8U7-a7qUZ5A",
          },
          {
            id: "security-3-2",
            title: "Automation with Python",
            type: "lab",
            duration: "40 min",
            description: "Use Python scripts to quarantine infected hosts via API.",
            resources: [
              { label: "GitHub Repo", url: "https://github.com/network-academy/automation-playbooks" },
            ],
          },
        ],
      },
    ],
  },
];

export const getCourseBySlug = (slug: string) => COURSES.find((course) => course.slug === slug);
