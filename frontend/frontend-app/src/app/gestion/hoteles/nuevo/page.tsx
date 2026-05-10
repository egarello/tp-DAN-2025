'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { crearHotel, HotelRecord } from '@/lib/gestion-api';

export default function NuevoHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const updateField = (name: keyof HotelRecord, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: ['latitud', 'longitud'].includes(name) ? (value ? Number(value) : undefined) : name === 'categoria' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hotel = await crearHotel(formData);
      router.push(hotel?.id ? `/gestion/hoteles/${hotel.id}` : '/gestion/hoteles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/gestion/hoteles" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Hoteles
      </Link>

      <h1>Nuevo Hotel</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

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
          <button type="button" onClick={() => router.push('/gestion/hoteles')} disabled={loading} style={{ padding: '10px 20px' }}>Cancelar</button>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? 'Guardando...' : 'Crear Hotel'}
          </button>
        </div>
      </form>
    </div>
  );
}
