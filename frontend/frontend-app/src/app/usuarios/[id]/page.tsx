'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUsuarioById, Usuario } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';

export default function UsuarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsuarioById(Number(id));
        setUsuario(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUsuario();
    }
  }, [params.id]);

  return (
    <BdPageLayout>
      <button
        onClick={() => router.back()}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>Detalle del Usuario</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : usuario ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
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
      ) : (
        <p>Usuario no encontrado</p>
      )}
    </BdPageLayout>
  );
}
