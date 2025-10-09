import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/services/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';

export interface OvernightTransaction {
  id: string;
  userId: string;
  cardId: string;
  amount: number;
  interest: number;
  state: 'active' | 'matured' | 'returned';
  scheduledAt: Timestamp;
  matureAt: Timestamp;
  returnedAt?: Timestamp;
  bankTxnId?: string;
  bankRedeemId?: string;
}

export interface DailyEarnings {
  date: string;
  earnings: number;
}

export interface OvernightStats {
  lastNightEarnings: number;
  totalActiveAmount: number;
  dailyEarnings: DailyEarnings[]; // Last 30 days
  transactions: OvernightTransaction[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and listen to overnight transactions in real-time
 * 
 * Features:
 * - Real-time Firestore listener for overnight transactions
 * - Calculates last night earnings (returned transactions from past 24h)
 * - Generates 30-day earnings chart data
 * - Tracks active overnight amount
 */
export function useOvernight(): OvernightStats {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<OvernightTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for overnight transactions
    const overnightsRef = collection(db, 'users', user.uid, 'overnights');
    const q = query(
      overnightsRef,
      orderBy('scheduledAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const txns: OvernightTransaction[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          txns.push({
            id: doc.id,
            userId: data.userId,
            cardId: data.cardId,
            amount: data.amount,
            interest: data.interest || 0,
            state: data.state,
            scheduledAt: data.scheduledAt,
            matureAt: data.matureAt,
            returnedAt: data.returnedAt,
            bankTxnId: data.bankTxnId,
            bankRedeemId: data.bankRedeemId,
          });
        });

        setTransactions(txns);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error listening to overnight transactions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  // Calculate last night earnings (transactions returned in past 24 hours)
  const lastNightEarnings = transactions
    .filter((txn) => {
      if (txn.state !== 'returned' || !txn.returnedAt) return false;
      
      const returnedDate = txn.returnedAt.toDate();
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      return returnedDate >= oneDayAgo;
    })
    .reduce((sum, txn) => sum + txn.interest, 0);

  // Calculate total active overnight amount
  const totalActiveAmount = transactions
    .filter((txn) => txn.state === 'active')
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Generate 30-day earnings data for chart
  const dailyEarnings: DailyEarnings[] = (() => {
    const days: DailyEarnings[] = [];
    const today = new Date();
    
    // Generate array of last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Sum earnings for this day
      const dayEarnings = transactions
        .filter((txn) => {
          if (txn.state !== 'returned' || !txn.returnedAt) return false;
          
          const returnedDate = txn.returnedAt.toDate();
          return returnedDate >= date && returnedDate < nextDay;
        })
        .reduce((sum, txn) => sum + txn.interest, 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: Math.round(dayEarnings * 100) / 100, // Round to 2 decimals
      });
    }
    
    return days;
  })();

  return {
    lastNightEarnings: Math.round(lastNightEarnings * 100) / 100,
    totalActiveAmount: Math.round(totalActiveAmount * 100) / 100,
    dailyEarnings,
    transactions,
    loading,
    error,
  };
}
