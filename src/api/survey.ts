import { useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';
import type { SurveyAnswers, Persona } from '../hooks/useSurveyFlow';

type SurveyResponsePayload = SurveyAnswers & { personaKey: Persona['key'] };

// Public, unauthenticated endpoint — respondents may or may not be logged in.
// apiFetch already omits the Authorization header when there's no session token.
function submitSurveyResponse(payload: SurveyResponsePayload): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/api/survey-responses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function useSubmitSurveyResponse() {
  return useMutation({
    mutationFn: submitSurveyResponse,
  });
}
