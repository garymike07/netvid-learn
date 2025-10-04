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
            resources: [
              { label: "Review Guide", url: "https://networkacademy.ke/resources/hardware-review-guide.pdf" },
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
            videoUrl: "https://www.youtube.com/embed/EBY-LzvOj_g",
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
            resources: [
              { label: "STP Troubleshooting Flowchart", url: "https://networkacademy.ke/resources/stp-troubleshooting.png" },
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
            videoUrl: "https://www.youtube.com/embed/HTQKk9MdQMI",
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
            resources: [
              { label: "SOC Checklist", url: "https://networkacademy.ke/resources/soc-checklist.pdf" },
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
            videoUrl: "https://www.youtube.com/embed/8U7-a7qUZ5A",
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
            resources: [
              { label: "GitHub Repo", url: "https://github.com/network-academy/automation-playbooks" },
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
    heroVideo: "https://www.youtube.com/embed/-LEPeGd7owg",
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
            videoUrl: "https://www.youtube.com/embed/bY2QJdfcVZQ",
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
            resources: [
              { label: "Cheat Sheet", url: "https://networkacademy.ke/resources/python-automation-cheatsheet.pdf" },
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
            videoUrl: "https://www.youtube.com/embed/faXnhuGV0Mw",
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
            resources: [
              { label: "PyTest Templates", url: "https://networkacademy.ke/resources/network-pytest-templates.zip" },
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
            videoUrl: "https://www.youtube.com/embed/xfw7b-HC8fQ",
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
            resources: [
              { label: "Rollback Lab", url: "https://networkacademy.ke/labs/rollback-strategy.zip" },
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
    heroVideo: "https://www.youtube.com/embed/3nWP3n2Vh6g",
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
            videoUrl: "https://www.youtube.com/embed/4oC4YxFzNnA",
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
            resources: [
              { label: "SLA Template", url: "https://networkacademy.ke/resources/sla-template.docx" },
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
            videoUrl: "https://www.youtube.com/embed/t9Dg-eCIiWY",
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
            resources: [
              { label: "Security Playbook", url: "https://networkacademy.ke/resources/customer-onboarding-playbook.pdf" },
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
            videoUrl: "https://www.youtube.com/embed/x5nXWynm6Vo",
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
            resources: [
              { label: "Operations Checklist", url: "https://networkacademy.ke/resources/operations-checklist.pdf" },
            ],
          },
        ],
      },
    ],
  },
];

export const getCourseBySlug = (slug: string) => COURSES.find((course) => course.slug === slug);
