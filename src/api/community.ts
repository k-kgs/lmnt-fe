import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface LeaderboardEntry {
  user_challenge_id: string;
  user_id: string;
  name: string;
  current_streak: number;
}

export function useLeaderboard(challengeId: string | undefined) {
  return useQuery({
    queryKey: ['leaderboard', challengeId],
    // Public endpoint (no auth required per lmnt-be's router), but still
    // routed through apiFetch for consistent error handling / base URL.
    queryFn: () => apiFetch<LeaderboardEntry[]>(`/api/challenges/${challengeId}/leaderboard`),
    enabled: Boolean(challengeId),
  });
}
