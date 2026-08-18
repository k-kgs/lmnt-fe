import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

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

function fetchConfig(): Promise<KayamConfig> {
  return apiFetch<KayamConfig>('/api/config');
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
    staleTime: Infinity,
  });
}
