import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOvernight } from '@/hooks/useOvernight';
import * as authModule from '@/hooks/useAuth';
import { Timestamp } from 'firebase/firestore';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/auth', () => ({
  db: null,
}));

describe('useOvernight Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty state when auth is loading', async () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: true,
      profile: null,
    });

    const { result } = renderHook(() => useOvernight());

    // Hook immediately sets loading to false when user is null
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.transactions).toEqual([]);
    expect(result.current.lastNightEarnings).toBe(0);
    expect(result.current.totalActiveAmount).toBe(0);
  });

  it('should return empty state when user is null', async () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      profile: null,
    });

    const { result } = renderHook(() => useOvernight());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.transactions).toEqual([]);
    expect(result.current.dailyEarnings).toHaveLength(30);
  });

  it('should return empty state when db is null', async () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: { uid: 'user123' } as any,
      loading: false,
      profile: null,
    });

    const { result } = renderHook(() => useOvernight());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.transactions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should generate 30 days of earnings data', async () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      profile: null,
    });

    const { result } = renderHook(() => useOvernight());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dailyEarnings).toHaveLength(30);
    result.current.dailyEarnings.forEach((day) => {
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('earnings');
      expect(day.earnings).toBe(0); // No transactions
    });
  });

  it('should calculate total active amount correctly', async () => {
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      profile: null,
    });

    const { result } = renderHook(() => useOvernight());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // With no transactions, active amount should be 0
    expect(result.current.totalActiveAmount).toBe(0);
  });
});
