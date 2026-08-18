import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface TrendPoint {
  date: string;
  value: number;
}

export interface AdherencePoint {
  day_of_week: number; // 0 = Sunday
  checkin_count: number;
}

export function useTrend(userChallengeId: string, fieldKey: string | undefined) {
  return useQuery({
    queryKey: ['trend', userChallengeId, fieldKey],
    queryFn: () =>
      apiFetch<TrendPoint[]>(
        `/api/user-challenges/${userChallengeId}/trend?field=${encodeURIComponent(fieldKey!)}`,
      ),
    enabled: Boolean(fieldKey),
  });
}

export function useAdherence(userChallengeId: string | undefined) {
  return useQuery({
    queryKey: ['adherence', userChallengeId],
    queryFn: () => apiFetch<AdherencePoint[]>(`/api/user-challenges/${userChallengeId}/adherence`),
    enabled: Boolean(userChallengeId),
  });
}
