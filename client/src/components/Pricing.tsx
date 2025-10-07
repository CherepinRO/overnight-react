import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for trying out overnight investing",
    features: [
      "Up to $10,000 balance",
      "3.5% APY",
      "Daily earnings reports",
      "Mobile app access",
      "Email support",
    ],
  },
  {
    name: "Plus",
    price: { monthly: 9, annual: 89 },
    description: "For serious savers and investors",
    features: [
      "Up to $100,000 balance",
      "4.0% APY",
      "Real-time earnings tracking",
      "Priority support",
      "Advanced analytics",
      "Tax optimization tools",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: { monthly: 29, annual: 289 },
    description: "Maximum returns for high-value accounts",
    features: [
      "Unlimited balance",
      "4.5% APY",
      "Dedicated account manager",
      "Custom investment strategies",
      "API access",
      "White-glove service",
    ],
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-pricing-title">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-pricing-subtitle">
            Start free, upgrade as you grow. All plans include FDIC insurance.
          </p>
          
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg" data-testid="toggle-pricing-period">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
              data-testid="button-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
              data-testid="button-annual"
            >
              Annual <span className="text-chart-3 ml-1">(Save 17%)</span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              data-testid={`card-pricing-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>
                
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold text-foreground">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mb-6" 
                variant={plan.popular ? "default" : "outline"}
                data-testid={`button-choose-${plan.name.toLowerCase()}`}
              >
                {plan.price.monthly === 0 ? 'Start Free' : 'Get Started'}
              </Button>
              
              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
