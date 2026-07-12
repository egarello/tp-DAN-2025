'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarReserva, getReservaPorId, Reserva } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdAlert from '@/components/BdAlert';

function formatFecha(iso: string | null | undefined) {
  if (!iso) return 'Fecha no definida'; // Si es nulo o indefinido, devuelve un guion
  
  const date = new Date(iso);
  // Validamos si la fecha es inválida (por las dudas)
  if (isNaN(date.getTime())) return '-'; 
  
  return date.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ReservaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reservaId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchReserva = async () => {
      if (!reservaId) return;
      try {
        setLoading(true);
        setError(null);
        setReserva(await getReservaPorId(reservaId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (reservaId) fetchReserva();
  }, [reservaId]);

  const handleEliminarReserva = async () => {
    if (!reservaId) return;
    if (!window.confirm('¿Eliminar definitivamente esta reserva?')) return;
    try {
      setError(null);
      await eliminarReserva(reservaId);
      router.push('/reservas/lista');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la reserva');
    }
  };

  return (
    <BdPageLayout>
      <BdBackLink href="/reservas/lista" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle de Reserva</h1>

      {error && (
        <BdAlert variant="error" onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </BdAlert>
      )}

      {loading ? <div className="bd-skeleton bd-skeleton-text" /> : reserva ? (
        <div className="flex flex-col gap-bd-lg" style={{ maxWidth: '900px' }}>
          {/* style={{ display: 'grid', gap: '20px', maxWidth: '900px' }} */}

          <BdCard>
            {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
            <h2 className="text-bd-primary mb-bd-md">Datos de la Reserva</h2>
            <p className="text-bd-primary mb-bd-sm"><strong>Check In:</strong> {formatFecha(reserva.checkIn)}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Check Out:</strong> {formatFecha(reserva.checkOut)}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Estado:</strong> {reserva.estadoReserva || reserva.status || '-'}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Precio por Noche:</strong> {reserva.precioNoche != null ? `$${reserva.precioNoche.toFixed(2)}` : '-'}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Precio Total:</strong> {reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Habitación (ID):</strong> {reserva.idHabitacion}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Hotel:</strong> {reserva.hotelId}</p>
          </BdCard>

          {reserva.huesped && (
            <BdCard>
              {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
              <h2 className="text-bd-primary mb-bd-md">Huésped</h2>
              <p className="text-bd-primary mb-bd-sm"><strong>Nombre:</strong> {reserva.huesped.nombreApellido || '-'}</p>
              <p className="text-bd-primary mb-bd-sm"><strong>Email:</strong> {reserva.huesped.email || '-'}</p>
            </BdCard>
          )}

          {reserva.pago && reserva.pago.length > 0 && (
            <BdCard>
              {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
              <h2 className="text-bd-primary mb-bd-md">Pago</h2>
              {reserva.pago.map((pago, index) => (
                <div key={index} className="pb-bd-sm mb-bd-sm" style={{ borderBottom: '1px solid #eee' }}>
                  {/* style={{ borderBottom: '1px solid #eee', padding: '10px 0' }} */}
                  <p className="text-bd-primary mb-bd-sm"><strong>Método:</strong> {pago.method}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Transacción:</strong> {pago.transactionId || '-'}</p>
                  {pago.amount && <p className="text-bd-primary mb-bd-sm"><strong>Monto:</strong> {pago.amount.precio} {pago.amount.moneda}</p>}
                  <p className="text-bd-primary mb-bd-sm"><strong>Estado:</strong> {pago.status || '-'}</p>
                </div>
              ))}
            </BdCard>
          )}

          {reserva.clientReview && (
            <BdCard>
              {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
              <h2 className="text-bd-primary mb-bd-md">Reseña del Cliente</h2>
              <p className="text-bd-primary mb-bd-sm"><strong>Puntaje:</strong> {reserva.clientReview.rating ?? '-'}</p>
              <p className="text-bd-primary mb-bd-sm"><strong>Comentario:</strong> {reserva.clientReview.comment || '-'}</p>
              {reserva.clientReview.createdAt && <p className="text-bd-primary mb-bd-sm"><strong>Fecha:</strong> {formatFecha(reserva.clientReview.createdAt)}</p>}
            </BdCard>
          )}

          <div className="mt-bd-lg flex flex-row gap-bd-sm flex flex-wrap">
            {/* style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }} */}
            <BdButton variant="primary" href={`/reservas/editar/${reserva._id}`}>
              Editar Reserva
            </BdButton>
            <BdButton variant="danger" onClick={handleEliminarReserva}>
              Eliminar Reserva
            </BdButton>
          </div>
        </div>
      ) : <p className="text-bd-secondary">Reserva no encontrada</p>}
    </BdPageLayout>
  );
}