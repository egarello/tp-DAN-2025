'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTarifaPorId, Tarifa } from '@/lib/gestion-api';

export default function TarifaDetailPage() {
  const params = useParams();
  const [tarifa, setTarifa] = useState<Tarifa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchTarifa = async () => {
      try {
        setLoading(true);
        setError(null);
        setTarifa(await getTarifaPorId(Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTarifa();
  }, [params.id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/gestion/tarifas" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tarifas
      </Link>

      <h1>Detalle de Tarifa</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : tarifa ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <p><strong>ID:</strong> {tarifa.id}</p>
          <p><strong>Fecha Inicio:</strong> {tarifa.fechaInicio}</p>
          <p><strong>Fecha Fin:</strong> {tarifa.fechaFin}</p>
          <p><strong>Precio por Noche:</strong> {tarifa.precioNoche}</p>
          <p><strong>Tipo Habitación:</strong> {tarifa.tipoHabitacion?.nombre || '-'}</p>
          <p><strong>ID Tipo Habitación:</strong> {tarifa.tipoHabitacion?.id ?? '-'}</p>
        </div>
      ) : <p>Tarifa no encontrada</p>}
    </div>
  );
}
