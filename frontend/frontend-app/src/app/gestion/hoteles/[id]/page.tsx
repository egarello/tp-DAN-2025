'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarAmenityHotel, eliminarHotel, getHotelPorId, Hotel } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

function formatAmenity(amenity: NonNullable<Hotel['amenities']>[number]) {
  return typeof amenity === 'string' ? amenity : amenity.amenity;
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAmenity, setDeletingAmenity] = useState<string | null>(null);

  const hotelId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        setHotel(await getHotelPorId(hotelId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchHotel();
  }, [hotelId]);

  const handleEliminarHotel = async () => {
    if (!window.confirm('¿Eliminar definitivamente este hotel?')) return;
    try {
      setError(null);
      await eliminarHotel(hotelId);
      router.push('/gestion/hoteles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el hotel');
    }
  };

  const handleEliminarAmenity = async (amenity: string) => {
    if (!window.confirm(`¿Eliminar amenity "${amenity}"?`)) return;
    try {
      setError(null);
      setDeletingAmenity(amenity);
      const updatedHotel = await eliminarAmenityHotel(hotelId, amenity);
      if (updatedHotel) {
        setHotel(updatedHotel);
      } else {
        const reloaded = await getHotelPorId(hotelId);
        setHotel(reloaded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la amenity');
    } finally {
      setDeletingAmenity(null);
    }
  };

  return (
    <BdPageLayout>
      <Link href="/gestion/hoteles" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Hoteles
      </Link>

      <h1>Detalle del Hotel</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : hotel ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '700px' }}>
          <p><strong>Nombre:</strong> {hotel.nombre}</p>
          <p><strong>CUIT:</strong> {hotel.cuit || '-'}</p>
          <p><strong>Domicilio:</strong> {hotel.domicilio || '-'}</p>
          <p><strong>Latitud:</strong> {hotel.latitud ?? '-'}</p>
          <p><strong>Longitud:</strong> {hotel.longitud ?? '-'}</p>
          <p><strong>Teléfono:</strong> {hotel.telefono || '-'}</p>
          <p><strong>Correo:</strong> {hotel.correoContacto || '-'}</p>
          <p><strong>Categoría:</strong> {hotel.categoria ?? '-'}</p>
          <p><strong>Amenities:</strong></p>
          {hotel.amenities?.length ? (
            <ul>
              {hotel.amenities.map((amenity) => {
                const label = formatAmenity(amenity);
                return (
                  <li key={label} style={{ marginBottom: '6px' }}>
                    {label}
                    <button
                      onClick={() => handleEliminarAmenity(label)}
                      disabled={deletingAmenity === label}
                      style={{
                        marginLeft: '10px',
                        padding: '2px 8px',
                        backgroundColor: deletingAmenity === label ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: deletingAmenity ? 'not-allowed' : 'pointer',
                        fontSize: '0.8em',
                      }}
                    >
                      {deletingAmenity === label ? '...' : '✕'}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <p style={{ marginLeft: '20px' }}>-</p>}

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href={`/gestion/hoteles/${hotel.id}/amenities`} style={{ padding: '10px 16px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
              Agregar Amenities
            </Link>
            <Link href={`/gestion/hoteles/editar/${hotel.id}`} style={{ padding: '10px 16px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px' }}>
              Editar Hotel
            </Link>
            <button onClick={handleEliminarHotel} style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Eliminar Hotel
            </button>
          </div>
        </div>
      ) : <p>Hotel no encontrado</p>}
    </BdPageLayout>
  );
}