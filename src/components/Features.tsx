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
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, hsla(278,97%,72%,0.2), transparent 55%)" }} />
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center motion-safe:animate-fade-up">
          <h2 className="mb-4 text-4xl font-semibold text-foreground md:text-5xl">
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
                className="group h-full p-6 motion-safe:animate-fade-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-[0_20px_45px_-25px_hsla(217,91%,65%,0.7)] transition-transform duration-500 group-hover:-translate-y-1">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
