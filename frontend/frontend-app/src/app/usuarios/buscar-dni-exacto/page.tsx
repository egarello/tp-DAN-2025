'use client';

import { useState } from 'react';
import { getUsuarioPorDniExacto, Usuario } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';
import BdCard from '@/components/BdCard';

export default function BuscarPorDniPage() {
  const [dni, setDni] = useState('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) {
      setError('Por favor ingresa un DNI');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUsuario(null);
      const data = await getUsuarioPorDniExacto(dni);
      setUsuario(data);
      setBuscado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Usuario no encontrado');
      setUsuario(null);
      setBuscado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-3xl">
        <BdBackLink href="/usuarios" className="mb-bd-lg" />

        <h1 className="text-bd-primary text-bd-xl font-bold">Buscar usuario por DNI</h1>

        <form onSubmit={handleSearch} className="mt-bd-lg flex flex-col gap-bd-md">
          <div>
            <label htmlFor="dni" className="text-bd-muted text-bd-xs block mb-bd-xs">
              DNI
            </label>
            <input
              id="dni"
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresa el DNI"
              className="bg-bd-input text-bd-primary border-bd-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
            />
          </div>
          <div className="flex items-center gap-bd-md">
            <BdButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </BdButton>
          </div>
        </form>

        {error && (
          <BdAlert variant="error" className="mt-bd-lg">
            <strong>Error:</strong> {error}
          </BdAlert>
        )}

        {buscado && usuario && (
          <BdCard title="Resultado" className="mt-bd-xl">
            <div className="text-sm text-bd-secondary leading-6">
              <p>
                <strong className="text-bd-primary">Nombre:</strong> {usuario.nombre}
              </p>
              <p>
                <strong className="text-bd-primary">Apellido:</strong> {usuario.apellido}
              </p>
              <p>
                <strong className="text-bd-primary">DNI:</strong> {usuario.dni}
              </p>
              <p>
                <strong className="text-bd-primary">Email:</strong> {usuario.email}
              </p>
              <p>
                <strong className="text-bd-primary">Teléfono:</strong> {usuario.telefono}
              </p>
            </div>
          </BdCard>
        )}
      </div>
    </BdPageLayout>
  );
}
