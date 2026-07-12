import { NextRequest, NextResponse } from 'next/server';
import { decodeJwtPayload, isTokenExpired, Rol } from '@/lib/auth';

const TOKEN_COOKIE = 'dan_token';

// Secciones de administración: solo Propietario. Coincide con la tabla de roles
// del backend (gestion-svc entero, usuarios/bancos admin, alta de propietarios).
const PROPIETARIO_ONLY_PREFIXES = ['/gestion', '/usuarios', '/bancos', '/huespedes', '/propietarios'];

// Requieren sesión (cualquier rol) pero no son exclusivas de Propietario.
const AUTHENTICATED_PREFIXES = ['/reservas/lista', '/reservas/nueva', '/reservas/detalle', '/reservas/editar'];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  let rol: Rol | null = null;
  if (token) {
    const payload = decodeJwtPayload(token);
    // Esta decodificación NO verifica la firma (el middleware corre en Edge Runtime,
    // sin acceso al secreto compartido); solo se usa para decidir qué mostrar en la UI.
    // La verificación real siempre ocurre en el gateway ante cada request al backend.
    if (payload && !isTokenExpired(payload.exp)) {
      rol = payload.rol;
    }
  }

  const requiresPropietario = matchesPrefix(pathname, PROPIETARIO_ONLY_PREFIXES);
  const requiresAuth = requiresPropietario || matchesPrefix(pathname, AUTHENTICATED_PREFIXES);

  if (requiresAuth && !rol) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (requiresPropietario && rol !== 'PROPIETARIO') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
