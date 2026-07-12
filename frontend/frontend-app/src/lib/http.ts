import { getCookie } from '@/lib/cookies';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function authHeaders(): HeadersInit {
  const token = getCookie('dan_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Mensajes cortos por status, usados cuando el backend no devuelve un cuerpo
// parseable (ej. errores de infraestructura, timeouts) — nunca se muestra JSON crudo.
const FALLBACK_MESSAGES: Record<number, string> = {
  400: 'Los datos ingresados no son válidos.',
  401: 'Tu sesión no es válida o expiró. Iniciá sesión de nuevo.',
  403: 'No tenés permisos para hacer esto.',
  404: 'No se encontró lo que buscabas.',
  409: 'Ese dato ya existe.',
  500: 'Ocurrió un error inesperado. Probá de nuevo en unos minutos.',
};

// El backend (ver ControllerAdvisor de cada servicio) siempre responde errores como
// {"message": "...", "path": "...", "timestamp": "...", "status": n}. Acá se extrae
// solo el "message" humano — antes se mostraba el JSON completo en la UI.
export function extractErrorMessage(status: number, rawBody: string): string {
  if (rawBody) {
    try {
      const parsed = JSON.parse(rawBody);
      if (parsed && typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message;
      }
    } catch {
      // no era JSON (ej. un 502 de un proxy) — se usa el fallback genérico de abajo
    }
  }
  return FALLBACK_MESSAGES[status] || `Ocurrió un error (código ${status}).`;
}

async function handle<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, extractErrorMessage(response.status, errorText));
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return (await handle<T>(response)) as T;
}

export async function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handle<T>(response);
}
