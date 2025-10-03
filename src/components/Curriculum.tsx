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
    <section className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Complete Learning Path
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Progress through 5 structured levels, each with video tutorials, written content, and hands-on labs
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 transition-all group-hover:scale-150" />
              
              <CardHeader className="relative">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{level.level}</span>
                  <Badge variant="secondary">{level.badge}</Badge>
                </div>
                <CardTitle className="text-2xl">{level.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{level.duration}</p>
              </CardHeader>
              
              <CardContent className="relative space-y-2">
                {level.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-sm text-foreground">{topic}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <Link to="/courses" className="w-full">
                    <Button variant="outline" className="w-full">
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
