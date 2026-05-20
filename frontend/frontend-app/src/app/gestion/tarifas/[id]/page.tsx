'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarTarifa, getTarifaPorId, Tarifa } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

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
      <Link href="/gestion/tarifas" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tarifas
      </Link>

      <h1>Detalle de Tarifa</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : tarifa ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <p><strong>Fecha Inicio:</strong> {tarifa.fechaInicio}</p>
          <p><strong>Fecha Fin:</strong> {tarifa.fechaFin}</p>
          <p><strong>Precio por Noche:</strong> {tarifa.precioNoche}</p>
          <p><strong>Tipo Habitación:</strong> {tarifa.tipoHabitacion?.nombre || '-'}</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <Link href={`/gestion/tarifas/editar/${tarifa.id}`} style={{ padding: '10px 16px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px' }}>
              Editar Tarifa
            </Link>
            <button onClick={handleEliminar} style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Eliminar Tarifa
            </button>
          </div>
        </div>
      ) : <p>Tarifa no encontrada</p>}
    </BdPageLayout>
  );
}