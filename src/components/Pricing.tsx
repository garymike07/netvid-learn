import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/motion";
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
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(circle at 15% 80%, hsla(215,91%,65%,0.22), transparent 55%)" }}
        initial={{ opacity: 0.2, scale: 0.9 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="container mx-auto px-4">
        <FadeIn className="mb-16 text-center space-y-4">
          <h2 className="text-4xl font-semibold text-foreground md:text-5xl">Affordable Pricing for Kenya</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Invest in your future with pricing aligned to East African professionals — pay via M-Pesa, Airtel Money, or card.
          </p>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={0.06 * index}>
              <Card
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-8 shadow-lg ${
                  plan.popular ? "ring-1 ring-accent/40" : ""
                }`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Star className="h-3 w-3" /> Best Value
                  </motion.div>
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
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="mt-8 p-0">
                  <Link to={plan.price === "0" ? "/courses" : "/auth?redirect=%2Fdashboard"} className="w-full">
                    <Button className="w-full" variant={plan.popular ? "pill-primary" : "outline"} size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </FadeIn>
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
