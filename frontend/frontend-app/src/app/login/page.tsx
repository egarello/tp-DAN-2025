'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROL } from '@/lib/auth';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';

function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      const next = searchParams.get('next');
      // Navegación completa (no router.push): si el usuario llegó acá redirigido por
      // el middleware al intentar entrar sin sesión a una ruta protegida, un push
      // client-side puede reutilizar esa respuesta de redirect cacheada por el router
      // de Next y dejarlo dando vueltas en /login. Un reload fuerza un request fresco
      // con la cookie ya seteada.
      window.location.href = next || HOME_BY_ROL[user.rol] || '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bd-page px-4">
      <div className="w-full max-w-md rounded-[1.5rem] border border-bd-medium/60 bg-bd-card/90 p-8 shadow-bd-card">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bd-muted">Iniciar sesión</p>
        <h1 className="mt-3 text-2xl font-semibold text-bd-primary">Entrar al sistema</h1>

        {error && (
          <BdAlert variant="error" className="mt-bd-lg">
            <strong>Error:</strong> {error}
          </BdAlert>
        )}

        <form onSubmit={handleSubmit} className="mt-bd-lg flex flex-col gap-bd-md">
          <div>
            <label htmlFor="email" className="text-bd-muted text-bd-xs block mb-bd-xs">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-bd-muted text-bd-xs block mb-bd-xs">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
            />
          </div>

          <BdButton variant="cta" type="submit" disabled={loading} className="mt-bd-sm justify-center">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </BdButton>
        </form>

        <p className="mt-bd-lg text-center text-bd-sm text-bd-secondary">
          ¿No tenés cuenta? <a href="/registro/huesped" className="text-bd-link">Registrate como huésped</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
