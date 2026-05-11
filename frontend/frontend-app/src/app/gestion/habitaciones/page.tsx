'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHabitaciones, Habitacion } from '@/lib/gestion-api';

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        setHabitaciones(await getHabitaciones());
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
      <Link href="/gestion" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Gestión
      </Link>

      <h1>Habitaciones</h1>
      <Link href="/gestion/habitaciones/nuevo" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 16px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        + Nueva Habitación
      </Link>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : habitaciones.length === 0 ? <p>No hay habitaciones disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Piso</th>
              <th>Tipo</th>
              <th>Hotel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td>{habitacion.numero}</td>
                <td>{habitacion.piso}</td>
                <td>{habitacion.tipoHabitacion?.nombre || '-'}</td>
                <td>{habitacion.hotel?.nombre || '-'}</td>
                <td><Link href={`/gestion/habitaciones/${habitacion.id}`}>Ver</Link> | <Link href={`/gestion/habitaciones/editar/${habitacion.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
