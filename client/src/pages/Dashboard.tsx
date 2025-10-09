import { useAuth } from '@/hooks/useAuth';
import { useOvernight } from '@/hooks/useOvernight';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { signOut } from '@/services/auth';
import { getCards, toggleOvernightStatus } from '@/services/cards';
import { Card as CardType } from '@/types/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { 
    lastNightEarnings, 
    totalActiveAmount, 
    dailyEarnings, 
    loading: overnightLoading 
  } = useOvernight();
  const [cards, setCards] = useState<CardType[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);

  const loadCards = async () => {
    if (!user) return;
    
    setCardsLoading(true);
    try {
      const fetchedCards = await getCards(user.uid);
      setCards(fetchedCards);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load cards',
        variant: 'destructive',
      });
    } finally {
      setCardsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  const handleToggleOvernight = async (cardId: string, enabled: boolean) => {
    if (!user) return;

    try {
      await toggleOvernightStatus(user.uid, cardId, enabled);
      
      // Update local state
      setCards(cards.map(card => 
        card.id === cardId ? { ...card, overnight: enabled } : card
      ));

      toast({
        title: enabled ? 'Overnight Enabled' : 'Overnight Paused',
        description: enabled 
          ? 'This card will be used for overnight investments'
          : 'This card is paused from overnight investments',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update card settings',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
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

        {/* Last Night Earnings Badge */}
        {lastNightEarnings > 0 && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20" data-testid="card-last-night">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Last Night Earnings</p>
                <p className="font-mono text-2xl font-bold text-foreground">
                  ${lastNightEarnings.toFixed(2)}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm" data-testid="badge-new-earnings">
                New
              </Badge>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6" data-testid="card-active-amount">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active Overnight
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              ${totalActiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className="p-6" data-testid="card-total-cards">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Linked Cards
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              {cards.length}
            </p>
          </Card>

          <Card className="p-6" data-testid="card-active-cards">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active for Overnight
            </h3>
            <p className="font-mono text-3xl font-bold text-foreground">
              {cards.filter(c => c.overnight).length}
            </p>
          </Card>
        </div>

        {/* 30-Day Earnings Chart */}
        <Card className="p-6 mb-8" data-testid="card-earnings-chart">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            30-Day Earnings History
          </h2>
          {overnightLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyEarnings}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                />
                <Bar 
                  dataKey="earnings" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Cards with Toggle Switches */}
        <Card className="p-6" data-testid="card-manage-overnight">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Manage Overnight Settings
          </h2>

          {cardsLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No Cards Linked
              </h3>
              <p className="text-muted-foreground mb-6">
                Link your first bank card to start earning overnight income
              </p>
              <Button onClick={() => setLocation('/cards')} data-testid="button-link-card">
                Link Your First Card
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover-elevate transition-all"
                  data-testid={`card-overnight-toggle-${card.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {card.bankName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        •••• {card.last4}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="font-mono font-semibold text-foreground">
                        ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {card.overnight ? 'Active' : 'Paused'}
                      </span>
                      <Switch
                        checked={card.overnight || false}
                        onCheckedChange={(checked) => handleToggleOvernight(card.id, checked)}
                        data-testid={`switch-overnight-${card.id}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setLocation('/cards')} 
                data-testid="button-manage-all-cards"
              >
                Manage All Cards
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
