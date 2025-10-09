import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCards, addCard, toggleOvernightStatus, updateCardBalances } from '@/services/cards';
import { db } from '@/services/auth';

vi.mock('@/services/auth', () => ({
  db: null,
}));

describe('Cards Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCards', () => {
    it('should return empty array when db is null', async () => {
      const result = await getCards('user123');
      
      expect(result).toEqual([]);
    });

    it('should have 500ms delay', async () => {
      const start = Date.now();
      await getCards('user123');
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(500);
    });
  });

  describe('addCard', () => {
    it('should return mock card when db is null', async () => {
      const userId = 'user123';
      const result = await addCard(userId);
      
      expect(result).toMatchObject({
        id: expect.stringContaining('card_'),
        bankName: expect.any(String),
        last4: expect.stringMatching(/^\d{4}$/),
        balance: expect.any(Number),
        icon: expect.any(String),
        userId,
        overnight: false,
        reserved: 0,
      });
    });

    it('should generate unique card IDs', async () => {
      const card1 = await addCard('user123');
      const card2 = await addCard('user123');
      
      expect(card1.id).not.toBe(card2.id);
    });

    it('should have 500ms delay', async () => {
      const start = Date.now();
      await addCard('user123');
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(500);
    });
  });

  describe('toggleOvernightStatus', () => {
    it('should return without error when db is null', async () => {
      await expect(
        toggleOvernightStatus('user123', 'card123', true)
      ).resolves.toBeUndefined();
    });
  });

  describe('updateCardBalances', () => {
    it('should update card balances with fluctuation', () => {
      const cards = [
        { id: '1', bankName: 'Bank A', last4: '1234', balance: 1000, icon: '🏦', userId: 'user1' },
        { id: '2', bankName: 'Bank B', last4: '5678', balance: 2000, icon: '🏛️', userId: 'user1' },
      ];
      
      const updated = updateCardBalances(cards);
      
      expect(updated).toHaveLength(2);
      updated.forEach((card, index) => {
        expect(card.balance).not.toBe(cards[index].balance);
        // Balance should fluctuate within ±50
        expect(Math.abs(card.balance - cards[index].balance)).toBeLessThanOrEqual(50);
      });
    });

    it('should preserve card properties except balance', () => {
      const cards = [
        { id: '1', bankName: 'Bank A', last4: '1234', balance: 1000, icon: '🏦', userId: 'user1' },
      ];
      
      const [updated] = updateCardBalances(cards);
      
      expect(updated.id).toBe(cards[0].id);
      expect(updated.bankName).toBe(cards[0].bankName);
      expect(updated.last4).toBe(cards[0].last4);
      expect(updated.icon).toBe(cards[0].icon);
      expect(updated.userId).toBe(cards[0].userId);
    });
  });
});
