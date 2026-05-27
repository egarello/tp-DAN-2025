'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHabitaciones, Habitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

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
    <BdPageLayout>
      <BdBackLink href="/gestion">Gestión</BdBackLink>

      <h1 className="text-bd-primary">Habitaciones</h1>
      <BdButton href="/gestion/habitaciones/nuevo" variant="primary" size="md">+ Nueva Habitación</BdButton>
      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}
      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : habitaciones.length === 0 ? <p className="text-bd-secondary">No hay habitaciones disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Número</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Piso</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Tipo</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Hotel</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Estado Hotel</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.numero}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.piso}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.tipoHabitacion?.nombre || '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{habitacion.hotel?.nombre || '-'}</td>
                <td className="p-bd-md border-b border-bd-subtle">
                  {habitacion.hotel ? (
                    <span
                      className={`inline-flex items-center rounded-bd-pill border px-bd-sm py-[2px] text-xs font-semibold ${habitacion.hotel.cerrado ? 'border-bd-urgency text-bd-urgency bg-[rgba(192,57,43,0.1)]' : 'border-bd-blue-bright text-bd-blue-bright bg-[rgba(45,212,191,0.08)]'}`}
                    >
                      {habitacion.hotel.cerrado ? 'Cerrado' : 'Abierto'}
                    </span>
                  ) : (
                    <span className="text-bd-muted text-xs">-</span>
                  )}
                </td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/gestion/habitaciones/${habitacion.id}`}>Ver</Link> | <Link className="text-bd-link" href={`/gestion/habitaciones/editar/${habitacion.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}
