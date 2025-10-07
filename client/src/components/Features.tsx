import { Shield, Zap, TrendingUp, Clock, DollarSign, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t('features.instantSetup.title'),
      description: t('features.instantSetup.description'),
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
    {
      icon: TrendingUp,
      title: t('features.returns.title'),
      description: t('features.returns.description'),
    },
    {
      icon: Clock,
      title: t('features.automated.title'),
      description: t('features.automated.description'),
    },
    {
      icon: DollarSign,
      title: t('features.noMinimum.title'),
      description: t('features.noMinimum.description'),
    },
    {
      icon: Lock,
      title: t('features.accessible.title'),
      description: t('features.accessible.description'),
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-features-title">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-features-subtitle">
            {t('features.subtitle')}
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
