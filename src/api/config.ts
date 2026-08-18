import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface Vertical {
  id: string;
  key: string;
  label: string;
  icon: string;
  input_schema: Array<{
    key: string;
    type: 'number' | 'text' | 'select' | 'photo' | 'exercise_list';
    label: string;
    unit?: string;
    options?: string[];
  }>;
}

export interface Challenge {
  id: string;
  title: string;
  vertical_id: string;
  vertical_key: string;
  influencer_handle: string;
  member_count: number;
  difficulty_stat: string;
  is_template: boolean;
}

export interface RedemptionItem {
  id: string;
  type: 'voucher' | 'consultation';
  title: string;
  coin_cost: number;
  metadata: Record<string, unknown>;
}

export interface KayamConfig {
  verticals: Vertical[];
  challenges: Challenge[];
  redemption_items: RedemptionItem[];
}

async function fetchConfig(): Promise<KayamConfig> {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) {
    throw new Error(`Failed to load config: ${res.status}`);
  }
  return res.json();
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
    staleTime: Infinity,
  });
}
