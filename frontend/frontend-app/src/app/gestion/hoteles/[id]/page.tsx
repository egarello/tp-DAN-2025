'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getHotelPorId, Hotel } from '@/lib/gestion-api';

function formatAmenity(amenity: NonNullable<Hotel['amenities']>[number]) {
  return typeof amenity === 'string' ? amenity : amenity.amenity;
}

export default function HotelDetailPage() {
  const params = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        setHotel(await getHotelPorId(Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotel();
  }, [params.id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/gestion/hoteles" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Hoteles
      </Link>

      <h1>Detalle del Hotel</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : hotel ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '700px' }}>
          <p><strong>ID:</strong> {hotel.id}</p>
          <p><strong>Nombre:</strong> {hotel.nombre}</p>
          <p><strong>CUIT:</strong> {hotel.cuit || '-'}</p>
          <p><strong>Domicilio:</strong> {hotel.domicilio || '-'}</p>
          <p><strong>Latitud:</strong> {hotel.latitud ?? '-'}</p>
          <p><strong>Longitud:</strong> {hotel.longitud ?? '-'}</p>
          <p><strong>Teléfono:</strong> {hotel.telefono || '-'}</p>
          <p><strong>Correo:</strong> {hotel.correoContacto || '-'}</p>
          <p><strong>Categoría:</strong> {hotel.categoria ?? '-'}</p>
          <p><strong>Amenities:</strong> {hotel.amenities?.length ? hotel.amenities.map(formatAmenity).join(', ') : '-'}</p>
        </div>
      ) : <p>Hotel no encontrado</p>}
    </div>
  );
}
