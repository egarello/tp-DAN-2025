'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getHabitacionPorId, Habitacion } from '@/lib/gestion-api';

export default function HabitacionDetailPage() {
  const params = useParams();
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchHabitacion = async () => {
      try {
        setLoading(true);
        setError(null);
        setHabitacion(await getHabitacionPorId(Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHabitacion();
  }, [params.id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/gestion/habitaciones" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Habitaciones
      </Link>

      <h1>Detalle de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : habitacion ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '700px' }}>
          <p><strong>ID:</strong> {habitacion.id}</p>
          <p><strong>Número:</strong> {habitacion.numero}</p>
          <p><strong>Piso:</strong> {habitacion.piso}</p>
          <p><strong>Tipo:</strong> {habitacion.tipoHabitacion?.nombre || '-'}</p>
          <p><strong>Capacidad:</strong> {habitacion.tipoHabitacion?.capacidad ?? '-'}</p>
          <p><strong>Hotel:</strong> {habitacion.hotel?.nombre || '-'}</p>
          <p><strong>ID Hotel:</strong> {habitacion.hotel?.id ?? '-'}</p>
        </div>
      ) : <p>Habitación no encontrada</p>}
    </div>
  );
}
