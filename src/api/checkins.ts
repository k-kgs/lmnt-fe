import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';

// internal/service/checkin_service.go's CreateCheckinResult has no JSON tags,
// so it marshals as PascalCase — confirmed against the live endpoint, unlike
// the rest of this API which is snake_case.
export interface CreateCheckinResult {
  CheckinID: string;
  CurrentStreak: number;
  LongestStreak: number;
  CoinsEarned: number;
}

interface CreateCheckinInput {
  userChallengeId: string;
  metricData: Record<string, unknown>;
}

function createCheckin({ userChallengeId, metricData }: CreateCheckinInput): Promise<CreateCheckinResult> {
  return apiFetch<CreateCheckinResult>('/api/checkins', {
    method: 'POST',
    body: JSON.stringify({ user_challenge_id: userChallengeId, metric_data: metricData }),
  });
}

export function useCreateCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheckin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
    },
  });
}
