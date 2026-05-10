'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { agregarAmenitiesHotel, Amenity, getHotelPorId, Hotel } from '@/lib/gestion-api';

const AMENITIES: Amenity[] = [
  'PILETA',
  'GIMNASIO',
  'RESTAURANTE',
  'BAR',
  'ESTACIONAMIENTO',
  'WIFI',
  'AIRE_ACONDICIONADO',
  'TV_CABLE',
  'SERVICIO_HABITACIONES',
  'LIMPIEZA_DIARIA',
  'SPA',
  'SALA_REUNIONES',
];

function formatAmenityLabel(amenity: Amenity) {
  return amenity.toLowerCase().replaceAll('_', ' ').replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
}

export default function AgregarAmenitiesHotelPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        setHotel(await getHotelPorId(Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el hotel');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotel();
  }, [params.id]);

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const updatedHotel = await agregarAmenitiesHotel(Number(id), selectedAmenities);
      router.push(updatedHotel?.id ? `/gestion/hoteles/${updatedHotel.id}` : `/gestion/hoteles/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar amenities');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href={hotel ? `/gestion/hoteles/${hotel.id}` : '/gestion/hoteles'} style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Hotel
      </Link>
      <h1>Agregar Amenities</h1>
      {hotel && <p><strong>Hotel:</strong> {hotel.nombre}</p>}
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <fieldset style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <legend style={{ fontWeight: 'bold' }}>Amenities disponibles</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {AMENITIES.map((amenity) => (
                <label key={amenity} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                  {formatAmenityLabel(amenity)}
                </label>
              ))}
            </div>
          </fieldset>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.back()} disabled={saving} style={{ padding: '10px 20px' }}>Cancelar</button>
            <button type="submit" disabled={saving || selectedAmenities.length === 0} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Agregar Amenities'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
