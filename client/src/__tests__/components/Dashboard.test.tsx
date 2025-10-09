import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';
import * as authModule from '@/hooks/useAuth';
import * as overnightModule from '@/hooks/useOvernight';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useOvernight');
vi.mock('@/services/auth', () => ({
  signOut: vi.fn(),
}));
vi.mock('@/services/cards', () => ({
  getCards: vi.fn().mockResolvedValue([]),
  toggleOvernightStatus: vi.fn(),
}));

vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));

describe('Dashboard Component', () => {
  const mockUser = {
    uid: 'user123',
    displayName: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: mockUser as any,
      loading: false,
      profile: null,
    });

    vi.spyOn(overnightModule, 'useOvernight').mockReturnValue({
      lastNightEarnings: 0,
      totalActiveAmount: 0,
      dailyEarnings: Array(30).fill({ date: 'Jan 1', earnings: 0 }),
      transactions: [],
      loading: false,
      error: null,
    });
  });

  it('should render loading state', () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: true,
      profile: null,
    });

    render(<Dashboard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render dashboard title and user name', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('text-dashboard-title')).toHaveTextContent('Dashboard');
    expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
  });

  it('should display last night earnings when greater than zero', () => {
    vi.spyOn(overnightModule, 'useOvernight').mockReturnValue({
      lastNightEarnings: 25.50,
      totalActiveAmount: 5000,
      dailyEarnings: [],
      transactions: [],
      loading: false,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getByTestId('card-last-night')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
    expect(screen.getByTestId('badge-new-earnings')).toBeInTheDocument();
  });

  it('should not display last night earnings when zero', () => {
    render(<Dashboard />);

    expect(screen.queryByTestId('card-last-night')).not.toBeInTheDocument();
  });

  it('should display stats cards with correct values', () => {
    vi.spyOn(overnightModule, 'useOvernight').mockReturnValue({
      lastNightEarnings: 0,
      totalActiveAmount: 50000,
      dailyEarnings: [],
      transactions: [],
      loading: false,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getByTestId('card-active-amount')).toBeInTheDocument();
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
  });

  it('should show empty state when no cards are linked', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No Cards Linked')).toBeInTheDocument();
      expect(screen.getByTestId('button-link-card')).toBeInTheDocument();
    });
  });

  it('should render earnings chart', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('card-earnings-chart')).toBeInTheDocument();
    expect(screen.getByText('30-Day Earnings History')).toBeInTheDocument();
  });

  it('should have sign out button', () => {
    render(<Dashboard />);

    const signOutButton = screen.getByTestId('button-signout');
    expect(signOutButton).toBeInTheDocument();
  });
});
