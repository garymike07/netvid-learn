import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-primary py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-white">Limited Time Offer</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Start Your Networking Journey Today
          </h2>
          
          <p className="mb-10 text-lg text-blue-50 md:text-xl">
            Join hundreds of Kenyans building successful careers in networking.
            Get started with Level 1 completely free.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary"
            >
              View Pricing
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-blue-100">
            No credit card required • Access Level 1 immediately • Join 500+ students
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
