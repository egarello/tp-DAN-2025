'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getReservas, Reserva, pagarReserva, finalizarReserva } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';
import PaymentModal from '@/components/PaymentModal';
import ReviewModal from '@/components/ReviewModal';
import BdAlert from '@/components/BdAlert';

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

const PAGABLES = new Set(['RESERVADA', 'CONFIRMADA', 'ADEUDADA']);

export default function ReservasListaPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePaymentReserva, setActivePaymentReserva] = useState<Reserva | null>(null);
  const [activeReviewReserva, setActiveReviewReserva] = useState<Reserva | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchReservas(); }, []);

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

  const sumPagos = (r: Reserva) => (r.pago?.reduce((s, p) => s + ((p.amount?.precio) || 0), 0) || 0);
  const saldoPendiente = (r: Reserva) => (r.precioTotal != null ? Math.max(0, r.precioTotal - sumPagos(r)) : undefined);

  const handlePagar = async (reserva: Reserva, pago: any) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await pagarReserva(reserva._id, pago);
      await fetchReservas();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al pagar');
    } finally {
      setActionLoading(false);
      setActivePaymentReserva(null);
    }
  };

  const handleFinalizar = async (reserva: Reserva, review: any) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await finalizarReserva(reserva._id, review);
      await fetchReservas();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al finalizar');
    } finally {
      setActionLoading(false);
      setActiveReviewReserva(null);
    }
  };

  // Demo flag: show Finalizar for host. Replace with real auth check later.
  const isHostDemo = true;

  return (
    <BdPageLayout>
      <BdBackLink href="/reservas">Reservas</BdBackLink>

      <h1 className="text-bd-primary">Reservas</h1>
      <BdButton href="/reservas/nueva" variant="primary" size="md">+ Nueva Reserva</BdButton>

      {error && <div className="bd-alert bd-alert-error"><strong>Error:</strong> {error}</div>}
      {actionError && <BdAlert variant="error" message={actionError} onClose={() => setActionError(null)} />}

      {loading ? <p className="bd-skeleton bd-skeleton-text">Cargando...</p> : reservas.length === 0 ? <p className="text-bd-secondary">No hay reservas disponibles</p> : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10">
          <thead>
            <tr>
              <th>Huésped</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => {
              const saldo = saldoPendiente(reserva);
              return (
                <tr key={reserva._id}>
                  <td>{reserva.huesped?.nombreApellido || reserva.huesped?.idUsuario || '-'}</td>
                  <td>{formatFecha(reserva.checkIn)}</td>
                  <td>{formatFecha(reserva.checkOut)}</td>
                  <td>{reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</td>
                  <td>{reserva.estadoReserva || reserva.status || '-'}</td>
                  <td className="bd-row-actions">
                    <Link className="text-bd-link" href={`/reservas/detalle/${reserva._id}`}>Ver</Link>
                    {PAGABLES.has(reserva.estadoReserva || '') && (
                      <BdButton variant="cta" size="sm" onClick={() => setActivePaymentReserva(reserva)} className="ml-2">Pagar</BdButton>
                    )}
                    {isHostDemo && (
                      <BdButton variant="ghost" size="sm" onClick={() => setActiveReviewReserva(reserva)} className="ml-2">Finalizar</BdButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table></BdTable>
      )}

      <PaymentModal
        open={!!activePaymentReserva}
        onClose={() => setActivePaymentReserva(null)}
        saldoPendiente={activePaymentReserva ? saldoPendiente(activePaymentReserva) : undefined}
        onSubmit={async (pago) => {
          if (!activePaymentReserva) return;
          await handlePagar(activePaymentReserva, pago);
        }}
      />

      <ReviewModal
        open={!!activeReviewReserva}
        onClose={() => setActiveReviewReserva(null)}
        onSubmit={async (review) => {
          if (!activeReviewReserva) return;
          await handleFinalizar(activeReviewReserva, review);
        }}
      />
    </BdPageLayout>
  );
}