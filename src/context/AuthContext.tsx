import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getSession, setSession, clearSession, type KayamUser } from '../lib/auth';
import { login as loginRequest } from '../api/auth';

interface AuthContextValue {
  user: KayamUser | null;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KayamUser | null>(() => getSession()?.user ?? null);

  const login = useCallback(async (name: string, email: string) => {
    const session = await loginRequest(name, email);
    setSession(session);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
