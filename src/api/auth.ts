import { apiFetch } from './client';
import type { Session } from '../lib/auth';

export function login(name: string, email: string): Promise<Session> {
  return apiFetch<Session>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}
