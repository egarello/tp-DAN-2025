'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarReserva, getReservaPorId, Reserva } from '@/lib/reservas-api';

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/reservas/lista" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Reservas
      </Link>

      <h1>Detalle de Reserva</h1>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : reserva ? (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '900px' }}>
          <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h2>Datos de la Reserva</h2>
            <p><strong>Check In:</strong> {formatFecha(reserva.checkIn)}</p>
            <p><strong>Check Out:</strong> {formatFecha(reserva.checkOut)}</p>
            <p><strong>Estado:</strong> {reserva.estadoReserva || reserva.status || '-'}</p>
            <p><strong>Precio por Noche:</strong> {reserva.precioNoche != null ? `$${reserva.precioNoche.toFixed(2)}` : '-'}</p>
            <p><strong>Precio Total:</strong> {reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</p>
            <p><strong>Habitación (ID):</strong> {reserva.idHabitacion}</p>
            <p><strong>Hotel:</strong> {reserva.hotelId}</p>
          </section>

          {reserva.huesped && (
            <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
              <h2>Huésped</h2>
              <p><strong>Nombre:</strong> {reserva.huesped.nombreApellido || '-'}</p>
              <p><strong>Email:</strong> {reserva.huesped.email || '-'}</p>
            </section>
          )}

          {reserva.pago && reserva.pago.length > 0 && (
            <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
              <h2>Pago</h2>
              {reserva.pago.map((pago, index) => (
                <div key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <p><strong>Método:</strong> {pago.method}</p>
                  <p><strong>Transacción:</strong> {pago.transactionId || '-'}</p>
                  {pago.amount && <p><strong>Monto:</strong> {pago.amount.precio} {pago.amount.moneda}</p>}
                  <p><strong>Estado:</strong> {pago.status || '-'}</p>
                </div>
              ))}
            </section>
          )}

          {reserva.clientReview && (
            <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
              <h2>Reseña del Cliente</h2>
              <p><strong>Puntaje:</strong> {reserva.clientReview.rating ?? '-'}</p>
              <p><strong>Comentario:</strong> {reserva.clientReview.comment || '-'}</p>
              {reserva.clientReview.createdAt && <p><strong>Fecha:</strong> {formatFecha(reserva.clientReview.createdAt)}</p>}
            </section>
          )}

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href={`/reservas/editar/${reserva._id}`} style={{ padding: '10px 16px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px' }}>
              Editar Reserva
            </Link>
            <button onClick={handleEliminarReserva} style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Eliminar Reserva
            </button>
          </div>
        </div>
      ) : <p>Reserva no encontrada</p>}
    </div>
  );
}