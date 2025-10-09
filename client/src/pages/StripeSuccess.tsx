import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function StripeSuccess() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session_id from URL params
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setLocation('/dashboard');
      return;
    }

    // Simulate verification (in production, verify with backend)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full p-8 text-center" data-testid="card-success">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-muted-foreground mb-6">
          You've successfully upgraded to Premium. Enjoy unlimited overnight investments and exclusive features!
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => setLocation('/dashboard')} 
            className="w-full"
            data-testid="button-go-to-dashboard"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation('/cards')} 
            className="w-full"
            data-testid="button-manage-cards"
          >
            Manage Cards
          </Button>
        </div>
      </Card>
    </div>
  );
}
