'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHabitacionesCacheadas, HabitacionCacheada } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdBackLink from '@/components/BdBackLink';

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
    <BdPageLayout>
      <BdBackLink href="/reservas">Reservas</BdBackLink>

      <h1 className="text-bd-primary">Habitaciones (Cacheadas)</h1>

      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}

      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : habitaciones.length === 0 ? <p className="text-bd-secondary">No hay habitaciones cacheadas disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Número</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Capacidad</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Precio/Noche</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Tipo</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Hotel</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.numero}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.capacidad}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.precioNoche != null ? `$${habitacion.precioNoche.toFixed(2)}` : '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.tipoHabitacion || '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.hotel?.nombre || '-'}</td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/reservas/habitaciones/${habitacion.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}