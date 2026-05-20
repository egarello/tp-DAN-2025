'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsuarioPorDniExacto, Usuario } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';

export default function BuscarPorDniPage() {
  const router = useRouter();
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
      <button
        onClick={() => router.back()}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>Buscar Usuario por DNI</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="dni" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            DNI:
          </label>
          <input
            id="dni"
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresa el DNI"
            style={{
              padding: '8px',
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {buscado && usuario && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <h2>Resultado</h2>
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {usuario.apellido}
          </p>
          <p>
            <strong>DNI:</strong> {usuario.dni}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {usuario.telefono}
          </p>
        </div>
      )}
    </BdPageLayout>
  );
}
