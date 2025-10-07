import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card as CardType } from '@/types/Card';
import { getCards, addCard, updateCardBalances } from '@/services/cards';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, CreditCard, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Cards() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const { toast } = useToast();

  // Fetch cards on mount
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
      return;
    }

    if (user) {
      loadCards();
    }
  }, [user, authLoading, setLocation]);

  // Poll balance every 60 seconds
  useEffect(() => {
    if (!user || cards.length === 0) return;

    const interval = setInterval(async () => {
      const updatedCards = await updateCardBalances(cards);
      setCards(updatedCards);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [user, cards]);

  const loadCards = async () => {
    if (!user) return;
    
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!user) return;

    setAddingCard(true);
    try {
      // Simulate opening URL launcher and redirect
      setShowLinkDialog(true);
      
      // Simulate OAuth redirect delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCard = await addCard(user.uid);
      setCards([...cards, newCard]);
      setShowLinkDialog(false);
      
      toast({
        title: 'Card Linked',
        description: `${newCard.bankName} ending in ${newCard.last4} has been added`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to link card',
        variant: 'destructive',
      });
      setShowLinkDialog(false);
    } finally {
      setAddingCard(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/dashboard')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-cards-title">
              My Cards
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your linked bank cards
            </p>
          </div>
        </div>

        {cards.length === 0 ? (
          <Card className="p-12 text-center" data-testid="card-empty-state">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No Cards Linked
            </h3>
            <p className="text-muted-foreground mb-6">
              Link your first bank card to start earning overnight income
            </p>
            <Button onClick={handleAddCard} disabled={addingCard} data-testid="button-add-first-card">
              <Plus className="w-4 h-4 mr-2" />
              Link Your First Card
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                className="p-6 hover-elevate transition-all"
                data-testid={`card-item-${card.id}`}
              >
                <div className="flex items-center justify-between">
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
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className="font-mono text-2xl font-bold text-foreground" data-testid={`text-balance-${card.id}`}>
                      ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        {cards.length > 0 && (
          <Button
            onClick={handleAddCard}
            disabled={addingCard}
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
            size="icon"
            data-testid="button-fab-add-card"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}

        {/* Link Card Dialog (simulates url_launcher redirect) */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent data-testid="dialog-link-card">
            <DialogHeader>
              <DialogTitle>Linking Bank Card</DialogTitle>
              <DialogDescription>
                Redirecting to secure bank authentication...
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
