import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
import Curriculum from "@/components/Curriculum";
import Footer from "@/components/Footer";

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Link to="/auth">
            <Button variant="default" size="lg">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Complete Network Engineering Curriculum
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Progressive learning path from beginner to expert. Each module includes written lessons, 
              video tutorials, hands-on labs, and assessments.
            </p>
          </div>
        </section>

        <Curriculum />

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sign up now and get immediate access to Level 1 content completely free.
            </p>
            <Link to="/auth">
              <Button size="xl" className="gap-2">
                <PlayCircle className="w-5 h-5" />
                Start Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
