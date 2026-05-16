'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHabitacionesCacheadas, HabitacionCacheada } from '@/lib/reservas-api';

export default function HabitacionesCacheadasPage() {
  const [habitaciones, setHabitaciones] = useState<HabitacionCacheada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        setHabitaciones(await getHabitacionesCacheadas());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchHabitaciones();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/reservas" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Reservas
      </Link>

      <h1>Habitaciones (Cacheadas)</h1>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : habitaciones.length === 0 ? <p>No hay habitaciones cacheadas disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Precio/Noche</th>
              <th>Tipo</th>
              <th>Hotel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td>{habitacion.numero}</td>
                <td>{habitacion.capacidad}</td>
                <td>{habitacion.precioNoche != null ? `$${habitacion.precioNoche.toFixed(2)}` : '-'}</td>
                <td>{habitacion.tipoHabitacion || '-'}</td>
                <td>{habitacion.hotel?.nombre || '-'}</td>
                <td><Link href={`/reservas/habitaciones/${habitacion.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}