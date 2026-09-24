import { useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';
import type { SurveyAnswers, Persona, ScreenKey } from '../hooks/useSurveyFlow';

export interface SurveyCheckpointPayload extends SurveyAnswers {
  clientId: string;
  lastScreen: ScreenKey;
  completed: boolean;
  personaKey?: Persona['key'];
}

// Public, unauthenticated endpoint — respondents may or may not be logged in.
// apiFetch already omits the Authorization header when there's no session token.
// This is an upsert keyed on clientId: fired on every screen transition (see
// SurveyScreen.tsx), not just completion, so a respondent who quits partway
// still leaves a completed=false row behind — that drop-off is the point.
function checkpointSurveyResponse(payload: SurveyCheckpointPayload): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/api/survey-responses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function useCheckpointSurveyResponse() {
  return useMutation({
    mutationFn: checkpointSurveyResponse,
  });
}
