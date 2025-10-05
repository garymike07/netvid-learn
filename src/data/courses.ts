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
  notes?: string[];
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
        notes: [
          "Connect core terms like nodes, links, and endpoints to familiar real-world systems so the language of networking feels intuitive.",
          "Compare LAN, WAN, MAN, and PAN scenarios to understand how scale influences design decisions and equipment choices.",
          "Recognize how reliable connectivity underpins business operations, community services, and everyday digital experiences in Kenya.",
        ],
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
        notes: [
          "Identify the purpose of each core device in a typical campus or branch network and when to select specialised hardware.",
          "Understand how wired and wireless segments interconnect, including PoE considerations and coverage planning for mixed environments.",
          "Apply preventative maintenance and lifecycle management practices that keep infrastructure resilient and cost effective.",
        ],
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
        notes: [
          "Trace how data moves from applications through the transport layer so troubleshooting commands make logical sense.",
          "Practice decoding packet captures to link symptoms like latency or drops back to specific protocol behaviours.",
          "Differentiate when UDP’s speed or TCP’s reliability delivers better user experiences in local services and cloud workloads.",
        ],
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
        notes: [
          "Design campus switching architectures that balance segmentation, security, and ease of management.",
          "Implement VLAN strategies that support voice, data, and IoT services without introducing broadcast storms.",
          "Tune spanning tree variants and link aggregation so redundancy never compromises stability or throughput.",
        ],
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
        notes: [
          "Select the right routing protocol mix based on organisational scale, convergence targets, and hardware capabilities.",
          "Practise route advertisement, summarisation, and authentication workflows used in production change windows.",
          "Interpret routing tables and protocol debug output to validate that traffic is following the intended design.",
        ],
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
        notes: [
          "Layer gateway redundancy, load sharing, and failover timers to keep user experiences stable during faults.",
          "Establish a repeatable troubleshooting playbook that accelerates mean time to resolution during incidents.",
          "Document post-incident findings so teams continuously harden the network against recurring issues.",
        ],
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
        notes: [
          "Map inbound and outbound traffic flows so firewall policies protect critical services without blocking business workflows.",
          "Integrate intrusion prevention, URL filtering, and threat intelligence feeds into a cohesive enforcement stack.",
          "Document change management steps that keep remote teams aligned when updating perimeter defences.",
        ],
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
        notes: [
          "Evaluate when to use site-to-site tunnels versus user VPNs based on workforce locations and application sensitivity.",
          "Combine identity, device health, and context signals to build Zero Trust access policies that scale globally.",
          "Prepare incident playbooks that outline containment, eradication, and recovery for compromised remote endpoints.",
        ],
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
        notes: [
          "Correlate telemetry from network, endpoint, and cloud platforms to shorten detection time.",
          "Leverage automation frameworks to enrich alerts and trigger scripted containment workflows.",
          "Measure SOC performance using metrics like MTTR and dwell time so improvements are data driven.",
        ],
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
        notes: [
          "Translate everyday networking tasks into Python scripts that read inventories and push intent.",
          "Work with structured data formats like JSON and YAML so automation can integrate with source-of-truth systems.",
          "Build confidence in Python error handling, virtual environments, and testing practices used by NetDevOps teams.",
        ],
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
        notes: [
          "Choose the right connection libraries for different vendors and manage credentials securely.",
          "Execute change windows with automated pre-check, deployment, and post-validation workflows.",
          "Capture device state programmatically so troubleshooting and compliance reporting are always current.",
        ],
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
        notes: [
          "Design multi-stage pipelines that test, deploy, and document network changes with minimal manual steps.",
          "Integrate configuration management with version control to maintain a reliable source of truth.",
          "Plan rollback and observability hooks so automation remains safe even in complex production environments.",
        ],
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
        notes: [
          "Design backbone topologies that deliver deterministic latency and rapid convergence for mission-critical services.",
          "Model traffic engineering policies that balance cost, capacity, and resilience across metro and long-haul links.",
          "Validate designs with lab simulations so migration plans de-risk production cutovers.",
        ],
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
        notes: [
          "Standardise customer turn-up workflows that scale to thousands of sites without sacrificing quality.",
          "Embed automation into BGP, QoS, and access control so policy changes propagate consistently.",
          "Protect the edge with operational guardrails that prevent misconfigurations from impacting shared infrastructure.",
        ],
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
        notes: [
          "Build telemetry pipelines that transform raw metrics into actionable intelligence for NOC teams.",
          "Automate remediation steps that restore service faster while keeping humans informed of progress.",
          "Establish operational scorecards and runbooks so customer experience stays central to every decision.",
        ],
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
        notes: [
          "Translate business requirements into RF design targets for coverage, capacity, and device density.",
          "Practice using predictive and onsite survey tools so channel plans are data driven.",
          "Document survey findings that inform installation teams and justify design decisions to stakeholders.",
        ],
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
        notes: [
          "Configure secure onboarding journeys for employees, contractors, and IoT devices without overwhelming the helpdesk.",
          "Align wireless security posture with corporate identity platforms and compliance frameworks.",
          "Plan for roaming, segmentation, and guest access while maintaining consistent enforcement end to end.",
        ],
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
        notes: [
          "Monitor key RF and client experience metrics to catch degradations before users complain.",
          "Apply AI-assisted insights and automation to continuously fine-tune configurations.",
          "Build troubleshooting guides that empower frontline support and accelerate escalations when needed.",
        ],
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
        notes: [
          "Assess connectivity options across AWS, Azure, and Google Cloud so architectures stay portable.",
          "Model routing domains and overlapping CIDR strategies that avoid asymmetric paths.",
          "Automate baseline connectivity so new regions and accounts can be added with minimal effort.",
        ],
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
        notes: [
          "Evaluate SD-WAN platform capabilities against enterprise governance and security requirements.",
          "Build Terraform-driven workflows that provision cloud and edge resources in a single change set.",
          "Integrate CI pipelines that continuously validate policy intent, failover, and performance baselines.",
        ],
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
        notes: [
          "Translate telemetry into user experience metrics executives care about.",
          "Set meaningful SLOs and automate alerting thresholds that focus teams on what matters.",
          "Craft executive narratives that connect network investments to revenue protection and customer trust.",
        ],
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
  {
    id: "cyber-operations-specialist",
    slug: "cyber-operations-specialist",
    title: "Cybersecurity Operations Specialist",
    level: "Advanced",
    summary: "Operate a modern Security Operations Center with automation-first practices and Kenyan threat context.",
    description:
      "Gain the skills to lead cyber defence operations, from building detection pipelines to coordinating incident response with executive stakeholders. Learn tooling and processes adopted by regional telcos, banks, and public agencies.",
    duration: "8-10 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/OHkWXFheSKM",
    outcomes: [
      "Design SOC playbooks that align MITRE ATT&CK detections with business priorities",
      "Deploy SIEM and SOAR integrations that reduce mean time to respond",
      "Lead coordinated incident response with clear communication and evidence handling",
      "Build cyber threat intelligence reporting tailored for African enterprises",
    ],
    prerequisites: [
      "Network Security Professional or equivalent",
      "Comfort with scripting in Python or PowerShell",
    ],
    modules: [
      {
        id: "cyber-ops-1",
        title: "Detection Engineering Foundations",
        description: "Instrument telemetry, craft detections, and validate coverage across hybrid environments.",
        notes: [
          "Inventory telemetry sources and map them to MITRE ATT&CK so detection coverage is intentional.",
          "Practice authoring analytics that balance fidelity, noise reduction, and operational simplicity.",
          "Establish validation routines that prove detections fire during purple-team or lab exercises.",
        ],
        lessons: [
          {
            id: "cyber-ops-1-1",
            title: "Mapping ATT&CK to Detection Use Cases",
            type: "video",
            duration: "22 min",
            description: "Translate attacker techniques into actionable detections with local threat intel overlays.",
            videoUrl: "https://www.youtube.com/embed/VNjIjrLGRk8",
            resources: [
              { label: "Detection Coverage Workbook", url: "https://networkacademy.ke/resources/detection-workbook.xlsx" },
            ],
          },
          {
            id: "cyber-ops-1-2",
            title: "Lab: Build Sigma Rules",
            type: "lab",
            duration: "40 min",
            description: "Author Sigma detections and push them into Elastic, Sentinel, and Splunk pipelines.",
            videoUrl: "https://www.youtube.com/embed/h8-Mnjq6EsU",
            resources: [
              { label: "Sigma Rule Pack", url: "https://networkacademy.ke/labs/sigma-rule-pack.zip" },
            ],
          },
          {
            id: "cyber-ops-1-3",
            title: "Quiz: Detection Engineering Patterns",
            type: "quiz",
            duration: "12 min",
            description: "Validate your ability to turn telemetry gaps into resilient detection logic.",
            videoUrl: "https://www.youtube.com/embed/5qvXR1V6LW0",
          },
          {
            id: "cyber-ops-1-4",
            title: "Threat Hunting Runbook",
            type: "reading",
            duration: "18 min",
            description: "Follow a structured hypothesis-driven hunt that surfaces stealthy adversaries.",
            videoUrl: "https://www.youtube.com/embed/a0FvmNkpVLI",
            resources: [
              { label: "Hunt Template", url: "https://networkacademy.ke/resources/threat-hunt-template.docx" },
            ],
          },
        ],
      },
      {
        id: "cyber-ops-2",
        title: "Incident Response & Automation",
        description: "Coordinate workflows, automate enrichment, and rehearse tabletop exercises.",
        notes: [
          "Design incident response processes that clarify roles, escalation paths, and communication expectations.",
          "Automate enrichment steps so analysts focus on decision-making rather than repetitive tasks.",
          "Run tabletop drills that expose process gaps and prepare leadership for real-world crises.",
        ],
        lessons: [
          {
            id: "cyber-ops-2-1",
            title: "SOAR Architecture Deep Dive",
            type: "video",
            duration: "24 min",
            description: "Compare Cortex XSOAR, Splunk SOAR, and Shuffle automations for Kenyan SOCs.",
            videoUrl: "https://www.youtube.com/embed/2cCwGQ2ZUVk",
            resources: [
              { label: "SOAR Playbook Catalogue", url: "https://networkacademy.ke/resources/soar-playbook-catalogue.pdf" },
            ],
          },
          {
            id: "cyber-ops-2-2",
            title: "Lab: Automate Phishing Response",
            type: "lab",
            duration: "45 min",
            description: "Build an automated workflow that triages phishing alerts and notifies stakeholders.",
            videoUrl: "https://www.youtube.com/embed/zKT8eT171j8",
            resources: [
              { label: "Playbook Files", url: "https://networkacademy.ke/labs/phishing-soar-playbook.zip" },
            ],
          },
          {
            id: "cyber-ops-2-3",
            title: "Tabletop Exercise Toolkit",
            type: "reading",
            duration: "20 min",
            description: "Facilitate ransomware tabletop drills with clear objectives and evaluation criteria.",
            videoUrl: "https://www.youtube.com/embed/k7MKERqbJWc",
            resources: [
              { label: "Tabletop Deck", url: "https://networkacademy.ke/resources/tabletop-exercise-deck.pptx" },
            ],
          },
        ],
      },
      {
        id: "cyber-ops-3",
        title: "Threat Intelligence & Reporting",
        description: "Transform raw indicators into strategic intelligence and executive-ready briefings.",
        notes: [
          "Prioritise intelligence requirements based on sector-specific risks and stakeholder needs.",
          "Operationalise feeds by enriching, deduplicating, and distributing intel to detection stacks quickly.",
          "Communicate trends and recommended actions clearly to executives, regulators, and partners.",
        ],
        lessons: [
          {
            id: "cyber-ops-3-1",
            title: "Operationalizing Threat Feeds",
            type: "video",
            duration: "21 min",
            description: "Prioritize feeds, normalize indicators, and push intel to detection stacks.",
            videoUrl: "https://www.youtube.com/embed/vJri4KTE3RM",
            resources: [
              { label: "Intel Processing Workbook", url: "https://networkacademy.ke/resources/threat-intel-workbook.xlsx" },
            ],
          },
          {
            id: "cyber-ops-3-2",
            title: "Quiz: Intelligence Requirements",
            type: "quiz",
            duration: "10 min",
            description: "Check your ability to align intelligence requests with stakeholder needs.",
            videoUrl: "https://www.youtube.com/embed/XfEQJk4Fff8",
          },
          {
            id: "cyber-ops-3-3",
            title: "Executive Briefing Template",
            type: "reading",
            duration: "16 min",
            description: "Communicate business impact, remediation status, and trending threats clearly.",
            videoUrl: "https://www.youtube.com/embed/yDZsM8vkHsY",
            resources: [
              { label: "Briefing Template", url: "https://networkacademy.ke/resources/cyber-executive-briefing.docx" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "datacenter-network-virtualization",
    slug: "datacenter-network-virtualization",
    title: "Data Center Networking & Virtualization",
    level: "Advanced",
    summary: "Design and automate high-performance data centers with VXLAN/EVPN, SDN fabrics, and modern tooling.",
    description:
      "From spine-leaf architectures to intent-based control, master the platforms that power contemporary data centers. Build repeatable automation, troubleshoot overlays, and integrate observability across on-prem and cloud edge locations.",
    duration: "9-11 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/oa6bZF6EpvQ",
    outcomes: [
      "Engineer resilient spine-leaf topologies with fabric automation",
      "Deploy VXLAN EVPN overlays with multivendor interoperability",
      "Integrate SDN controllers, telemetry, and automation pipelines",
      "Troubleshoot data center overlays using structured methodologies",
    ],
    prerequisites: [
      "Routing & Switching Essentials or equivalent",
      "Experience with Linux and basic scripting",
    ],
    modules: [
      {
        id: "dc-1",
        title: "Fabric Architecture & Design",
        description: "Plan leaf-spine fabrics, redundancy, and buffer profiles for diverse workloads.",
        notes: [
          "Design leaf-spine fabrics that align with application east-west traffic patterns and growth forecasts.",
          "Coordinate underlay addressing, ECMP, and redundancy so failures remain transparent to workloads.",
          "Automate initial fabric bring-up to reduce human error during device onboarding.",
        ],
        lessons: [
          {
            id: "dc-1-1",
            title: "Spine-Leaf Blueprint",
            type: "video",
            duration: "26 min",
            description: "Compare Clos fabrics, failure domains, and scale considerations for brownfield sites.",
            videoUrl: "https://www.youtube.com/embed/LYWMPE86EiQ",
            resources: [
              { label: "Design Templates", url: "https://networkacademy.ke/resources/spine-leaf-templates.zip" },
            ],
          },
          {
            id: "dc-1-2",
            title: "Lab: Fabric Bring-Up",
            type: "lab",
            duration: "45 min",
            description: "Automate device onboarding and underlay configuration using Ansible and Python.",
            videoUrl: "https://www.youtube.com/embed/IPaU-N7p4L0",
            resources: [
              { label: "Fabric Playbooks", url: "https://networkacademy.ke/labs/fabric-automation-playbooks.zip" },
            ],
          },
          {
            id: "dc-1-3",
            title: "Quiz: Resilient Fabric Patterns",
            type: "quiz",
            duration: "12 min",
            description: "Test your understanding of ECMP, buffering, and redundancy strategies.",
            videoUrl: "https://www.youtube.com/embed/oqrDtA9p_RI",
          },
        ],
      },
      {
        id: "dc-2",
        title: "VXLAN & EVPN Mastery",
        description: "Deploy multi-tenant overlays, route-types, and distributed anycast gateways.",
        notes: [
          "Translate tenant requirements into VRFs, VLANs, and VTEPs that scale cleanly.",
          "Understand EVPN route types deeply so troubleshooting overlay reachability becomes systematic.",
          "Integrate multi-vendor fabrics while maintaining consistent policy and control-plane behaviour.",
        ],
        lessons: [
          {
            id: "dc-2-1",
            title: "EVPN Route Types Explained",
            type: "video",
            duration: "24 min",
            description: "Deep dive into Type 2, 3, and 5 routes and their operational impact.",
            videoUrl: "https://www.youtube.com/embed/PpiXmEtsQlM",
            resources: [
              { label: "Route Type Cheat Sheet", url: "https://networkacademy.ke/resources/evpn-cheatsheet.pdf" },
            ],
          },
          {
            id: "dc-2-2",
            title: "Lab: VXLAN EVPN Interoperability",
            type: "lab",
            duration: "50 min",
            description: "Configure NX-OS and Junos devices to exchange EVPN routes and validate connectivity.",
            videoUrl: "https://www.youtube.com/embed/Khm1ZPpbtf4",
            resources: [
              { label: "Lab Files", url: "https://networkacademy.ke/labs/vxlan-evpn-interop.zip" },
            ],
          },
          {
            id: "dc-2-3",
            title: "Overlay Troubleshooting Playbook",
            type: "reading",
            duration: "18 min",
            description: "Use structured commands and telemetry to resolve MAC learning and BGP EVPN issues.",
            videoUrl: "https://www.youtube.com/embed/VKRVvfMJ4PY",
            resources: [
              { label: "Troubleshooting Flowchart", url: "https://networkacademy.ke/resources/vxlan-troubleshooting.pdf" },
            ],
          },
        ],
      },
      {
        id: "dc-3",
        title: "Automation & Observability",
        description: "Integrate controllers, telemetry, and CI/CD to sustain reliable data centers.",
        notes: [
          "Evaluate intent-based controllers and decide when to centralise versus distribute automation logic.",
          "Build telemetry pipelines that capture fabric health, capacity trends, and anomaly signals.",
          "Embed CI/CD practices that validate configurations before deployment and monitor outcomes after changes.",
        ],
        lessons: [
          {
            id: "dc-3-1",
            title: "Intent-Based Fabric Controllers",
            type: "video",
            duration: "23 min",
            description: "Explore Cisco DCNM, Arista CloudVision, and Apstra intent workflows.",
            videoUrl: "https://www.youtube.com/embed/TuRv_fyWtBA",
            resources: [
              { label: "Controller Comparison", url: "https://networkacademy.ke/resources/fabric-controller-comparison.xlsx" },
            ],
          },
          {
            id: "dc-3-2",
            title: "Lab: Telemetry Pipeline",
            type: "lab",
            duration: "40 min",
            description: "Stream model-driven telemetry into InfluxDB and Grafana for real time insight.",
            videoUrl: "https://www.youtube.com/embed/fnoTHoZzNSc",
            resources: [
              { label: "Telemetry Stack", url: "https://networkacademy.ke/labs/datacenter-telemetry-stack.zip" },
            ],
          },
          {
            id: "dc-3-3",
            title: "Quiz: Automation Strategy",
            type: "quiz",
            duration: "11 min",
            description: "Reinforce CI/CD, source-of-truth, and validation concepts for Day 2 operations.",
            videoUrl: "https://www.youtube.com/embed/JtuSMGw6x5o",
          },
        ],
      },
    ],
  },
  {
    id: "iot-industrial-networking",
    slug: "iot-industrial-networking",
    title: "IoT & Industrial Networking",
    level: "Intermediate",
    summary: "Connect and secure industrial IoT deployments from factories to smart agriculture sites across Africa.",
    description:
      "Bridge operational technology and IT securely. Learn fieldbus fundamentals, edge computing, and remote monitoring approaches tailored for power, manufacturing, and logistics sectors.",
    duration: "6-8 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/RKwwP4XsZdw",
    outcomes: [
      "Design resilient IoT network architectures that span harsh environments",
      "Implement secure onboarding and segmentation for sensors and controllers",
      "Operationalize edge analytics and telemetry pipelines",
      "Coordinate with OT teams to maintain uptime and safety",
    ],
    prerequisites: [
      "Network Foundations or equivalent",
      "Basic understanding of industrial control systems",
    ],
    modules: [
      {
        id: "iot-1",
        title: "Industrial Connectivity Basics",
        description: "Understand the protocols, media, and environmental considerations unique to OT networks.",
        notes: [
          "Select physical media, connectors, and protocols that survive vibration, dust, and extreme temperatures.",
          "Bridge legacy fieldbus systems with modern Ethernet to support gradual modernisation projects.",
          "Plan for redundant paths and power to keep production lines running during maintenance or failure.",
        ],
        lessons: [
          {
            id: "iot-1-1",
            title: "Fieldbus vs Ethernet-APL",
            type: "video",
            duration: "20 min",
            description: "Compare MODBUS, PROFINET, and Ethernet-APL deployments with real Kenyan case studies.",
            videoUrl: "https://www.youtube.com/embed/x6WGadify2E",
            resources: [
              { label: "Protocol Decision Matrix", url: "https://networkacademy.ke/resources/fieldbus-decision-matrix.pdf" },
            ],
          },
          {
            id: "iot-1-2",
            title: "Lab: Build an Edge Gateway",
            type: "lab",
            duration: "35 min",
            description: "Deploy a ruggedized gateway, bridge sensors via MQTT, and forward data securely.",
            videoUrl: "https://www.youtube.com/embed/SVwApYn826g",
            resources: [
              { label: "Gateway Config Pack", url: "https://networkacademy.ke/labs/edge-gateway-config.zip" },
            ],
          },
          {
            id: "iot-1-3",
            title: "Quiz: Industrial Topologies",
            type: "quiz",
            duration: "10 min",
            description: "Test your knowledge of ring, linear, and redundant star topologies in OT settings.",
            videoUrl: "https://www.youtube.com/embed/6K2Y_sp5f4o",
          },
        ],
      },
      {
        id: "iot-2",
        title: "Security & Segmentation",
        description: "Implement policies that isolate critical assets while enabling remote support.",
        notes: [
          "Apply Zero Trust concepts to OT environments while respecting safety constraints and vendor support needs.",
          "Segment networks into zones and conduits that align with IEC 62443 and local regulatory expectations.",
          "Automate policy enforcement so remote engineers and contractors access only what they require.",
        ],
        lessons: [
          {
            id: "iot-2-1",
            title: "Zero Trust for OT",
            type: "video",
            duration: "22 min",
            description: "Adapt Zero Trust principles for industrial plants and smart infrastructure.",
            videoUrl: "https://www.youtube.com/embed/-Swf2fu6ESE",
            resources: [
              { label: "Security Blueprint", url: "https://networkacademy.ke/resources/ot-security-blueprint.pdf" },
            ],
          },
          {
            id: "iot-2-2",
            title: "Reading: Segmenting OT Networks",
            type: "reading",
            duration: "18 min",
            description: "Plan zones, conduits, and DMZs that satisfy IEC 62443 requirements.",
            videoUrl: "https://www.youtube.com/embed/CUwBMAo3_UE",
            resources: [
              { label: "Segmentation Checklist", url: "https://networkacademy.ke/resources/ot-segmentation-checklist.pdf" },
            ],
          },
          {
            id: "iot-2-3",
            title: "Lab: Policy Enforcement",
            type: "lab",
            duration: "40 min",
            description: "Use software-defined segmentation to isolate PLCs and enforce least privilege access.",
            videoUrl: "https://www.youtube.com/embed/lGUnD6Wqigg",
            resources: [
              { label: "Policy Templates", url: "https://networkacademy.ke/labs/ot-policy-pack.zip" },
            ],
          },
        ],
      },
      {
        id: "iot-3",
        title: "Operations & Analytics",
        description: "Keep deployments observable, proactive, and aligned with business KPIs.",
        notes: [
          "Architect edge analytics pipelines that reduce bandwidth usage while surfacing actionable insights.",
          "Integrate predictive maintenance alerts with OT and IT ticketing workflows for faster interventions.",
          "Report on uptime, quality, and energy efficiency so IoT initiatives prove their business value.",
        ],
        lessons: [
          {
            id: "iot-3-1",
            title: "Edge Analytics Pipeline",
            type: "video",
            duration: "19 min",
            description: "Process telemetry at the edge, publish to cloud, and trigger maintenance workflows.",
            videoUrl: "https://www.youtube.com/embed/naNW7bM0Qx8",
            resources: [
              { label: "Analytics Runbook", url: "https://networkacademy.ke/resources/iot-analytics-runbook.pdf" },
            ],
          },
          {
            id: "iot-3-2",
            title: "Quiz: OT Monitoring KPIs",
            type: "quiz",
            duration: "9 min",
            description: "Ensure you can link telemetry metrics to operational goals and downtime prevention.",
            videoUrl: "https://www.youtube.com/embed/RKwwP4XsZdw",
          },
          {
            id: "iot-3-3",
            title: "Reading: Vendor Lifecycle Management",
            type: "reading",
            duration: "17 min",
            description: "Coordinate firmware updates, supplier audits, and third-party access reviews.",
            videoUrl: "https://www.youtube.com/embed/kv0eTobemug",
            resources: [
              { label: "Lifecycle Tracker", url: "https://networkacademy.ke/resources/vendor-lifecycle-tracker.xlsx" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "edge-5g-engineering",
    slug: "edge-5g-engineering",
    title: "5G & Edge Network Engineering",
    level: "Advanced",
    summary: "Design and operate 5G RAN, transport, and edge computing solutions tailored for African deployments.",
    description:
      "Gain hands-on expertise with 5G radio access networks, mobile edge compute, and slice orchestration. Learn how to integrate private 5G, neutral host, and telco edge services to deliver low-latency applications.",
    duration: "8-10 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/ONkZepCxPw0",
    outcomes: [
      "Model 5G RAN architectures including massive MIMO, small cells, and fronthaul options",
      "Deploy mobile edge compute platforms that host latency-sensitive workloads",
      "Automate network slicing and QoS assurance for enterprise and consumer use cases",
      "Integrate observability pipelines that track subscriber experience in real time",
    ],
    prerequisites: [
      "Routing & Switching Essentials or equivalent",
      "Familiarity with virtualization and cloud fundamentals",
    ],
    modules: [
      {
        id: "edge-5g-1",
        title: "5G RAN Architecture",
        description: "Understand 5G NR components, spectrum strategies, and transport requirements.",
        notes: [
          "Assess spectrum assets, radio options, and transport needs for private and public 5G deployments.",
          "Plan radio placement, fronthaul, and midhaul options that balance cost with performance targets.",
          "Document design decisions so regulators, partners, and customers understand coverage commitments.",
        ],
        lessons: [
          {
            id: "edge-5g-1-1",
            title: "5G NR Fundamentals",
            type: "video",
            duration: "24 min",
            description: "Explore gNodeB splits, beamforming, and spectrum options for regional deployments.",
            videoUrl: "https://www.youtube.com/embed/BIb2QerOW6w",
            resources: [
              { label: "RAN Planning Workbook", url: "https://networkacademy.ke/resources/5g-ran-planning.xlsx" },
            ],
          },
          {
            id: "edge-5g-1-2",
            title: "Lab: Design a Private 5G Site",
            type: "lab",
            duration: "40 min",
            description: "Use coverage tools to position radios, plan transport, and budget capacity.",
            videoUrl: "https://www.youtube.com/embed/M4nDslHDOYw",
            resources: [
              { label: "Site Survey Pack", url: "https://networkacademy.ke/labs/private-5g-survey.zip" },
            ],
          },
          {
            id: "edge-5g-1-3",
            title: "Quiz: RAN Design Decisions",
            type: "quiz",
            duration: "12 min",
            description: "Validate trade-offs between centralized vs distributed RAN, spectrum, and capacity.",
            videoUrl: "https://www.youtube.com/embed/Uv71s-Ac3aI",
          },
        ],
      },
      {
        id: "edge-5g-2",
        title: "Edge Compute & Core Integration",
        description: "Deploy MEC platforms, integrate with 5G core, and host low-latency applications.",
        notes: [
          "Evaluate MEC deployment models and choose where to host workloads for optimal latency.",
          "Integrate edge platforms with the 5G core so policy, charging, and routing remain consistent.",
          "Package applications in containers and orchestrate them to scale reliably across distributed sites.",
        ],
        lessons: [
          {
            id: "edge-5g-2-1",
            title: "MEC Platform Deep Dive",
            type: "video",
            duration: "22 min",
            description: "Compare ETSI MEC reference architecture with hyperscaler edge offerings.",
            videoUrl: "https://www.youtube.com/embed/G-r4eBwcAA8",
            resources: [
              { label: "MEC Reference Guide", url: "https://networkacademy.ke/resources/mec-reference-guide.pdf" },
            ],
          },
          {
            id: "edge-5g-2-2",
            title: "Lab: Deploy Edge Applications",
            type: "lab",
            duration: "45 min",
            description: "Containerize a video analytics workload and deploy it to a MEC cluster using Kubernetes.",
            videoUrl: "https://www.youtube.com/embed/hUjJ1eOukAU",
            resources: [
              { label: "Edge App Bundle", url: "https://networkacademy.ke/labs/mec-app-bundle.zip" },
            ],
          },
          {
            id: "edge-5g-2-3",
            title: "Reading: 5G Core Integration",
            type: "reading",
            duration: "18 min",
            description: "Map service-based architecture, UPF placement, and policy control for MEC flows.",
            videoUrl: "https://www.youtube.com/embed/mYWZioCDRLo",
            resources: [
              { label: "Core Integration Checklist", url: "https://networkacademy.ke/resources/5g-core-integration.pdf" },
            ],
          },
        ],
      },
      {
        id: "edge-5g-3",
        title: "Network Slicing & Assurance",
        description: "Implement slice management, QoS enforcement, and experience monitoring.",
        notes: [
          "Map enterprise requirements into slice templates that define KPIs, QoS, and security policies.",
          "Automate slice lifecycle management so creation, modification, and teardown are repeatable.",
          "Monitor slice performance continuously and trigger closed-loop actions when service levels drift.",
        ],
        lessons: [
          {
            id: "edge-5g-3-1",
            title: "Slice Lifecycle Automation",
            type: "video",
            duration: "21 min",
            description: "Automate slice creation using orchestration APIs and policy templates.",
            videoUrl: "https://www.youtube.com/embed/mWamzIQjVMM",
            resources: [
              { label: "Slice Orchestration Templates", url: "https://networkacademy.ke/resources/slice-orchestration-templates.zip" },
            ],
          },
          {
            id: "edge-5g-3-2",
            title: "Lab: QoS Assurance",
            type: "lab",
            duration: "42 min",
            description: "Use telemetry and closed-loop automation to maintain SLA targets across slices.",
            videoUrl: "https://www.youtube.com/embed/CPBMBLeeD6g",
            resources: [
              { label: "Assurance Playbook", url: "https://networkacademy.ke/labs/5g-assurance-playbook.zip" },
            ],
          },
          {
            id: "edge-5g-3-3",
            title: "Quiz: SLA & Slicing Strategies",
            type: "quiz",
            duration: "11 min",
            description: "Ensure you can map enterprise requirements to slice KPIs and governance.",
            videoUrl: "https://www.youtube.com/embed/HquLa8t_qIw",
          },
        ],
      },
    ],
  },
  {
    id: "satellite-rural-connectivity",
    slug: "satellite-rural-connectivity",
    title: "Satellite & Rural Connectivity Architect",
    level: "Intermediate",
    summary: "Deliver reliable broadband across remote regions using VSAT, microwave, and community networks.",
    description:
      "Engineer connectivity solutions for underserved areas. Evaluate satellite constellations, design microwave backhaul, and build sustainable community networks while navigating regulatory and power constraints.",
    duration: "7-9 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/DVHVc9Td580",
    outcomes: [
      "Compare GEO, MEO, and LEO satellite offerings and design hybrid connectivity strategies",
      "Plan microwave and fiber backhaul for challenging terrain",
      "Launch and maintain community networks with sustainable business models",
      "Implement monitoring and support processes suited for remote operations",
    ],
    prerequisites: [
      "Network Foundations or equivalent",
      "Basic familiarity with RF planning and site surveys",
    ],
    modules: [
      {
        id: "sat-rural-1",
        title: "Satellite Connectivity Design",
        description: "Select satellite platforms, plan link budgets, and integrate with terrestrial networks.",
        notes: [
          "Compare orbit options to balance latency, throughput, and availability for remote communities.",
          "Build accurate link budgets that account for weather, power constraints, and equipment limitations.",
          "Integrate satellite access with terrestrial backhaul so users enjoy seamless connectivity.",
        ],
        lessons: [
          {
            id: "sat-rural-1-1",
            title: "Satellite Platform Comparison",
            type: "video",
            duration: "23 min",
            description: "Break down GEO, MEO, LEO, and HAPS pros/cons with African operator examples.",
            videoUrl: "https://www.youtube.com/embed/UCd3Tj-LWTA",
            resources: [
              { label: "Satellite Planner", url: "https://networkacademy.ke/resources/satellite-planner.xlsx" },
            ],
          },
          {
            id: "sat-rural-1-2",
            title: "Lab: VSAT Link Budget",
            type: "lab",
            duration: "35 min",
            description: "Calculate link budgets, select hardware, and align dishes for rural deployments.",
            videoUrl: "https://www.youtube.com/embed/a7Cn7M_MnBk",
            resources: [
              { label: "Link Budget Calculator", url: "https://networkacademy.ke/labs/vsat-link-budget.xlsx" },
            ],
          },
          {
            id: "sat-rural-1-3",
            title: "Quiz: Satellite Service Design",
            type: "quiz",
            duration: "11 min",
            description: "Verify your understanding of latency, throughput, and cost trade-offs.",
            videoUrl: "https://www.youtube.com/embed/NFc3oU_wq7I",
          },
        ],
      },
      {
        id: "sat-rural-2",
        title: "Microwave & Community Networks",
        description: "Plan terrestrial backhaul and grassroots connectivity initiatives.",
        notes: [
          "Design microwave paths that overcome challenging terrain using careful site surveys and profiling.",
          "Develop community network governance models that keep operations transparent and sustainable.",
          "Combine multiple access technologies to deliver resilient connectivity across dispersed locations.",
        ],
        lessons: [
          {
            id: "sat-rural-2-1",
            title: "Microwave Backhaul Planning",
            type: "video",
            duration: "24 min",
            description: "Design point-to-point and point-to-multipoint links with path profiling tools.",
            videoUrl: "https://www.youtube.com/embed/YoAzWNyGK8Q",
            resources: [
              { label: "Path Profile Toolkit", url: "https://networkacademy.ke/resources/microwave-path-profile.zip" },
            ],
          },
          {
            id: "sat-rural-2-2",
            title: "Reading: Community Network Playbook",
            type: "reading",
            duration: "20 min",
            description: "Build a governance model, funding strategy, and volunteer network for community ISPs.",
            videoUrl: "https://www.youtube.com/embed/puL3tfGi_8w",
            resources: [
              { label: "Community Network Playbook", url: "https://networkacademy.ke/resources/community-network-playbook.pdf" },
            ],
          },
          {
            id: "sat-rural-2-3",
            title: "Lab: Hybrid Backhaul Design",
            type: "lab",
            duration: "40 min",
            description: "Combine microwave, satellite, and LTE to serve rural clinics and schools.",
            videoUrl: "https://www.youtube.com/embed/MpQsSAv5x10",
            resources: [
              { label: "Design Workbook", url: "https://networkacademy.ke/labs/hybrid-backhaul-workbook.xlsx" },
            ],
          },
        ],
      },
      {
        id: "sat-rural-3",
        title: "Operations & Sustainability",
        description: "Keep remote networks operational with limited onsite support.",
        notes: [
          "Engineer energy systems that keep sites live despite unreliable grids or long maintenance windows.",
          "Establish support processes that empower local champions and streamline vendor escalations.",
          "Stay ahead of regulatory shifts and funding opportunities that impact rural projects.",
        ],
        lessons: [
          {
            id: "sat-rural-3-1",
            title: "Energy & Power Planning",
            type: "video",
            duration: "19 min",
            description: "Plan solar, battery, and generator mixes for off-grid network sites.",
            videoUrl: "https://www.youtube.com/embed/HvyHD2h4gok",
            resources: [
              { label: "Power Budget Template", url: "https://networkacademy.ke/resources/rural-power-budget.xlsx" },
            ],
          },
          {
            id: "sat-rural-3-2",
            title: "Quiz: Support Processes",
            type: "quiz",
            duration: "10 min",
            description: "Test readiness to manage spares, escalations, and community support channels.",
            videoUrl: "https://www.youtube.com/embed/28XRCZ7sghc",
          },
          {
            id: "sat-rural-3-3",
            title: "Reading: Regulatory & Policy",
            type: "reading",
            duration: "17 min",
            description: "Navigate licensing, spectrum policy, and universal service funding opportunities.",
            videoUrl: "https://www.youtube.com/embed/yg7E8W1cTxs",
            resources: [
              { label: "Regulatory Tracker", url: "https://networkacademy.ke/resources/rural-regulatory-tracker.xlsx" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "network-project-leadership",
    slug: "network-project-leadership",
    title: "Network Project Leadership & Compliance",
    level: "Advanced",
    summary: "Lead large-scale network initiatives with governance, compliance, and stakeholder excellence.",
    description:
      "Blend technical leadership with project governance. Learn to navigate regulatory audits, deliver compliant architectures, and communicate effectively with executives and partners.",
    duration: "6-8 weeks",
    isPremium: true,
    heroVideo: "https://www.youtube.com/embed/0X1FiNxlHh0",
    outcomes: [
      "Apply project governance frameworks to complex network programs",
      "Ensure compliance with standards such as ISO 27001, NIST, and local telecom regulations",
      "Build stakeholder communication plans that maintain trust and alignment",
      "Manage risk, procurement, and vendor performance throughout delivery",
    ],
    prerequisites: [
      "Two or more technical networking courses completed",
      "Experience participating in medium-size IT projects",
    ],
    modules: [
      {
        id: "leadership-1",
        title: "Governance & Frameworks",
        description: "Adopt structured project governance tailored for network programs.",
        notes: [
          "Select governance frameworks that align with technical delivery cadences and stakeholder expectations.",
          "Build stakeholder maps that keep regulators, executives, and partners aligned throughout delivery.",
          "Institute decision logs and steering rituals that maintain momentum across long-running programs.",
        ],
        lessons: [
          {
            id: "leadership-1-1",
            title: "Project Governance Foundations",
            type: "video",
            duration: "21 min",
            description: "Map PRINCE2, PMBOK, and Agile practices to network deployment realities.",
            videoUrl: "https://www.youtube.com/embed/5KT94veOQ_8",
            resources: [
              { label: "Governance Toolkit", url: "https://networkacademy.ke/resources/network-governance-toolkit.xlsx" },
            ],
          },
          {
            id: "leadership-1-2",
            title: "Reading: Stakeholder Mapping",
            type: "reading",
            duration: "16 min",
            description: "Identify sponsors, regulators, vendors, and users with influence-impact matrices.",
            videoUrl: "https://www.youtube.com/embed/bV9yUQV6D60",
            resources: [
              { label: "Stakeholder Template", url: "https://networkacademy.ke/resources/stakeholder-map-template.xlsx" },
            ],
          },
          {
            id: "leadership-1-3",
            title: "Quiz: Governance Scenarios",
            type: "quiz",
            duration: "10 min",
            description: "Challenge your ability to select governance approaches for different project types.",
            videoUrl: "https://www.youtube.com/embed/0X1FiNxlHh0",
          },
        ],
      },
      {
        id: "leadership-2",
        title: "Compliance & Risk Management",
        description: "Align architectures with standards and mitigate compliance risks.",
        notes: [
          "Interpret regulatory requirements and translate them into actionable technical controls.",
          "Run gap assessments that surface remediation priorities and budget implications early.",
          "Track risks, issues, and vendor obligations continuously to keep audits stress-free.",
        ],
        lessons: [
          {
            id: "leadership-2-1",
            title: "Regulatory Landscape Deep Dive",
            type: "video",
            duration: "23 min",
            description: "Understand telecom, data privacy, and cybersecurity regulations impacting networks.",
            videoUrl: "https://www.youtube.com/embed/EAgQ6u7ARIA",
            resources: [
              { label: "Compliance Checklist", url: "https://networkacademy.ke/resources/network-compliance-checklist.pdf" },
            ],
          },
          {
            id: "leadership-2-2",
            title: "Lab: Compliance Gap Analysis",
            type: "lab",
            duration: "38 min",
            description: "Perform a gap assessment against ISO 27001 and create remediation plans.",
            videoUrl: "https://www.youtube.com/embed/mlA87t688AQ",
            resources: [
              { label: "Gap Analysis Workbook", url: "https://networkacademy.ke/labs/compliance-gap-analysis.xlsx" },
            ],
          },
          {
            id: "leadership-2-3",
            title: "Reading: Risk Register Best Practices",
            type: "reading",
            duration: "18 min",
            description: "Craft actionable risk registers and escalation paths for network programs.",
            videoUrl: "https://www.youtube.com/embed/0RDgERPhN48",
            resources: [
              { label: "Risk Register Template", url: "https://networkacademy.ke/resources/network-risk-register.xlsx" },
            ],
          },
        ],
      },
      {
        id: "leadership-3",
        title: "Communication & Delivery Excellence",
        description: "Execute communication plans, manage vendors, and deliver measurable outcomes.",
        notes: [
          "Craft executive-ready communications that translate technical progress into business impact.",
          "Manage vendors with performance scorecards, governance cadences, and clear escalation paths.",
          "Track benefits realisation and lessons learned so future network programmes launch stronger.",
        ],
        lessons: [
          {
            id: "leadership-3-1",
            title: "Executive Communication Skills",
            type: "video",
            duration: "20 min",
            description: "Craft compelling narratives, dashboards, and briefings for leadership teams.",
            videoUrl: "https://www.youtube.com/embed/Fzi4T94QCjw",
            resources: [
              { label: "Executive Update Template", url: "https://networkacademy.ke/resources/executive-update-template.pptx" },
            ],
          },
          {
            id: "leadership-3-2",
            title: "Lab: Vendor Performance Review",
            type: "lab",
            duration: "35 min",
            description: "Assess vendor SLAs, track milestones, and prepare performance scorecards.",
            videoUrl: "https://www.youtube.com/embed/O_kJ6wtQDm4",
            resources: [
              { label: "Vendor Scorecard", url: "https://networkacademy.ke/labs/vendor-scorecard.xlsx" },
            ],
          },
          {
            id: "leadership-3-3",
            title: "Quiz: Communication & Delivery",
            type: "quiz",
            duration: "9 min",
            description: "Test your ability to respond to stakeholder scenarios and delivery challenges.",
            videoUrl: "https://www.youtube.com/embed/HAb9v-mCL6I",
          },
        ],
      },
    ],
  },
];

export const getCourseBySlug = (slug: string) => COURSES.find((course) => course.slug === slug);
