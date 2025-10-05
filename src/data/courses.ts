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
    heroVideo: "https://www.youtube.com/embed/ltBWJIhcjpA",
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
            videoUrl: "https://www.youtube.com/embed/Mm3vNyVSDxs",
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
            videoUrl: "https://www.youtube.com/embed/3ARTjvpZCoQ",
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
            videoUrl: "https://www.youtube.com/embed/jW5GhNhBReA",
            resources: [
              { label: "Lab Simulation", url: "https://networkacademy.ke/labs/lan-builder" },
            ],
          },
          {
            id: "foundations-1-4",
            title: "Tour a Real Small Office Network",
            type: "video",
            duration: "16 min",
            description: "Walk through cabling, switch placement, and router setup in a real office.",
            videoUrl: "https://www.youtube.com/embed/3jDaE2mbHJ0",
            resources: [
              { label: "Topology Checklist", url: "https://networkacademy.ke/resources/office-topology-checklist.pdf" },
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
            videoUrl: "https://www.youtube.com/embed/qIIRSwnIcaA",
            resources: [
              { label: "Packet Flow Diagram", url: "https://networkacademy.ke/resources/router-switch-flow.pdf" },
              { label: "CLI Cheat Sheet", url: "https://networkacademy.ke/resources/router-switch-cli.pdf" },
            ],
          },
          {
            id: "foundations-2-2",
            title: "Wireless Networking Basics",
            type: "reading",
            duration: "12 min",
            description: "Understand Wi-Fi standards, channels, and coverage planning.",
            videoUrl: "https://www.youtube.com/embed/NalNQAGN7mQ",
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
            videoUrl: "https://www.youtube.com/embed/MXr_cyY0BVc",
            resources: [
              { label: "Review Guide", url: "https://networkacademy.ke/resources/hardware-review-guide.pdf" },
            ],
          },
          {
            id: "foundations-2-4",
            title: "Inside a Modern Wireless Access Point",
            type: "video",
            duration: "14 min",
            description: "Disassemble an AP to understand radios, antennas, and controller integration.",
            videoUrl: "https://www.youtube.com/embed/IStbaTQTBio",
            resources: [
              { label: "AP Components Diagram", url: "https://networkacademy.ke/resources/ap-components.pdf" },
            ],
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
            videoUrl: "https://www.youtube.com/embed/6_eQUFZWlKE",
            resources: [
              { label: "Encapsulation Worksheet", url: "https://networkacademy.ke/resources/tcpip-worksheet.pdf" },
            ],
          },
          {
            id: "foundations-3-2",
            title: "Troubleshoot with Wireshark",
            type: "lab",
            duration: "30 min",
            description: "Capture and analyze packets to diagnose latency issues.",
            videoUrl: "https://www.youtube.com/embed/5nS_2zA-kDw",
            resources: [
              { label: "Lab Instructions", url: "https://networkacademy.ke/labs/wireshark-lab" },
            ],
          },
          {
            id: "foundations-3-3",
            title: "TCP vs UDP Explained",
            type: "video",
            duration: "13 min",
            description: "Clarify when applications choose TCP or UDP and how ports stay organized.",
            videoUrl: "https://www.youtube.com/embed/7brFDwM64aQ",
            resources: [
              { label: "Transport Layer Worksheet", url: "https://networkacademy.ke/resources/transport-layer-worksheet.pdf" },
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
    heroVideo: "https://www.youtube.com/embed/alfMH_iwMxA",
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
            videoUrl: "https://www.youtube.com/embed/IYwR4c0kgCE",
            resources: [
              { label: "VLAN Design Guide", url: "https://networkacademy.ke/resources/vlan-design-guide.pdf" },
            ],
          },
          {
            id: "routing-1-2",
            title: "Lab: Inter-VLAN Routing",
            type: "lab",
            duration: "35 min",
            description: "Bridge VLANs using router-on-a-stick and layer 3 switches.",
            videoUrl: "https://www.youtube.com/embed/N6dfmfO-3Dw",
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
            videoUrl: "https://www.youtube.com/embed/MX-NOZqbxh0",
            resources: [
              { label: "STP Troubleshooting Flowchart", url: "https://networkacademy.ke/resources/stp-troubleshooting.png" },
            ],
          },
          {
            id: "routing-1-4",
            title: "Switch Stacking & EtherChannel",
            type: "video",
            duration: "18 min",
            description: "Combine switches for higher capacity and redundancy using EtherChannel.",
            videoUrl: "https://www.youtube.com/embed/-9KjBC5Jv-U",
            resources: [
              { label: "EtherChannel Lab", url: "https://networkacademy.ke/labs/etherchannel-practice.zip" },
            ],
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
            videoUrl: "https://www.youtube.com/embed/Y4imT775wxQ",
            resources: [
              { label: "OSPF Topology File", url: "https://networkacademy.ke/labs/ospf-topology.pkt" },
            ],
          },
          {
            id: "routing-2-2",
            title: "EIGRP Metrics & Optimization",
            type: "reading",
            duration: "18 min",
            description: "Tune bandwidth, delay, and variance to optimize path selection.",
            videoUrl: "https://www.youtube.com/embed/eJOqHt8J3LA",
            resources: [
              { label: "EIGRP Calculator", url: "https://networkacademy.ke/tools/eigrp-metric-calculator" },
            ],
          },
          {
            id: "routing-2-3",
            title: "Quiz: Select the Best Routing Protocol",
            type: "quiz",
            duration: "12 min",
            description: "Scenario-based quiz comparing static, OSPF, and EIGRP approaches.",
            videoUrl: "https://www.youtube.com/embed/rLNmrFh-sd8",
          },
          {
            id: "routing-2-4",
            title: "Multi-area OSPF Design Walkthrough",
            type: "video",
            duration: "21 min",
            description: "Plan area boundaries, ABRs, and summarization for scalable deployments.",
            videoUrl: "https://www.youtube.com/embed/n4J9M-HBPn4",
            resources: [
              { label: "Design Template", url: "https://networkacademy.ke/resources/ospf-design-template.pdf" },
            ],
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
            videoUrl: "https://www.youtube.com/embed/mDsk2r3Bh0M",
            resources: [
              { label: "HSRP Configuration Workbook", url: "https://networkacademy.ke/resources/hsrp-workbook.pdf" },
            ],
          },
          {
            id: "routing-3-2",
            title: "Lab: Validate Routing Tables",
            type: "lab",
            duration: "40 min",
            description: "Use traceroute and show commands to debug misconfigurations.",
            videoUrl: "https://www.youtube.com/embed/Yshd2z5ru9Q",
            resources: [
              { label: "MikroTik Config Pack", url: "https://networkacademy.ke/labs/routing-toolkit.zip" },
            ],
          },
          {
            id: "routing-3-3",
            title: "Troubleshooting OSPF and EIGRP",
            type: "video",
            duration: "19 min",
            description: "Apply show commands and debugs to isolate adjacency and route issues.",
            videoUrl: "https://www.youtube.com/embed/bxPUubJl71s",
            resources: [
              { label: "Troubleshooting Worksheet", url: "https://networkacademy.ke/resources/routing-troubleshooting.pdf" },
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
    heroVideo: "https://www.youtube.com/embed/nII9yL8yf5Y",
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
            videoUrl: "https://www.youtube.com/embed/zvkJo410vu8",
            resources: [
              { label: "Firewall Policy Templates", url: "https://networkacademy.ke/resources/firewall-policy-templates.zip" },
            ],
          },
          {
            id: "security-1-2",
            title: "Lab: Palo Alto Security Profiles",
            type: "lab",
            duration: "45 min",
            description: "Deploy WildFire, URL filtering, and logging for monitored enforcement.",
            videoUrl: "https://www.youtube.com/embed/A41ik1pkcwo",
            resources: [
              { label: "Security Profiles Workbook", url: "https://networkacademy.ke/labs/palo-alto-profiles.pdf" },
            ],
          },
          {
            id: "security-1-3",
            title: "Firewall Lab Walkthrough",
            type: "video",
            duration: "23 min",
            description: "Watch a full Palo Alto configuration session with best practices explained.",
            videoUrl: "https://www.youtube.com/embed/_en8gPflPec",
            resources: [
              { label: "Session Notes", url: "https://networkacademy.ke/resources/firewall-walkthrough-notes.pdf" },
            ],
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
            videoUrl: "https://www.youtube.com/embed/qwtj-oSBhMg",
            resources: [
              { label: "IPSec Config Pack", url: "https://networkacademy.ke/labs/ipsec-config-pack.zip" },
            ],
          },
          {
            id: "security-2-2",
            title: "Zero Trust Network Access",
            type: "reading",
            duration: "25 min",
            description: "Adopt identity-aware segmentation and software-defined perimeters.",
            videoUrl: "https://www.youtube.com/embed/tolxnxGshWk",
            resources: [
              { label: "Zero Trust Reference Architecture", url: "https://networkacademy.ke/resources/zero-trust-reference.pdf" },
            ],
          },
          {
            id: "security-2-3",
            title: "Incident Response Playbook",
            type: "quiz",
            duration: "10 min",
            description: "Assess your readiness to respond to common attack scenarios.",
            videoUrl: "https://www.youtube.com/embed/PCbtJ-GudLk",
            resources: [
              { label: "SOC Checklist", url: "https://networkacademy.ke/resources/soc-checklist.pdf" },
            ],
          },
          {
            id: "security-2-4",
            title: "Remote Access VPN Demo",
            type: "video",
            duration: "18 min",
            description: "Configure client VPN connectivity end-to-end with certificate auth.",
            videoUrl: "https://www.youtube.com/embed/gm5Y59RQ2Lw",
            resources: [
              { label: "VPN Checklist", url: "https://networkacademy.ke/resources/vpn-checklist.pdf" },
            ],
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
            videoUrl: "https://www.youtube.com/embed/Ln1SpMFn62Y",
            resources: [
              { label: "SIEM Parser Pack", url: "https://networkacademy.ke/resources/siem-parser-pack.json" },
            ],
          },
          {
            id: "security-3-2",
            title: "Automation with Python",
            type: "lab",
            duration: "40 min",
            description: "Use Python scripts to quarantine infected hosts via API.",
            videoUrl: "https://www.youtube.com/embed/cjdIIwUZsAg",
            resources: [
              { label: "GitHub Repo", url: "https://github.com/network-academy/automation-playbooks" },
            ],
          },
          {
            id: "security-3-3",
            title: "Alert Triage Workflow",
            type: "video",
            duration: "17 min",
            description: "See how analysts rank alerts, gather context, and communicate updates.",
            videoUrl: "https://www.youtube.com/embed/NdcL-dXDErU",
            resources: [
              { label: "Triage Template", url: "https://networkacademy.ke/resources/alert-triage-template.xlsx" },
            ],
          },
          {
            id: "security-3-4",
            title: "Automating Incident Response",
            type: "video",
            duration: "19 min",
            description: "Trigger SOAR playbooks and rollback changes during incidents.",
            videoUrl: "https://www.youtube.com/embed/fdqMRcCpDFk",
            resources: [
              { label: "SOAR Playbook", url: "https://networkacademy.ke/resources/soar-playbook.pdf" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "network-automation-pro",
    slug: "network-automation-pro",
    title: "Network Automation & Programmability",
    level: "Advanced",
    summary: "Automate repetitive tasks and orchestrate complex networks using Python and APIs.",
    description:
      "Move beyond manual configuration with an automation toolkit that covers Python, REST APIs, Netmiko, Nornir, and Ansible. Learn how to design idempotent workflows, validate changes automatically, and roll out updates at scale.",
    duration: "8-10 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/OsHFLvCV_cs",
    outcomes: [
      "Write Python scripts that gather inventory and push network changes",
      "Interact with vendor APIs to automate configuration and monitoring",
      "Design source-of-truth driven workflows using Git and CI/CD",
      "Deploy Ansible playbooks that enforce consistent configurations",
    ],
    prerequisites: [
      "Routing & Switching Essentials or equivalent",
      "Comfort with Python basics (variables, loops, functions)",
    ],
    modules: [
      {
        id: "automation-1",
        title: "Python Foundations for Networking",
        description: "Refresh Python skills with a focus on parsing configs, working with APIs, and handling data.",
        lessons: [
          {
            id: "automation-1-1",
            title: "Working with Network Data Structures",
            type: "video",
            duration: "24 min",
            description: "Use dictionaries and dataclasses to model devices, interfaces, and policies.",
            videoUrl: "https://www.youtube.com/embed/sG_RiytUA38",
            resources: [
              { label: "Starter Repo", url: "https://github.com/network-academy/python-foundations" },
            ],
          },
          {
            id: "automation-1-2",
            title: "REST APIs with Python",
            type: "lab",
            duration: "35 min",
            description: "Authenticate to network controllers and retrieve telemetry using requests and httpx.",
            videoUrl: "https://www.youtube.com/embed/3aAI1FuYTY4",
            resources: [
              { label: "Lab Workbook", url: "https://networkacademy.ke/labs/api-automation-guide.pdf" },
              { label: "Postman Collection", url: "https://networkacademy.ke/labs/controller-api.postman_collection.json" },
            ],
          },
          {
            id: "automation-1-3",
            title: "Quiz: Python Automation Patterns",
            type: "quiz",
            duration: "12 min",
            description: "Validate your understanding of key Python concepts used in automation workflows.",
            videoUrl: "https://www.youtube.com/embed/VUTl8YdNtwE",
            resources: [
              { label: "Cheat Sheet", url: "https://networkacademy.ke/resources/python-automation-cheatsheet.pdf" },
            ],
          },
          {
            id: "automation-1-4",
            title: "Python Tips for Network Engineers",
            type: "video",
            duration: "20 min",
            description: "Level up your Python with data parsing, error handling, and environment management.",
            videoUrl: "https://www.youtube.com/embed/qw90M5imec4",
            resources: [
              { label: "Code Samples", url: "https://networkacademy.ke/resources/python-network-snippets.zip" },
            ],
          },
        ],
      },
      {
        id: "automation-2",
        title: "Network Device Automation",
        description: "Apply automation frameworks to push changes, gather state, and remediate issues.",
        lessons: [
          {
            id: "automation-2-1",
            title: "Configuration Management with Netmiko & Scrapli",
            type: "video",
            duration: "26 min",
            description: "Use Netmiko and Scrapli to interact with CLI devices, push configs, and parse results.",
            videoUrl: "https://www.youtube.com/embed/xRwzFas7mOk",
            resources: [
              { label: "Device Scripts", url: "https://networkacademy.ke/resources/netmiko-scrapli-scripts.zip" },
            ],
          },
          {
            id: "automation-2-2",
            title: "Source of Truth with Nornir",
            type: "lab",
            duration: "40 min",
            description: "Build an inventory, run parallel tasks, and validate changes using Nornir and napalm.",
            videoUrl: "https://www.youtube.com/embed/NnbtTZyQXkg",
            resources: [
              { label: "Nornir Inventory", url: "https://networkacademy.ke/labs/nornir-inventory.zip" },
            ],
          },
          {
            id: "automation-2-3",
            title: "Automated Testing with PyTest",
            type: "reading",
            duration: "18 min",
            description: "Integrate PyTest assertions to confirm intent before and after automation runs.",
            videoUrl: "https://www.youtube.com/embed/2_tZVWMVEUQ",
            resources: [
              { label: "PyTest Templates", url: "https://networkacademy.ke/resources/network-pytest-templates.zip" },
            ],
          },
          {
            id: "automation-2-4",
            title: "Scrapli Deep Dive",
            type: "video",
            duration: "24 min",
            description: "Explore fast, asynchronous network automation with Scrapli core and driver plugins.",
            videoUrl: "https://www.youtube.com/embed/gGaE204_-Lo",
            resources: [
              { label: "Scrapli Examples", url: "https://networkacademy.ke/resources/scrapli-examples.zip" },
            ],
          },
        ],
      },
      {
        id: "automation-3",
        title: "Workflow Orchestration",
        description: "Package automation into reusable pipelines with Ansible and CI/CD.",
        lessons: [
          {
            id: "automation-3-1",
            title: "Ansible Playbooks for Network Changes",
            type: "video",
            duration: "28 min",
            description: "Create idempotent playbooks for IOS, Junos, and MikroTik using best practices.",
            videoUrl: "https://www.youtube.com/embed/MrKUe8wd_-c",
            resources: [
              { label: "Ansible Collection", url: "https://networkacademy.ke/resources/network-ansible-collection.tar.gz" },
            ],
          },
          {
            id: "automation-3-2",
            title: "Continuous Delivery for Networks",
            type: "reading",
            duration: "22 min",
            description: "Design pipelines with GitHub Actions or GitLab CI to test and deploy network changes.",
            videoUrl: "https://www.youtube.com/embed/JtuSMGw6x5o",
            resources: [
              { label: "Pipeline Blueprint", url: "https://networkacademy.ke/resources/network-cicd-blueprint.pdf" },
            ],
          },
          {
            id: "automation-3-3",
            title: "Lab: Rollback Strategy",
            type: "lab",
            duration: "45 min",
            description: "Implement automated rollback across multiple regions using Ansible and Git.",
            videoUrl: "https://www.youtube.com/embed/CPzGhn2AIDM",
            resources: [
              { label: "Rollback Lab", url: "https://networkacademy.ke/labs/rollback-strategy.zip" },
            ],
          },
          {
            id: "automation-3-4",
            title: "Ansible Network Automation Demo",
            type: "video",
            duration: "25 min",
            description: "See a complete Ansible pipeline push changes, validate state, and document results.",
            videoUrl: "https://www.youtube.com/embed/2W_YE0fZs88",
            resources: [
              { label: "Playbook Bundle", url: "https://networkacademy.ke/resources/ansible-bundle.zip" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "carrier-network-operations",
    slug: "carrier-network-operations",
    title: "Carrier-Grade Network Operations",
    level: "Expert",
    summary: "Operate and optimize ISP-scale networks with advanced routing, telemetry, and automation.",
    description:
      "Take command of large-scale service provider environments. Design resilient MPLS cores, engineer traffic with segment routing, and build observability pipelines that keep customers online.",
    duration: "10-12 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/_CRatGf2v6Q",
    outcomes: [
      "Design MPLS and segment routing architectures for multi-region deployments",
      "Engineer traffic flows using TE, QoS, and fast reroute techniques",
      "Automate provisioning across backbone, aggregation, and access layers",
      "Build observability dashboards that surface customer-impacting events in real time",
    ],
    prerequisites: [
      "Network Automation & Programmability or equivalent",
      "Strong understanding of BGP, MPLS, and SDN controllers",
    ],
    modules: [
      {
        id: "carrier-1",
        title: "Core Architecture & Traffic Engineering",
        description: "Engineer a resilient backbone using MPLS, segment routing, and traffic engineering.",
        lessons: [
          {
            id: "carrier-1-1",
            title: "MPLS & Segment Routing Design",
            type: "video",
            duration: "30 min",
            description: "Compare LDP, RSVP-TE, and SR-MPLS for scaling multi-domain carrier networks.",
            videoUrl: "https://www.youtube.com/embed/fd6z96oaolY",
            resources: [
              { label: "Design Workbook", url: "https://networkacademy.ke/resources/mpls-sr-design-workbook.pdf" },
            ],
          },
          {
            id: "carrier-1-2",
            title: "Traffic Engineering Lab",
            type: "lab",
            duration: "50 min",
            description: "Use SR-TE policies and Fast Reroute to guarantee latency and protect against failures.",
            videoUrl: "https://www.youtube.com/embed/yzZ8ir1rDGs",
            resources: [
              { label: "SR-TE Lab", url: "https://networkacademy.ke/labs/segment-routing-te.zip" },
            ],
          },
          {
            id: "carrier-1-3",
            title: "Quiz: SLA Driven Design",
            type: "quiz",
            duration: "15 min",
            description: "Validate your ability to map customer SLAs to routing policy and redundancy decisions.",
            videoUrl: "https://www.youtube.com/embed/gRfvCIJ8jfA",
            resources: [
              { label: "SLA Template", url: "https://networkacademy.ke/resources/sla-template.docx" },
            ],
          },
          {
            id: "carrier-1-4",
            title: "Segment Routing Lab Walkthrough",
            type: "video",
            duration: "28 min",
            description: "Follow a live SR-MPLS configuration with topology validation and failover tests.",
            videoUrl: "https://www.youtube.com/embed/9XT2ckzW1TE",
            resources: [
              { label: "Lab Notes", url: "https://networkacademy.ke/resources/sr-mpls-lab-notes.pdf" },
            ],
          },
        ],
      },
      {
        id: "carrier-2",
        title: "Service Edge & Customer Delivery",
        description: "Provision services at the edge while maintaining security, QoS, and automation hooks.",
        lessons: [
          {
            id: "carrier-2-1",
            title: "BGP Policy Automation",
            type: "video",
            duration: "27 min",
            description: "Program route policies using YANG/NETCONF and controller-driven provisioning.",
            videoUrl: "https://www.youtube.com/embed/dBzitnY-OIE",
            resources: [
              { label: "Policy Templates", url: "https://networkacademy.ke/resources/bgp-policy-templates.zip" },
            ],
          },
          {
            id: "carrier-2-2",
            title: "Edge Service Lab",
            type: "lab",
            duration: "45 min",
            description: "Deliver L3VPN and broadband services with automated turn-up and QoS enforcement.",
            videoUrl: "https://www.youtube.com/embed/yV31DbzuZVY",
            resources: [
              { label: "Service Turn-up Lab", url: "https://networkacademy.ke/labs/carrier-edge-lab.zip" },
            ],
          },
          {
            id: "carrier-2-3",
            title: "Reading: Secure Customer Onboarding",
            type: "reading",
            duration: "20 min",
            description: "Implement MACsec, DHCP snooping, and subscriber policies for last-mile protection.",
            videoUrl: "https://www.youtube.com/embed/112qN8vmQHI",
            resources: [
              { label: "Security Playbook", url: "https://networkacademy.ke/resources/customer-onboarding-playbook.pdf" },
            ],
          },
          {
            id: "carrier-2-4",
            title: "Automating BGP Edge Policies",
            type: "video",
            duration: "24 min",
            description: "See a controller push BGP communities, QoS, and ACL updates to PE routers.",
            videoUrl: "https://www.youtube.com/embed/PpiXmEtsQlM",
            resources: [
              { label: "Automation Blueprint", url: "https://networkacademy.ke/resources/carrier-automation-blueprint.pdf" },
            ],
          },
        ],
      },
      {
        id: "carrier-3",
        title: "Observability & Operations",
        description: "Instrument the network with streaming telemetry, automation hooks, and incident response.",
        lessons: [
          {
            id: "carrier-3-1",
            title: "Streaming Telemetry Pipelines",
            type: "video",
            duration: "25 min",
            description: "Collect model-driven telemetry and push it into time-series databases for analytics.",
            videoUrl: "https://www.youtube.com/embed/S1K26-2wG8w",
            resources: [
              { label: "Telemetry Stack", url: "https://networkacademy.ke/resources/telemetry-stack-compose.yaml" },
            ],
          },
          {
            id: "carrier-3-2",
            title: "Lab: Intent-Based Remediation",
            type: "lab",
            duration: "55 min",
            description: "Trigger automated remediation playbooks based on telemetry thresholds and alarms.",
            videoUrl: "https://www.youtube.com/embed/S1k41RMfieo",
            resources: [
              { label: "Remediation Playbooks", url: "https://networkacademy.ke/labs/intent-remediation.zip" },
            ],
          },
          {
            id: "carrier-3-3",
            title: "Quiz: Operations Excellence",
            type: "quiz",
            duration: "12 min",
            description: "Ensure you can prioritize incidents, communicate effectively, and document fixes.",
            videoUrl: "https://www.youtube.com/embed/DXtACpPQ-Kg",
            resources: [
              { label: "Operations Checklist", url: "https://networkacademy.ke/resources/operations-checklist.pdf" },
            ],
          },
          {
            id: "carrier-3-4",
            title: "Building NOC Dashboards",
            type: "video",
            duration: "22 min",
            description: "Design Grafana dashboards and alerts that highlight ISP health metrics.",
            videoUrl: "https://www.youtube.com/embed/P9p2MmAT3PA",
            resources: [
              { label: "Dashboard Pack", url: "https://networkacademy.ke/resources/noc-dashboard-pack.zip" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "wireless-design-specialist",
    slug: "wireless-design-specialist",
    title: "Enterprise Wireless Design Specialist",
    level: "Advanced",
    summary: "Plan, secure, and optimise high-density Wi-Fi deployments for modern enterprises.",
    description:
      "Master the full lifecycle of enterprise Wi-Fi from RF planning and spectrum analysis to WPA3 security, network assurance, and day-two operations. Build confidence delivering resilient wireless across campuses, hospitals, and logistics facilities.",
    duration: "6-8 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/7_LPdttKXPc",
    outcomes: [
      "Design Wi-Fi coverage and capacity plans aligned to business requirements",
      "Execute professional spectrum surveys and interpret heatmaps for action",
      "Roll out WPA3-Enterprise with RADIUS and certificate-based onboarding",
      "Operationalise wireless analytics to keep user experience consistently excellent",
    ],
    prerequisites: [
      "Routing & Switching Essentials or equivalent",
      "Comfort with basic RF concepts and site survey workflows",
    ],
    modules: [
      {
        id: "wireless-1",
        title: "RF Planning & Survey Execution",
        description: "Engineer reliable Wi-Fi coverage using professional survey tools and RF fundamentals.",
        lessons: [
          {
            id: "wireless-1-1",
            title: "RF Fundamentals for Wi-Fi Engineers",
            type: "video",
            duration: "19 min",
            description: "Clarify signal strength, SNR, and attenuation so you can design with confidence.",
            videoUrl: "https://www.youtube.com/embed/1NTzNPdCMJo",
            resources: [
              { label: "RF Design Workbook", url: "https://networkacademy.ke/resources/rf-design-workbook.pdf" },
              { label: "Link Budget Template", url: "https://networkacademy.ke/resources/link-budget-template.xlsx" },
            ],
          },
          {
            id: "wireless-1-2",
            title: "Hands-on: Spectrum Analysis Lab",
            type: "lab",
            duration: "30 min",
            description: "Use a spectrum analyser to spot interference and validate channel allocations.",
            videoUrl: "https://www.youtube.com/embed/z7MyR8im-IE",
            resources: [
              { label: "Interference Checklist", url: "https://networkacademy.ke/resources/interference-checklist.pdf" },
            ],
          },
          {
            id: "wireless-1-3",
            title: "Channel Planning Workshop",
            type: "reading",
            duration: "20 min",
            description: "Develop 2.4/5/6 GHz channel reuse plans for high-density venues.",
            videoUrl: "https://www.youtube.com/embed/Yz7UPY_dX_I",
            resources: [
              { label: "Channel Planner", url: "https://networkacademy.ke/tools/channel-planner" },
              { label: "Venue Survey Template", url: "https://networkacademy.ke/resources/venue-survey-template.docx" },
            ],
          },
          {
            id: "wireless-1-4",
            title: "Ekahau Survey Walkthrough",
            type: "video",
            duration: "24 min",
            description: "Follow a full Ekahau survey workflow from floorplans to visualisations.",
            videoUrl: "https://www.youtube.com/embed/34MBRCns67E",
            resources: [
              { label: "Survey Checklist", url: "https://networkacademy.ke/resources/ekahau-survey-checklist.pdf" },
            ],
          },
        ],
      },
      {
        id: "wireless-2",
        title: "Secure Enterprise WLAN",
        description: "Implement WPA3-Enterprise, certificate onboarding, and policy-based access.",
        lessons: [
          {
            id: "wireless-2-1",
            title: "WPA3-Enterprise Deep Dive",
            type: "video",
            duration: "28 min",
            description: "Understand SAE, PMF, and transition modes for modern secure Wi-Fi.",
            videoUrl: "https://www.youtube.com/embed/o4AfWbkKvB8",
            resources: [
              { label: "Security Design Guide", url: "https://networkacademy.ke/resources/wpa3-design-guide.pdf" },
            ],
          },
          {
            id: "wireless-2-2",
            title: "Lab: RADIUS Onboarding Automation",
            type: "lab",
            duration: "45 min",
            description: "Configure FreeRADIUS with Azure AD and automate certificate provisioning.",
            videoUrl: "https://www.youtube.com/embed/80C8dxnPZGM",
            resources: [
              { label: "Lab Files", url: "https://networkacademy.ke/labs/radius-onboarding.zip" },
              { label: "Automation Playbook", url: "https://networkacademy.ke/resources/wpa3-automation-playbook.pdf" },
            ],
          },
          {
            id: "wireless-2-3",
            title: "Wi-Fi 6E Roaming Strategies",
            type: "reading",
            duration: "18 min",
            description: "Tune roaming thresholds and 6 GHz client steering for uninterrupted mobility.",
            videoUrl: "https://www.youtube.com/embed/F073caS3Hlw",
            resources: [
              { label: "Roaming Checklist", url: "https://networkacademy.ke/resources/roaming-checklist.pdf" },
            ],
          },
        ],
      },
      {
        id: "wireless-3",
        title: "Operations & Optimisation",
        description: "Keep enterprise Wi-Fi performant with proactive analytics and automation.",
        lessons: [
          {
            id: "wireless-3-1",
            title: "AI-Assisted Wi-Fi Optimisation",
            type: "video",
            duration: "26 min",
            description: "Leverage Ekahau AI workflows to maintain optimal AP placement and tuning.",
            videoUrl: "https://www.youtube.com/embed/6gB6hpd-HGc",
            resources: [
              { label: "Optimisation Runbook", url: "https://networkacademy.ke/resources/wifi-optimisation-runbook.pdf" },
            ],
          },
          {
            id: "wireless-3-2",
            title: "Planning the Upgrade to Wi-Fi 6E",
            type: "reading",
            duration: "21 min",
            description: "Review spectrum, hardware, and policy updates required for 6 GHz adoption.",
            videoUrl: "https://www.youtube.com/embed/13jel6FHpYo",
            resources: [
              { label: "6E Upgrade Tracker", url: "https://networkacademy.ke/resources/wifi6e-upgrade-tracker.xlsx" },
            ],
          },
          {
            id: "wireless-3-3",
            title: "Troubleshooting Playbook",
            type: "lab",
            duration: "35 min",
            description: "Apply Wi-Fi troubleshooting workflows powered by spectrum and client analytics.",
            videoUrl: "https://www.youtube.com/embed/u0U2BqsD_6A",
            resources: [
              { label: "Troubleshooting Worksheet", url: "https://networkacademy.ke/resources/wifi-troubleshooting-worksheet.pdf" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cloud-networking-architect",
    slug: "cloud-networking-architect",
    title: "Cloud Networking Architect",
    level: "Expert",
    summary: "Design global multi-cloud networks, automate connectivity, and monitor experience end to end.",
    description:
      "Become the technical lead who connects hybrid data centres, cloud regions, and remote sites with policy-driven automation. This capstone track blends SD-WAN, Infrastructure as Code, SLOs, and executive communication skills.",
    duration: "8-10 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/8239pIsOT-M",
    outcomes: [
      "Architect resilient global transit across AWS, Azure, and Google Cloud",
      "Deploy SD-WAN fabrics integrated with cloud on-ramps and security service edge",
      "Automate network provisioning using Terraform, Ansible, and CI pipelines",
      "Instrument digital experience metrics and communicate value to stakeholders",
    ],
    prerequisites: [
      "Network Automation & Programmability or equivalent",
      "Comfort with at least one public cloud provider",
    ],
    modules: [
      {
        id: "cloud-1",
        title: "Multi-Cloud Foundations",
        description: "Connect VPCs/VNETs across providers with consistent policy and routing.",
        lessons: [
          {
            id: "cloud-1-1",
            title: "Designing Multi-Region VPC Fabrics",
            type: "video",
            duration: "32 min",
            description: "Model hub-and-spoke, full-mesh, and hybrid topologies for enterprise workloads.",
            videoUrl: "https://www.youtube.com/embed/Pd5p-fzwsLA",
            resources: [
              { label: "Architecture Diagram Pack", url: "https://networkacademy.ke/resources/multicloud-diagrams.zip" },
            ],
          },
          {
            id: "cloud-1-2",
            title: "Connectivity Patterns Across Providers",
            type: "reading",
            duration: "22 min",
            description: "Compare Azure Virtual WAN, AWS Cloud WAN, and Google NCC designs.",
            videoUrl: "https://www.youtube.com/embed/LH7mbcA-EY0",
            resources: [
              { label: "Pattern Comparison Sheet", url: "https://networkacademy.ke/resources/multicloud-patterns.xlsx" },
            ],
          },
          {
            id: "cloud-1-3",
            title: "Lab: Build a Global Transit Network",
            type: "lab",
            duration: "50 min",
            description: "Use automation to connect three cloud regions and on-prem via IPsec and direct links.",
            videoUrl: "https://www.youtube.com/embed/1XxtmYqtTdc",
            resources: [
              { label: "Lab Guide", url: "https://networkacademy.ke/labs/multicloud-transit-lab.zip" },
            ],
          },
        ],
      },
      {
        id: "cloud-2",
        title: "SD-WAN & Automation",
        description: "Blend SD-WAN fabrics with Infrastructure as Code to deliver repeatable outcomes.",
        lessons: [
          {
            id: "cloud-2-1",
            title: "SD-WAN Strategy Deep Dive",
            type: "video",
            duration: "27 min",
            description: "Evaluate controller architectures, policy models, and SASE integrations.",
            videoUrl: "https://www.youtube.com/embed/1SXpE08hvGs",
            resources: [
              { label: "SD-WAN Strategy Checklist", url: "https://networkacademy.ke/resources/sdwan-strategy-checklist.pdf" },
            ],
          },
          {
            id: "cloud-2-2",
            title: "Terraform Automation Pack",
            type: "lab",
            duration: "55 min",
            description: "Provision VPNs, cloud firewalls, and routing policies using Terraform modules.",
            videoUrl: "https://www.youtube.com/embed/AYWuRCQ48JQ",
            resources: [
              { label: "Terraform Modules", url: "https://networkacademy.ke/labs/terraform-network-pack.zip" },
              { label: "CI Pipeline Example", url: "https://networkacademy.ke/resources/network-ci-pipeline.yaml" },
            ],
          },
          {
            id: "cloud-2-3",
            title: "Quiz: Policy & Routing Blueprints",
            type: "quiz",
            duration: "15 min",
            description: "Validate your understanding of SD-WAN policy intent and failover strategies.",
            videoUrl: "https://www.youtube.com/embed/ANoUQNq1JH8",
            resources: [
              { label: "Answer Key", url: "https://networkacademy.ke/resources/sdwan-quiz-key.pdf" },
            ],
          },
        ],
      },
      {
        id: "cloud-3",
        title: "Observability & Executive Storytelling",
        description: "Measure digital experience and narrate outcomes to business stakeholders.",
        lessons: [
          {
            id: "cloud-3-1",
            title: "End-to-End Visibility with ThousandEyes",
            type: "video",
            duration: "23 min",
            description: "Instrument SaaS, internet, and WAN paths for proactive alerting.",
            videoUrl: "https://www.youtube.com/embed/nWsBQ9r4jQE",
            resources: [
              { label: "Monitoring Dashboard Pack", url: "https://networkacademy.ke/resources/cloud-visibility-dashboards.zip" },
            ],
          },
          {
            id: "cloud-3-2",
            title: "SLOs for Distributed Networks",
            type: "reading",
            duration: "20 min",
            description: "Define latency, jitter, and availability targets per application tier.",
            videoUrl: "https://www.youtube.com/embed/VAgT7CY572U",
            resources: [
              { label: "SLO Calculator", url: "https://networkacademy.ke/tools/network-slo-calculator" },
            ],
          },
          {
            id: "cloud-3-3",
            title: "Executive Readout Workshop",
            type: "video",
            duration: "18 min",
            description: "Tell the story of connectivity outcomes to leadership and customers.",
            videoUrl: "https://www.youtube.com/embed/MzpzJLBUZDc",
            resources: [
              { label: "Quarterly Review Template", url: "https://networkacademy.ke/resources/cloud-networking-qbr.pptx" },
            ],
          },
        ],
      },
    ],
  },
];

export const getCourseBySlug = (slug: string) => COURSES.find((course) => course.slug === slug);
