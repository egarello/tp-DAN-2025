'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getReservas, Reserva } from '@/lib/reservas-api';

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/reservas" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Reservas
      </Link>

      <h1>Reservas</h1>

      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : reservas.length === 0 ? <p>No hay reservas disponibles</p> : (
        <table border={1} cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
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
            {reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td>{reserva.huesped?.nombreApellido || reserva.huesped?.idUsuario || '-'}</td>
                <td>{formatFecha(reserva.checkIn)}</td>
                <td>{formatFecha(reserva.checkOut)}</td>
                <td>{reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</td>
                <td>{reserva.estadoReserva || reserva.status || '-'}</td>
                <td><Link href={`/reservas/detalle/${reserva._id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}