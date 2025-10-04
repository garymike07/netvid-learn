import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

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
    <section id="videos" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Multiple Video Formats
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Learn through different video styles designed for maximum understanding
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {videoCategories.map((category, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
            >
              <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${category.color} transition-all group-hover:scale-105`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110">
                  <Play className="h-8 w-8 fill-white text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.title}
                  </h3>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {category.duration}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
