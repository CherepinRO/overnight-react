import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaywallDialog } from '@/components/PaywallDialog';
import { getFunctions, httpsCallable } from 'firebase/functions';

vi.mock('firebase/functions');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('PaywallDialog Component', () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).location = { href: '' };
  });

  it('should render dialog when open is true', () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByTestId('dialog-paywall')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
  });

  it('should not render dialog when open is false', () => {
    render(
      <PaywallDialog open={false} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByTestId('dialog-paywall')).not.toBeInTheDocument();
  });

  it('should display amount in description when provided', () => {
    render(
      <PaywallDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        amount={150000}
      />
    );

    expect(screen.getByText(/\$150,000/)).toBeInTheDocument();
    expect(screen.getByText(/exceeds the free limit of \$100,000/)).toBeInTheDocument();
  });

  it('should display monthly and yearly plans', () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByTestId('card-plan-monthly')).toBeInTheDocument();
    expect(screen.getByTestId('card-plan-yearly')).toBeInTheDocument();
    expect(screen.getByText('990')).toBeInTheDocument();
    expect(screen.getByText('9900')).toBeInTheDocument();
  });

  it('should highlight selected plan', () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    const yearlyCard = screen.getByTestId('card-plan-yearly');
    
    // Yearly should be selected by default
    expect(yearlyCard).toHaveClass('ring-2', 'ring-primary');
  });

  it('should switch between plans when clicked', async () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    const monthlyCard = screen.getByTestId('card-plan-monthly');
    const yearlyCard = screen.getByTestId('card-plan-yearly');

    // Click monthly plan
    fireEvent.click(monthlyCard);
    
    await waitFor(() => {
      expect(monthlyCard).toHaveClass('ring-2', 'ring-primary');
    });

    // Click yearly plan
    fireEvent.click(yearlyCard);
    
    await waitFor(() => {
      expect(yearlyCard).toHaveClass('ring-2', 'ring-primary');
    });
  });

  it('should display best value badge on yearly plan', () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByTestId('badge-best-value')).toBeInTheDocument();
    expect(screen.getByText('17% savings')).toBeInTheDocument();
  });

  it('should call onOpenChange when cancel button is clicked', async () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    const cancelButton = screen.getByTestId('button-cancel-upgrade');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should create checkout session and redirect on upgrade', async () => {
    const mockCallable = vi.fn().mockResolvedValue({
      data: { sessionId: 'cs_test_123' },
    });
    
    vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);
    vi.mocked(getFunctions).mockReturnValue({} as any);

    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    const upgradeButton = screen.getByTestId('button-upgrade');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(httpsCallable).toHaveBeenCalledWith({}, 'createCheckoutSession');
      expect(window.location.href).toContain('checkout.stripe.com');
    });
  });

  it('should disable buttons when loading', async () => {
    const mockCallable = vi.fn().mockImplementation(() => 
      new Promise((resolve) => setTimeout(resolve, 100))
    );
    
    vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    const upgradeButton = screen.getByTestId('button-upgrade');
    fireEvent.click(upgradeButton);

    expect(upgradeButton).toBeDisabled();
    expect(screen.getByTestId('button-cancel-upgrade')).toBeDisabled();
  });

  it('should display all premium features', () => {
    render(
      <PaywallDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getAllByText('Unlimited overnight investments')).toHaveLength(2);
    expect(screen.getAllByText('Priority support')).toHaveLength(2);
    expect(screen.getAllByText('Advanced analytics')).toHaveLength(2);
  });
});
