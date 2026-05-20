'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getHabitacionCacheadaPorId, HabitacionCacheada } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';

export default function HabitacionCacheadaDetallePage() {
  const params = useParams();
  const [habitacion, setHabitacion] = useState<HabitacionCacheada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const habitacionId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchHabitacion = async () => {
      if (!habitacionId) return;
      try {
        setLoading(true);
        setError(null);
        setHabitacion(await getHabitacionCacheadaPorId(habitacionId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (habitacionId) fetchHabitacion();
  }, [habitacionId]);

  return (
    <BdPageLayout>
      <Link href="/reservas/habitaciones" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Habitaciones
      </Link>

      <h1>Detalle de Habitación Cacheada</h1>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : habitacion ? (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '900px' }}>
          <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h2>Habitación</h2>
            <p><strong>Número:</strong> {habitacion.numero}</p>
            <p><strong>Capacidad:</strong> {habitacion.capacidad}</p>
            <p><strong>Precio por Noche:</strong> {habitacion.precioNoche != null ? `$${habitacion.precioNoche.toFixed(2)}` : '-'}</p>
            <p><strong>Tipo:</strong> {habitacion.tipoHabitacion || '-'}</p>
            <p><strong>Amenities:</strong> {habitacion.amenities?.length ? habitacion.amenities.join(', ') : '-'}</p>
          </section>

          {habitacion.hotel && (
            <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
              <h2>Hotel</h2>
              <p><strong>Nombre:</strong> {habitacion.hotel.nombre}</p>
              <p><strong>Domicilio:</strong> {habitacion.hotel.domicilio || '-'}</p>
              <p><strong>Categoría:</strong> {habitacion.hotel.categoria ?? '-'}</p>
            </section>
          )}

          {habitacion.reservas && habitacion.reservas.length > 0 && (
            <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
              <h2>Reservas Asociadas</h2>
              {habitacion.reservas.map((reserva) => (
                <div key={reserva._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <p><strong>Check In:</strong> {new Date(reserva.checkIn).toLocaleString('es-AR', { dateStyle: 'medium' })}</p>
                  <p><strong>Check Out:</strong> {new Date(reserva.checkOut).toLocaleString('es-AR', { dateStyle: 'medium' })}</p>
                  <p><strong>Total:</strong> {reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</p>
                  <p><strong>Estado:</strong> {reserva.estadoReserva || '-'}</p>
                  <Link href={`/reservas/detalle/${reserva._id}`}>Ver reserva</Link>
                </div>
              ))}
            </section>
          )}
        </div>
      ) : <p>Habitación no encontrada</p>}
    </BdPageLayout>
  );
}