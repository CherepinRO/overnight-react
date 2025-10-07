import { Card } from '@/types/Card';
import { db } from './auth';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

const MOCK_BANKS = [
  { name: 'Chase Bank', icon: '🏦' },
  { name: 'Bank of America', icon: '🏛️' },
  { name: 'Wells Fargo', icon: '🏪' },
  { name: 'Citibank', icon: '🏢' },
];

function generateMockCard(userId: string): Card {
  const randomBank = MOCK_BANKS[Math.floor(Math.random() * MOCK_BANKS.length)];
  const last4 = Math.floor(1000 + Math.random() * 9000).toString();
  const balance = Math.floor(Math.random() * 50000) + 1000;
  
  return {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    bankName: randomBank.name,
    last4,
    balance,
    icon: randomBank.icon,
    userId,
  };
}

export async function getCards(userId: string): Promise<Card[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const cardsRef = collection(db, 'users', userId, 'cards');
    const querySnapshot = await getDocs(cardsRef);
    
    const cards: Card[] = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() } as Card);
    });
    
    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

export async function addCard(userId: string): Promise<Card> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCard = generateMockCard(userId);
  
  try {
    const cardRef = doc(db, 'users', userId, 'cards', newCard.id);
    await setDoc(cardRef, {
      bankName: newCard.bankName,
      last4: newCard.last4,
      balance: newCard.balance,
      icon: newCard.icon,
      userId: newCard.userId,
    });
    
    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
}

// Simulate balance update (fluctuates slightly to show real-time updates)
export async function updateCardBalances(cards: Card[]): Promise<Card[]> {
  return cards.map(card => ({
    ...card,
    balance: card.balance + (Math.random() - 0.5) * 100, // Small fluctuation
  }));
}
