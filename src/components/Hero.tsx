import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Video } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-primary py-20 md:py-32"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Video className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Video-Based Learning Platform</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            Master Networking
            <br />
            <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
              From Zero to Expert
            </span>
          </h1>
          
          <p className="mb-10 text-lg text-blue-50 md:text-xl lg:text-2xl">
            Learn networking through comprehensive video tutorials and hands-on labs.
            Built for Kenya, designed for success.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/courses">
              <Button variant="hero" size="xl" className="group">
                Start Learning Free
                <Play className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="xl" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary">
                <BookOpen className="mr-2 h-5 w-5" />
                View Curriculum
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-white">100+</div>
              <div className="text-sm text-blue-100">Video Tutorials</div>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-white">5 Levels</div>
              <div className="text-sm text-blue-100">Beginner to Expert</div>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-white">KSh 2,500</div>
              <div className="text-sm text-blue-100">Monthly Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
