'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { eliminarAmenityHotel, eliminarHotel, getHotelPorId, Hotel } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';

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
      <BdBackLink href="/gestion/hoteles" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle del Hotel</h1>
      {error && (
        <div className="bd-alert bd-alert-error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </div>
      )}
      {loading ? <div className="bd-skeleton bd-skeleton-text" /> : hotel ? (
        <BdCard>
          {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '700px' }} */}
          <p className="text-bd-primary mb-bd-sm"><strong>Nombre:</strong> {hotel.nombre}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>CUIT:</strong> {hotel.cuit || '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Domicilio:</strong> {hotel.domicilio || '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Latitud:</strong> {hotel.latitud ?? '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Longitud:</strong> {hotel.longitud ?? '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Teléfono:</strong> {hotel.telefono || '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Correo:</strong> {hotel.correoContacto || '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Categoría:</strong> {hotel.categoria ?? '-'}</p>
          <p className="text-bd-primary mb-bd-sm"><strong>Amenities:</strong></p>
          {hotel.amenities?.length ? (
            <ul className="list-none mb-bd-md">
              {hotel.amenities.map((amenity) => {
                const label = formatAmenity(amenity);
                return (
                  <li key={label} className="flex flex-row items-center mb-bd-sm">
                    {/* style={{ marginBottom: '6px' }} */}
                    <span className="text-bd-primary">{label}</span>
                    <BdButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarAmenity(label)}
                      disabled={deletingAmenity === label}
                      className="ml-bd-sm"
                    >
                      {deletingAmenity === label ? '...' : '✕'}
                    </BdButton>
                  </li>
                );
              })}
            </ul>
          ) : <p className="text-bd-secondary mb-bd-md">
            {/* style={{ marginLeft: '20px' }} */}
            -</p>}

          <div className="mt-bd-lg flex flex-row gap-bd-sm flex flex-wrap">
            {/* style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }} */}
            <BdButton variant="primary" href={`/gestion/hoteles/${hotel.id}/amenities`}>
              Agregar Amenities
            </BdButton>
            <BdButton variant="primary" href={`/gestion/hoteles/editar/${hotel.id}`}>
              Editar Hotel
            </BdButton>
            <BdButton variant="danger" onClick={handleEliminarHotel}>
              Eliminar Hotel
            </BdButton>
          </div>
        </BdCard>
      ) : <p className="text-bd-secondary">Hotel no encontrado</p>}
    </BdPageLayout>
  );
}