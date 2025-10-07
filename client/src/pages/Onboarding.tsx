import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { TrendingUp, Shield, Clock } from 'lucide-react';
import { signInWithGoogle } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleGoogleSignIn = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signInWithGoogle();
      localStorage.setItem('firstLaunch', 'false');
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const slides = [
    {
      icon: TrendingUp,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      color: 'text-chart-1',
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
      color: 'text-chart-2',
    },
    {
      icon: Clock,
      title: t('features.automated.title'),
      description: t('features.automated.description'),
      color: 'text-chart-3',
    },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <Card className="w-full max-w-md p-8" data-testid="card-onboarding">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome to Overnight
          </h1>
          <p className="text-muted-foreground">
            Start earning while you sleep
          </p>
        </div>

        <Carousel 
          setApi={setApi} 
          className="w-full mb-8"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className={`w-10 h-10 ${slide.color}`} />
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-muted'
              }`}
              data-testid={`dot-${index}`}
            />
          ))}
        </div>

        {current === slides.length - 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2" data-testid="checkbox-terms">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              className="w-full"
              size="lg"
              data-testid="button-google-signin"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.continueWithGoogle')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
