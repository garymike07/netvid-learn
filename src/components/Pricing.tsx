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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Affordable Pricing for Kenya
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Invest in your future with pricing designed for East African professionals
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative flex flex-col border-2 transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? "border-primary shadow-xl lg:scale-105" 
                  : "hover:border-primary hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-accent px-4 py-1 text-accent-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    Best Value
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-primary">
                    {plan.price === "0" ? "Free" : `KSh ${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                  {plan.savings && (
                    <div className="mt-2 text-sm font-medium text-success">{plan.savings}</div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            💳 We accept M-Pesa, Airtel Money, and Cards
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
