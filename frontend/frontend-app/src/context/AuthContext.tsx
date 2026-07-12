'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies';
import { login as loginRequest, decodeJwtPayload, isTokenExpired, AuthUser } from '@/lib/auth';

const TOKEN_COOKIE = 'dan_token';
const TOKEN_MAX_AGE_SECONDS = 8 * 60 * 60; // igual a la expiración del JWT en user-svc

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function userFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload || isTokenExpired(payload.exp)) return null;
  return { id: Number(payload.sub), nombre: payload.nombre, email: payload.email, rol: payload.rol };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getCookie(TOKEN_COOKIE);
    if (stored) {
      const parsedUser = userFromToken(stored);
      if (parsedUser) {
        setToken(stored);
        setUser(parsedUser);
      } else {
        deleteCookie(TOKEN_COOKIE);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setCookie(TOKEN_COOKIE, response.token, TOKEN_MAX_AGE_SECONDS);
    const authUser: AuthUser = { id: response.id, nombre: response.nombre, email: response.email, rol: response.rol };
    setToken(response.token);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    deleteCookie(TOKEN_COOKIE);
    setToken(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return ctx;
}
