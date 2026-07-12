import { API_BASE_URL, extractErrorMessage, ApiError } from '@/lib/http';

// Mismos valores que el discriminador "tipo" de Usuario en user-svc (HUESPED/PROPIETARIO).
// No se traducen a otro vocabulario (ej. "Cliente"/"Gestor") en ninguna capa.
export type Rol = 'HUESPED' | 'PROPIETARIO';

// Página "home" de cada rol tras loguearse (o al pedir "ir a mi panel" ya logueado).
export const HOME_BY_ROL: Record<Rol, string> = {
  HUESPED: '/reservas/search',
  PROPIETARIO: '/gestion',
};

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, extractErrorMessage(response.status, errorText));
  }

  return response.json();
}

/**
 * Decodifica el payload del JWT SIN verificar la firma — solo para hidratar el
 * estado de la UI (qué mostrar según el rol). La validación real de la firma y
 * expiración ocurre siempre en el gateway; el frontend nunca es la fuente de verdad
 * de la autorización.
 */
export function decodeJwtPayload(token: string): { sub: string; email: string; nombre: string; rol: Rol; exp: number } | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof atob === 'function'
      ? atob(normalized)
      : Buffer.from(normalized, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
}
