'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarHotel, getHotelPorId, HotelRecord } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

export default function EditarHotelPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<HotelRecord>({
    nombre: '',
    cuit: '',
    domicilio: '',
    latitud: undefined,
    longitud: undefined,
    telefono: '',
    correoContacto: '',
    categoria: undefined,
  });

  const hotelId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const hotel = await getHotelPorId(hotelId);
        setFormData({
          nombre: hotel.nombre,
          cuit: hotel.cuit || '',
          domicilio: hotel.domicilio || '',
          latitud: hotel.latitud,
          longitud: hotel.longitud,
          telefono: hotel.telefono || '',
          correoContacto: hotel.correoContacto || '',
          categoria: hotel.categoria,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el hotel');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchHotel();
  }, [hotelId]);

  const updateField = (name: keyof HotelRecord, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: ['latitud', 'longitud'].includes(name) ? (value ? Number(value) : undefined) : name === 'categoria' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const hotel = await actualizarHotel(hotelId, formData);
      router.push(hotel?.id ? `/gestion/hoteles/${hotel.id}` : '/gestion/hoteles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el hotel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 800 }}>
      <Link href={`/gestion/hoteles/${hotelId}`} style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Hotel
      </Link>

      <h1>Editar Hotel</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando datos del hotel...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>Nombre *<input required value={formData.nombre} onChange={(e) => updateField('nombre', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>CUIT<input value={formData.cuit} onChange={(e) => updateField('cuit', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Domicilio<input value={formData.domicilio} onChange={(e) => updateField('domicilio', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Latitud<input type="number" step="any" value={formData.latitud ?? ''} onChange={(e) => updateField('latitud', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Longitud<input type="number" step="any" value={formData.longitud ?? ''} onChange={(e) => updateField('longitud', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Teléfono<input value={formData.telefono} onChange={(e) => updateField('telefono', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Correo de contacto<input type="email" value={formData.correoContacto} onChange={(e) => updateField('correoContacto', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Categoría<input type="number" min={1} value={formData.categoria ?? ''} onChange={(e) => updateField('categoria', e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push(`/gestion/hoteles/${hotelId}`)} disabled={saving} style={{ padding: '10px 20px' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div></BdPageLayout>
  );
}