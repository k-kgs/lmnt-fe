import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface UserChallenge {
  id: string;
  status: string;
  joined_at: string;
  challenge_title: string;
  influencer_handle: string | null;
  vertical_key: string;
  vertical_label: string;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
}

function fetchMyChallenges(): Promise<UserChallenge[]> {
  return apiFetch<UserChallenge[]>('/api/user-challenges');
}

export function useMyChallenges() {
  return useQuery({
    queryKey: ['user-challenges'],
    queryFn: fetchMyChallenges,
  });
}

interface JoinChallengeInput {
  challengeId: string;
  customGoal?: Record<string, unknown>;
}

function joinChallenge({ challengeId, customGoal }: JoinChallengeInput): Promise<UserChallenge> {
  return apiFetch<UserChallenge>(`/api/challenges/${challengeId}/join`, {
    method: 'POST',
    body: customGoal ? JSON.stringify({ custom_goal: customGoal }) : undefined,
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
    },
  });
}
