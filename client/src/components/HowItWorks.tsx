import { Link2, TrendingUp, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Link2,
      number: "01",
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      icon: Wallet,
      number: "02",
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      icon: TrendingUp,
      number: "03",
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-how-it-works-title">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-how-it-works-subtitle">
            {t('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-border -z-10"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-6xl font-display font-bold text-primary/10 absolute top-0 -z-10">
                    {step.number}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
