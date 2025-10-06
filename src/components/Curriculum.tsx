import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/motion";
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
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(circle at 85% 20%, hsla(278,97%,72%,0.2), transparent 55%)" }}
        initial={{ opacity: 0.2, scale: 0.95 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="container mx-auto px-4">
        <FadeIn className="mb-16 text-center space-y-4">
          <h2 className="text-4xl font-semibold text-foreground md:text-5xl">Complete Learning Path</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Progress through five structured levels featuring cinematic explainers, guided labs, and downloadable battle cards.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level, index) => (
            <FadeIn key={level.level} delay={0.05 * index}>
              <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-6 shadow-lg">
                <motion.div
                  className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-14 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"
                  whileHover={{ scale: 1.1, opacity: 0.8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />

                <CardHeader className="relative space-y-3 p-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">{level.level}</span>
                    <Badge variant="secondary" className="border border-white/10 bg-white/5">
                      {level.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-foreground">{level.title}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">{level.duration}</p>
                </CardHeader>

                <CardContent className="mt-6 space-y-3 p-0">
                  {level.topics.map((topic, topicIndex) => (
                    <div key={topic} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
