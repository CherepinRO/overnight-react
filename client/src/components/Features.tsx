import { Shield, Zap, TrendingUp, Clock, DollarSign, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Connect your bank account and start earning in under 2 minutes. No paperwork, no hassle.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your funds are FDIC insured and protected with military-grade encryption.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Returns",
    description: "Earn up to 4.5% APY on overnight deposits, significantly higher than traditional savings.",
  },
  {
    icon: Clock,
    title: "24/7 Automated",
    description: "Our system works round the clock, automatically optimizing your returns every night.",
  },
  {
    icon: DollarSign,
    title: "No Minimum Balance",
    description: "Start with any amount. Every dollar earns interest from day one.",
  },
  {
    icon: Lock,
    title: "Always Accessible",
    description: "Withdraw your funds anytime without penalties or fees. Your money, your control.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-features-title">
            Everything You Need to Grow Your Money
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-features-subtitle">
            Powerful features designed to maximize your overnight earnings with minimal effort.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover-elevate transition-all duration-200" data-testid={`card-feature-${index}`}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
