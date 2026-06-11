'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getHabitacionCacheadaPorId, HabitacionCacheada } from '@/lib/reservas-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';

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
      <BdBackLink href="/reservas/habitaciones" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle de Habitación Cacheada</h1>

      {error && (
        <div className="bd-alert bd-alert-error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? <div className="bd-skeleton bd-skeleton-text" /> : habitacion ? (
        <div className="flex flex-col gap-bd-lg" style={{ maxWidth: '900px' }}>
          {/* style={{ display: 'grid', gap: '20px', maxWidth: '900px' }} */}

          <BdCard>
            {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
            <h2 className="text-bd-primary mb-bd-md">Habitación</h2>
            <p className="text-bd-primary mb-bd-sm"><strong>Número:</strong> {habitacion.numero}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Capacidad:</strong> {habitacion.capacidad}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Precio por Noche:</strong> {habitacion.precioNoche != null ? `$${habitacion.precioNoche.toFixed(2)}` : '-'}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Tipo:</strong> {habitacion.tipoHabitacion || '-'}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Amenities:</strong> {habitacion.amenities?.length ? habitacion.amenities.join(', ') : '-'}</p>
          </BdCard>

          {habitacion.hotel && (
            <BdCard>
              {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
              <h2 className="text-bd-primary mb-bd-md">Hotel</h2>
              <p className="text-bd-primary mb-bd-sm"><strong>Nombre:</strong> {habitacion.hotel.nombre}</p>
              <p className="text-bd-primary mb-bd-sm"><strong>Domicilio:</strong> {habitacion.hotel.domicilio || '-'}</p>
              <p className="text-bd-primary mb-bd-sm"><strong>Categoría:</strong> {habitacion.hotel.categoria ?? '-'}</p>
            </BdCard>
          )}

          {habitacion.reservas && habitacion.reservas.length > 0 && (
            <BdCard>
              {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
              <h2 className="text-bd-primary mb-bd-md">Reservas Asociadas</h2>
              {habitacion.reservas.map((reserva) => (
                <div key={reserva._id} className="pb-bd-sm mb-bd-sm" style={{ borderBottom: '1px solid #eee' }}>
                  {/* style={{ borderBottom: '1px solid #eee', padding: '10px 0' }} */}
                  <p className="text-bd-primary mb-bd-sm">
                    <strong>Check In:</strong> {reserva.checkIn ? new Date(reserva.checkIn).toLocaleString('es-AR', { dateStyle: 'medium' }) : '-'}
                  </p>
                  <p className="text-bd-primary mb-bd-sm">
                    <strong>Check Out:</strong> {reserva.checkOut ? new Date(reserva.checkOut).toLocaleString('es-AR', { dateStyle: 'medium' }) : '-'}
                  </p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Total:</strong> {reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</p>
                  <p className="text-bd-primary mb-bd-sm"><strong>Estado:</strong> {reserva.estadoReserva || '-'}</p>
                  <BdBackLink href={`/reservas/detalle/${reserva._id}`} className="mt-bd-sm" />
                  {/* <Link href={`/reservas/detalle/${reserva._id}`}>Ver reserva</Link> */}
                </div>
              ))}
            </BdCard>
          )}
        </div>
      ) : <p className="text-bd-secondary">Habitación no encontrada</p>}
    </BdPageLayout>
  );
}