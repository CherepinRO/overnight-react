import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cards from '@/pages/Cards';
import * as authModule from '@/hooks/useAuth';
import * as cardsService from '@/services/cards';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/cards');
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Cards Component', () => {
  const mockUser = {
    uid: 'user123',
    displayName: 'Test User',
    email: 'test@example.com',
  };

  const mockCards = [
    {
      id: 'card1',
      bankName: 'Chase Bank',
      last4: '1234',
      balance: 5000,
      icon: '🏦',
      userId: 'user123',
      overnight: false,
      reserved: 0,
    },
    {
      id: 'card2',
      bankName: 'Bank of America',
      last4: '5678',
      balance: 10000,
      icon: '🏛️',
      userId: 'user123',
      overnight: true,
      reserved: 1000,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: mockUser as any,
      loading: false,
      profile: null,
    });

    vi.spyOn(cardsService, 'getCards').mockResolvedValue([]);
  });

  it('should render loading state', () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: true,
      profile: null,
    });

    render(<Cards />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render cards page title', async () => {
    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('text-cards-title')).toHaveTextContent('My Cards');
    });
  });

  it('should show empty state when no cards exist', async () => {
    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('card-empty-state')).toBeInTheDocument();
      expect(screen.getByText('No Cards Linked')).toBeInTheDocument();
      expect(screen.getByTestId('button-add-first-card')).toBeInTheDocument();
    });
  });

  it('should display list of cards', async () => {
    vi.spyOn(cardsService, 'getCards').mockResolvedValue(mockCards);

    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('card-item-card1')).toBeInTheDocument();
      expect(screen.getByTestId('card-item-card2')).toBeInTheDocument();
    });

    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
    expect(screen.getByText('Bank of America')).toBeInTheDocument();
    expect(screen.getByText('•••• 1234')).toBeInTheDocument();
    expect(screen.getByText('•••• 5678')).toBeInTheDocument();
  });

  it('should display card balances correctly', async () => {
    vi.spyOn(cardsService, 'getCards').mockResolvedValue(mockCards);

    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();
    });
  });

  it('should show FAB button when cards exist', async () => {
    vi.spyOn(cardsService, 'getCards').mockResolvedValue(mockCards);

    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('button-fab-add-card')).toBeInTheDocument();
    });
  });

  it('should open link dialog when add card is clicked', async () => {
    vi.spyOn(cardsService, 'getCards').mockResolvedValue([]);
    vi.spyOn(cardsService, 'addCard').mockResolvedValue(mockCards[0]);

    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('button-add-first-card')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('button-add-first-card');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('dialog-link-card')).toBeInTheDocument();
      expect(screen.getByText('Linking Bank Card')).toBeInTheDocument();
    });
  });

  it('should have back button navigation', async () => {
    render(<Cards />);

    await waitFor(() => {
      expect(screen.getByTestId('button-back')).toBeInTheDocument();
    });
  });
});
