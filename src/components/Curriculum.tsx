import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const levels = [
  {
    level: "Level 1",
    title: "Foundations",
    badge: "Beginner",
    topics: [
      "What is a Network?",
      "Basic Networking Concepts",
      "Network Hardware",
      "How the Internet Works"
    ],
    duration: "4-6 weeks",
  },
  {
    level: "Level 2",
    title: "Core Concepts",
    badge: "Intermediate",
    topics: [
      "OSI Model Deep Dive",
      "TCP/IP Protocol Suite",
      "Ethernet and Switching",
      "Routing Fundamentals"
    ],
    duration: "6-8 weeks",
  },
  {
    level: "Level 3",
    title: "Advanced Fundamentals",
    badge: "Upper Intermediate",
    topics: [
      "Advanced IP Addressing",
      "Routing Protocols",
      "Network Services",
      "Wireless Networking"
    ],
    duration: "8-10 weeks",
  },
  {
    level: "Level 4",
    title: "Professional Topics",
    badge: "Advanced",
    topics: [
      "Network Security",
      "Quality of Service (QoS)",
      "MPLS & SD-WAN",
      "Cloud Networking"
    ],
    duration: "10-12 weeks",
  },
  {
    level: "Level 5",
    title: "Expert & Emerging",
    badge: "Expert",
    topics: [
      "Network Automation",
      "Advanced Security",
      "Performance Optimization",
      "Emerging Technologies"
    ],
    duration: "12+ weeks",
  },
];

const Curriculum = () => {
  return (
    <section id="curriculum" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 85% 20%, hsla(278,97%,72%,0.2), transparent 55%)" }} />
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center motion-safe:animate-fade-up">
          <h2 className="mb-4 text-4xl font-semibold text-foreground md:text-5xl">Complete Learning Path</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Progress through 5 structured levels, each with video tutorials, written content, and hands-on labs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level, index) => (
            <Card key={index} className="group overflow-hidden p-6 motion-safe:animate-fade-up" style={{ animationDelay: `${0.09 * index}s` }}>
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-14 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-70 transition-transform duration-500 group-hover:scale-110" />

              <CardHeader className="relative space-y-3 p-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{level.level}</span>
                  <Badge variant="secondary" className="border border-white/10 bg-white/5">
                    {level.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{level.title}</CardTitle>
                <p className="text-xs font-medium text-muted-foreground">{level.duration}</p>
              </CardHeader>

              <CardContent className="mt-6 space-y-3 p-0">
                {level.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-foreground/90">{topic}</span>
                  </div>
                ))}
                <div className="pt-6">
                  <Link to="/courses" className="w-full">
                    <Button variant="outline" className="w-full border-white/15 bg-white/5">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
