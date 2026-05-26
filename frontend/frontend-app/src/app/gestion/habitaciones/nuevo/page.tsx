'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearHabitacion, getHoteles, getTiposHabitacion, HabitacionRecord, Hotel, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

export default function NuevaHabitacionPage() {
  const router = useRouter();
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ numero: '', piso: '', hotelId: '', tipoHabitacionId: '' });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [hotelesData, tiposData] = await Promise.all([getHoteles(), getTiposHabitacion()]);
        setHoteles(hotelesData);
        setTipos(tiposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar opciones');
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: HabitacionRecord = {
      numero: Number(formData.numero),
      piso: Number(formData.piso),
      hotel: { id: Number(formData.hotelId) },
      tipoHabitacion: { id: Number(formData.tipoHabitacionId) },
    };

    try {
      const habitacion = await crearHabitacion(payload);
      router.push(habitacion?.id ? `/gestion/habitaciones/${habitacion.id}` : '/gestion/habitaciones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la habitación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 700 }}>
      <Link href="/gestion/habitaciones" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Habitaciones
      </Link>
      <h1>Nueva Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>Número *<input required type="number" min={1} value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Piso *<input required type="number" min={1} value={formData.piso} onChange={(e) => setFormData({ ...formData, piso: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Hotel *
          <select required disabled={loadingOptions} value={formData.hotelId} onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })} style={{ width: '100%', padding: '8px' }}>
            <option value="">Seleccionar hotel</option>
            {hoteles.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>)}
          </select>
        </label>
        <label>Tipo de habitación *
          <select required disabled={loadingOptions} value={formData.tipoHabitacionId} onChange={(e) => setFormData({ ...formData, tipoHabitacionId: e.target.value })} style={{ width: '100%', padding: '8px' }}>
            <option value="">Seleccionar tipo</option>
            {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre} ({tipo.capacidad} personas)</option>)}
          </select>
        </label>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => router.push('/gestion/habitaciones')} disabled={loading} style={{ padding: '10px 20px' }}>Cancelar</button>
          <button type="submit" disabled={loading || loadingOptions} style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? 'Guardando...' : 'Crear Habitación'}
          </button>
        </div>
      </form>
    </div></BdPageLayout>
  );
}
