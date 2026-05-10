'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBancos, Banco, PageResponse } from '@/lib/api';

export default function BancosPage() {
  const router = useRouter();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: PageResponse<Banco> = await getBancos(page, 10);
        setBancos(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBancos();
  }, [page]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={() => router.back()}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>Bancos</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {bancos.length === 0 ? (
            <p>No hay bancos disponibles</p>
          ) : (
            <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bancos.map((banco) => (
                  <tr key={banco.id}>
                    <td>{banco.nombre}</td>
                    <td>{banco.codigo}</td>
                    <td>
                      <button
                        onClick={() => router.push(`/bancos/${banco.id}`)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{ padding: '5px 10px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>

            <span>
              Página {page + 1} de {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              style={{ padding: '5px 10px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
