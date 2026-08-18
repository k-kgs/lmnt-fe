import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface WalletTransaction {
  id: string;
  delta: number;
  reason: string;
  created_at: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

function fetchWallet(): Promise<Wallet> {
  return apiFetch<Wallet>('/api/wallet');
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });
}

// Prototype-only display conversion — lmnt-be has no coin->currency rate
// anywhere (not in redemption_items.metadata, not elsewhere). Chosen purely
// so the wallet screen can show a ₹ figure per kayam-fe requirements.md
// US-6 AC1; not a real exchange rate.
export const RUPEES_PER_COIN = 0.5;
