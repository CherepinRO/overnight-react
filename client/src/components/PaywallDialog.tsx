import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Crown } from 'lucide-react';
import { PRODUCTS } from '@/services/stripe';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount?: number;
}

export function PaywallDialog({ open, onOpenChange, amount }: PaywallDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      
      const priceId = selectedPlan === 'monthly' 
        ? PRODUCTS.monthly.priceId 
        : PRODUCTS.yearly.priceId;

      const result = await createCheckoutSession({ priceId });
      const { sessionId } = result.data as { sessionId: string };

      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start checkout process',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" data-testid="dialog-paywall">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl">Upgrade to Premium</DialogTitle>
          </div>
          <DialogDescription>
            {amount !== undefined && (
              <span className="text-foreground font-semibold">
                Your overnight amount (${amount.toLocaleString()}) exceeds the free limit of $100,000.
              </span>
            )}{' '}
            Unlock unlimited overnight investments and premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Monthly Plan */}
          <Card
            className={`p-6 cursor-pointer transition-all hover-elevate ${
              selectedPlan === 'monthly' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedPlan('monthly')}
            data-testid="card-plan-monthly"
          >
            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Monthly
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {PRODUCTS.monthly.price}
                </span>
                <span className="text-xl text-muted-foreground">
                  {PRODUCTS.monthly.currency}
                </span>
                <span className="text-muted-foreground">
                  /{PRODUCTS.monthly.interval}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Unlimited overnight investments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Priority support
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Advanced analytics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Cancel anytime
                </span>
              </li>
            </ul>
          </Card>

          {/* Yearly Plan */}
          <Card
            className={`p-6 cursor-pointer transition-all hover-elevate relative ${
              selectedPlan === 'yearly' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedPlan('yearly')}
            data-testid="card-plan-yearly"
          >
            <Badge 
              className="absolute -top-3 left-1/2 -translate-x-1/2" 
              variant="default"
              data-testid="badge-best-value"
            >
              {PRODUCTS.yearly.savings}
            </Badge>
            
            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Yearly
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {PRODUCTS.yearly.price}
                </span>
                <span className="text-xl text-muted-foreground">
                  {PRODUCTS.yearly.currency}
                </span>
                <span className="text-muted-foreground">
                  /{PRODUCTS.yearly.interval}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Only {Math.round(PRODUCTS.yearly.price / 12)} ₽/month
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Unlimited overnight investments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Priority support
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Advanced analytics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  <strong>2 months free!</strong>
                </span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
            data-testid="button-cancel-upgrade"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1"
            data-testid="button-upgrade"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Secure payment powered by Stripe. Cancel anytime from your account settings.
        </p>
      </DialogContent>
    </Dialog>
  );
}
