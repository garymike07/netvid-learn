import { motion } from "framer-motion";
import { Award, BookOpen, Laptop, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion";

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
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundImage: "radial-gradient(circle at 50% 0%, hsla(278,97%,72%,0.22), transparent 55%)" }}
      />
      <div className="container mx-auto px-4">
        <FadeIn className="mb-16 text-center space-y-4">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Why learners stay
          </span>
          <h2 className="text-4xl font-semibold text-foreground md:text-5xl">Learn Networking the Right Way</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Multiple learning formats ensure every concept sticks — pairing guided labs, cinematic lessons, and certification-ready notes.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={0.05 * index} className="h-full">
                <Card className="group glass-panel h-full overflow-hidden rounded-2xl border border-white/10 p-6">
                  <CardContent className="space-y-4 p-0">
                    <motion.div
                      className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-glow"
                      whileHover={{ rotate: -6, scale: 1.05 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Icon className="h-7 w-7" />
                      <motion.span
                        className="absolute inset-0 rounded-xl bg-primary-soft"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.35 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
