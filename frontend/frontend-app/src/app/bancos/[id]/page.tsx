'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBancoPorId, Banco } from '@/lib/api';

export default function BancoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [banco, setBanco] = useState<Banco | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchBanco = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBancoPorId(Number(id));
        setBanco(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBanco();
    }
  }, [params.id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={() => router.back()}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>Detalle del Banco</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : banco ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <p>
            <strong>Nombre:</strong> {banco.nombre}
          </p>
          <p>
            <strong>Código:</strong> {banco.codigo}
          </p>
        </div>
      ) : (
        <p>Banco no encontrado</p>
      )}
    </div>
  );
}
