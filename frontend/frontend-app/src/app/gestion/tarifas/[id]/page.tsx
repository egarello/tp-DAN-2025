'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarTarifa, getTarifaPorId, Tarifa } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';

export default function TarifaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tarifaId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [tarifa, setTarifa] = useState<Tarifa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarifa = async () => {
      try {
        setLoading(true);
        setError(null);
        setTarifa(await getTarifaPorId(tarifaId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (tarifaId) fetchTarifa();
  }, [tarifaId]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar definitivamente esta tarifa?')) return;
    try {
      setError(null);
      await eliminarTarifa(tarifaId);
      router.push('/gestion/tarifas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la tarifa');
    }
  };

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion/tarifas" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle de Tarifa</h1>
      {error && (
        <BdAlert variant="error" onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </BdAlert>
      )}
      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : tarifa ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }} */}
          <p className="text-bd-primary mb-bd-sm"><strong>Fecha Inicio:</strong> {tarifa.fechaInicio}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Fecha Fin:</strong> {tarifa.fechaFin}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Precio por Noche:</strong> {tarifa.precioNoche}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Tipo Habitación:</strong> {tarifa.tipoHabitacion?.nombre || '-'}</p>
          <div className="mt-bd-lg flex flex-row gap-bd-sm">
            {/* style={{ marginTop: '16px', display: 'flex', gap: '10px' }} */}
            <BdButton variant="primary" href={`/gestion/tarifas/editar/${tarifa.id}`}>
              Editar Tarifa
            </BdButton>
            <BdButton variant="danger" onClick={handleEliminar}>
              Eliminar Tarifa
            </BdButton>
          </div>
        </BdCard>
      ) : <p className="text-bd-secondary">Tarifa no encontrada</p>}
    </BdPageLayout>
  );
}