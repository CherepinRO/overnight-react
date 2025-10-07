import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signOut } from '@/services/auth';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.displayName}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} data-testid="button-signout">
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6" data-testid="card-balance">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Current Balance
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              $0.00
            </p>
          </Card>

          <Card className="p-6" data-testid="card-earned">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Earned
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              $0.00
            </p>
          </Card>

          <Card className="p-6" data-testid="card-limit">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Investment Limit
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              $100,000
            </p>
          </Card>
        </div>

        <Card className="mt-6 p-6" data-testid="card-getting-started">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Getting Started
          </h2>
          <p className="text-muted-foreground mb-4">
            Link your bank cards to start earning overnight income automatically.
          </p>
          <Button onClick={() => setLocation('/cards')} data-testid="button-manage-cards">
            Manage Cards
          </Button>
        </Card>
      </div>
    </div>
  );
}
