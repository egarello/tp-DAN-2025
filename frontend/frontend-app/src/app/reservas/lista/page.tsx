'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getReservas, Reserva } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ReservasListaPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        setReservas(await getReservas());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  return (
    <BdPageLayout>
      <BdBackLink href="/reservas">Reservas</BdBackLink>

      <h1 className="text-bd-primary">Reservas</h1>
      <BdButton href="/reservas/nueva" variant="primary" size="md">+ Nueva Reserva</BdButton>

      {error && <div className="bd-alert bd-alert-error" /* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */><strong>Error:</strong> {error}</div>}

      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : reservas.length === 0 ? <p className="text-bd-secondary">No hay reservas disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10" /* style={{ width: '100%', marginTop: '20px' }} */>
          <thead>
            <tr>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Huésped</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Check In</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Check Out</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Total</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Estado</th>
              <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{reserva.huesped?.nombreApellido || reserva.huesped?.idUsuario || '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{formatFecha(reserva.checkIn)}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{formatFecha(reserva.checkOut)}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</td>
                <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{reserva.estadoReserva || reserva.status || '-'}</td>
                <td className="p-bd-md border-b border-bd-subtle bd-row-actions"><Link className="text-bd-link" href={`/reservas/detalle/${reserva._id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table></BdTable>
      )}
    </BdPageLayout>
  );
}