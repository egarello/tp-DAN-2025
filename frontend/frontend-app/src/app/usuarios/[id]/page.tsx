'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUsuarioById, Usuario } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';

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
      <BdBackLink onClick={() => router.back()} className="mb-bd-lg" />
      {/* style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }} */}

      <h1 className="text-bd-primary">Detalle del Usuario</h1>

      {error && (
        <div className="bd-alert bd-alert-error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : usuario ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }} */}
          <p className="text-bd-primary mb-bd-sm">
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Apellido:</strong> {usuario.apellido}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>DNI:</strong> {usuario.dni}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Email:</strong> {usuario.email}
          </p>
          <p className="text-bd-primary mb-bd-sm">
            <strong>Teléfono:</strong> {usuario.telefono}
          </p>
        </BdCard>
      ) : (
        <p className="text-bd-secondary">Usuario no encontrado</p>
      )}
    </BdPageLayout>
  );
}
