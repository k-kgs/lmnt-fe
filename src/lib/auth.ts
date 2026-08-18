export interface KayamUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  auth_method: string;
  last_login_at: string;
  login_count: number;
  created_at: string;
}

export interface Session {
  token: string;
  user: KayamUser;
}

const STORAGE_KEY = 'kayam_session';

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function setSession(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
