import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import { FadeIn } from "@/components/motion";

const videoCategories = [
  {
    title: "Tutorial Videos",
    duration: "10-20 min",
    description: "In-depth concept explanations",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Quick Concepts",
    duration: "3-5 min",
    description: "Fast-paced reviews",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Lab Demonstrations",
    duration: "15-30 min",
    description: "Step-by-step configurations",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Deep Dives",
    duration: "30-45 min",
    description: "Advanced technical exploration",
    color: "from-orange-500 to-orange-600",
  },
];

const VideoShowcase = () => {
  return (
    <section id="videos" className="relative py-24 md:py-32">
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(circle at 10% 0%, hsla(217,91%,65%,0.25), transparent 60%)" }}
        initial={{ opacity: 0.2, scale: 0.95 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="container mx-auto px-4">
        <FadeIn className="mb-16 text-center space-y-4">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">Video experiences</span>
          <h2 className="text-4xl font-semibold text-foreground md:text-5xl">Multiple Video Formats</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Learn through cinematic explainers, rapid-fire recaps, live lab walkthroughs, and deep technical explorations tailored to your pace.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {videoCategories.map((category, index) => (
            <FadeIn key={category.title} delay={0.05 * index}>
              <Card className="group overflow-hidden rounded-2xl border border-white/10 bg-card/60 shadow-lg">
                <div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${category.color}`}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/50"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-lg"
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Play className="h-8 w-8 fill-white text-white" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/40 blur-2xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </motion.div>
                </div>

                <div className="space-y-3 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                    <Badge variant="secondary" className="gap-1 border border-white/10 bg-white/5 text-foreground">
                      <Clock className="h-3 w-3" />
                      {category.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
