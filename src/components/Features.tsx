import { Video, BookOpen, Award, Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Video,
    title: "Video-First Learning",
    description: "Every concept taught through professional video tutorials with step-by-step demonstrations",
  },
  {
    icon: BookOpen,
    title: "Written Content",
    description: "Comprehensive written lessons complement videos for different learning styles",
  },
  {
    icon: Laptop,
    title: "Hands-On Labs",
    description: "Real-world lab demonstrations and practice scenarios to build practical skills",
  },
  {
    icon: Award,
    title: "Structured Path",
    description: "Clear progression from beginner to expert across 5 comprehensive levels",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Learn Networking the Right Way
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Multiple learning formats ensure you understand every concept thoroughly
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all group-hover:from-primary/20 group-hover:to-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
