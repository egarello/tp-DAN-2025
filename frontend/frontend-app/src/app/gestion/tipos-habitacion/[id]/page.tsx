'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTipoHabitacionPorId, TipoHabitacion } from '@/lib/gestion-api';

export default function TipoHabitacionDetailPage() {
  const params = useParams();
  const [tipo, setTipo] = useState<TipoHabitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchTipo = async () => {
      try {
        setLoading(true);
        setError(null);
        setTipo(await getTipoHabitacionPorId(Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTipo();
  }, [params.id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/gestion/tipos-habitacion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tipos de Habitación
      </Link>

      <h1>Detalle del Tipo de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : tipo ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '600px' }}>
          <p><strong>Nombre:</strong> {tipo.nombre}</p>
          <p><strong>Capacidad:</strong> {tipo.capacidad}</p>
          <p><strong>Descripción:</strong> {tipo.descripcion || '-'}</p>
        </div>
      ) : <p>Tipo de habitación no encontrado</p>}
    </div>
  );
}
