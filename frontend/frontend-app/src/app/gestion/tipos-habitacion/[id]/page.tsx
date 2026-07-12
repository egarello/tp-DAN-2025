'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarTipoHabitacion, getTipoHabitacionPorId, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';

export default function TipoHabitacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tipoId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [tipo, setTipo] = useState<TipoHabitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipo = async () => {
      try {
        setLoading(true);
        setError(null);
        setTipo(await getTipoHabitacionPorId(tipoId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (tipoId) fetchTipo();
  }, [tipoId]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar definitivamente este tipo de habitación?')) return;
    try {
      setError(null);
      await eliminarTipoHabitacion(tipoId);
      router.push('/gestion/tipos-habitacion');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el tipo de habitación');
    }
  };

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion/tipos-habitacion" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle del Tipo de Habitación</h1>
      {error && (
        <BdAlert variant="error" onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </BdAlert>
      )}
      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : tipo ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }} */}
          <p className="text-bd-primary mb-bd-sm"><strong>Nombre:</strong> {tipo.nombre}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Capacidad:</strong> {tipo.capacidad}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Descripción:</strong> {tipo.descripcion || '-'}</p>
          <div className="mt-bd-lg flex flex-row gap-bd-sm">
            {/* style={{ marginTop: '16px', display: 'flex', gap: '10px' }} */}
            <BdButton variant="primary" href={`/gestion/tipos-habitacion/editar/${tipo.id}`}>
              Editar Tipo
            </BdButton>
            <BdButton variant="danger" onClick={handleEliminar}>
              Eliminar Tipo
            </BdButton>
          </div>
        </BdCard>
      ) : <p className="text-bd-secondary">Tipo de habitación no encontrado</p>}
    </BdPageLayout>
  );
}