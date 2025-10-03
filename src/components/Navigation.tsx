import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">Network Academy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/courses" className="text-foreground hover:text-primary transition-colors">
            Courses
          </Link>
          <Link to="/#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/courses">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
