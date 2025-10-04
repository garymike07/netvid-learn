import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Foundation Access",
    price: "0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Complete Level 1 content",
      "All YouTube videos (free)",
      "Basic interactive diagrams",
      "5 lab simulations per month",
      "Community forum access",
      "Standard video quality (720p)"
    ],
    cta: "Start Learning Free",
    popular: false,
  },
  {
    name: "Professional Learner",
    price: "2,500",
    period: "month",
    description: "Best for serious learners",
    features: [
      "All content (Levels 1-5)",
      "All video tutorials",
      "Unlimited lab simulations",
      "Downloadable videos (offline)",
      "Premium video quality (4K)",
      "Certificates of completion",
      "Email support (48h response)"
    ],
    cta: "Start Monthly Plan",
    popular: false,
  },
  {
    name: "Career Builder",
    price: "20,000",
    period: "year",
    savings: "Save KSh 10,000 (33%)",
    description: "Maximum value for career growth",
    features: [
      "Everything in Professional",
      "Monthly live Q&A sessions",
      "Premium-only video series",
      "Quarterly workshops",
      "Priority support (24h response)",
      "Career guidance resources",
      "Resume review (once/year)",
      "Alumni network access"
    ],
    cta: "Start Annual Plan",
    popular: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 15% 80%, hsla(215,91%,65%,0.22), transparent 55%)" }} />
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center motion-safe:animate-fade-up">
          <h2 className="mb-4 text-4xl font-semibold text-foreground md:text-5xl">Affordable Pricing for Kenya</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Invest in your future with pricing designed for East African professionals
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex h-full flex-col p-8 motion-safe:animate-fade-up ${plan.popular ? "shadow-[0_36px_120px_-40px_hsla(217,91%,65%,0.65)]" : "shadow-[0_24px_80px_-50px_hsla(217,91%,65%,0.4)]"}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-accent/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur">
                  <Star className="h-3 w-3" /> Best Value
                </div>
              )}

              <CardHeader className="mt-4 flex-1 text-center">
                <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-6 space-y-2">
                  <span className="text-5xl font-bold tracking-tight text-primary">
                    {plan.price === "0" ? "Free" : `KSh ${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price !== "0" && <span className="block text-sm text-muted-foreground">per {plan.period}</span>}
                  {plan.savings && <div className="text-sm font-medium text-success">{plan.savings}</div>}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-0">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="mt-8 p-0">
                <Link to={plan.price === "0" ? "/courses" : "/auth?redirect=%2Fdashboard"} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          💳 We accept M-Pesa, Airtel Money, and Cards
        </div>
      </div>
    </section>
  );
};

export default Pricing;
