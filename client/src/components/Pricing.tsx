import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useTranslation();

  const plans = [
    {
      name: t('pricing.starter.name'),
      price: { monthly: 0, annual: 0 },
      description: t('pricing.starter.description'),
      features: t('pricing.starter.features', { returnObjects: true }) as string[],
    },
    {
      name: t('pricing.plus.name'),
      price: { monthly: 9, annual: 89 },
      description: t('pricing.plus.description'),
      features: t('pricing.plus.features', { returnObjects: true }) as string[],
      popular: true,
    },
    {
      name: t('pricing.premium.name'),
      price: { monthly: 29, annual: 289 },
      description: t('pricing.premium.description'),
      features: t('pricing.premium.features', { returnObjects: true }) as string[],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-pricing-title">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-pricing-subtitle">
            {t('pricing.subtitle')}
          </p>
          
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg" data-testid="toggle-pricing-period">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
              data-testid="button-monthly"
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
              data-testid="button-annual"
            >
              {t('pricing.annual')} <span className="text-chart-3 ml-1">{t('pricing.savePercent')}</span>
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
                  {t('pricing.mostPopular')}
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
                      /{isAnnual ? t('pricing.year') : t('pricing.month')}
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mb-6" 
                variant={plan.popular ? "default" : "outline"}
                data-testid={`button-choose-${plan.name.toLowerCase()}`}
              >
                {plan.price.monthly === 0 ? t('pricing.startFree') : t('pricing.getStarted')}
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
