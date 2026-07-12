'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarHabitacion, getHabitacionPorId, getHoteles, getTiposHabitacion, HabitacionRecord, Hotel, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBreadcrumb from '@/components/BdBreadcrumb';
import BdButton from '@/components/BdButton';

export default function EditarHabitacionPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [numero, setNumero] = useState('');
  const [piso, setPiso] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [tipoHabitacionId, setTipoHabitacionId] = useState('');

  const habitacionId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [habitacion, hotelesData, tiposData] = await Promise.all([
          getHabitacionPorId(habitacionId),
          getHoteles(),
          getTiposHabitacion(),
        ]);
        setHoteles(hotelesData);
        setTipos(tiposData);
        setNumero(String(habitacion.numero));
        setPiso(String(habitacion.piso));
        setHotelId(String(habitacion.hotel?.id ?? ''));
        setTipoHabitacionId(String(habitacion.tipoHabitacion?.id ?? ''));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (habitacionId) fetchData();
  }, [habitacionId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: HabitacionRecord = {
      numero: Number(numero),
      piso: Number(piso),
      hotel: { id: Number(hotelId) },
      tipoHabitacion: { id: Number(tipoHabitacionId) },
    };

    try {
      const habitacion = await actualizarHabitacion(habitacionId, payload);
      router.push(habitacion?.id ? `/gestion/habitaciones/${habitacion.id}` : '/gestion/habitaciones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la habitación');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 700 }}>
      <BdBreadcrumb items={[
        { label: 'Gestión', href: '/gestion' },
        { label: 'Habitaciones', href: '/gestion/habitaciones' },
        { label: `Habitación ${numero || habitacionId}`, href: `/gestion/habitaciones/${habitacionId}` },
        { label: 'Editar' },
      ]} />
      <h1>Editar Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>Número *<input required type="number" min={1} value={numero} onChange={(e) => setNumero(e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Piso *<input required type="number" min={1} value={piso} onChange={(e) => setPiso(e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Hotel *
            <select required value={hotelId} onChange={(e) => setHotelId(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccionar hotel</option>
              {hoteles.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>)}
            </select>
          </label>
          <label>Tipo de habitación *
            <select required value={tipoHabitacionId} onChange={(e) => setTipoHabitacionId(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccionar tipo</option>
              {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre} ({tipo.capacidad} personas)</option>)}
            </select>
          </label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <BdButton type="button" variant="ghost" onClick={() => router.push(`/gestion/habitaciones/${habitacionId}`)} disabled={saving}>Cancelar</BdButton>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div></BdPageLayout>
  );
}