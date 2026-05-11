'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarTarifa, getTarifaPorId, getTiposHabitacion, TarifaRecord, TipoHabitacion } from '@/lib/gestion-api';

export default function EditarTarifaPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoHabitacionId, setTipoHabitacionId] = useState('');
  const [precioNoche, setPrecioNoche] = useState('');

  const tarifaId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tarifa, tiposData] = await Promise.all([getTarifaPorId(tarifaId), getTiposHabitacion()]);
        setTipos(tiposData);
        setFechaInicio(tarifa.fechaInicio);
        setFechaFin(tarifa.fechaFin);
        setTipoHabitacionId(String(tarifa.tipoHabitacion?.id ?? ''));
        setPrecioNoche(String(tarifa.precioNoche));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (tarifaId) fetchData();
  }, [tarifaId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: TarifaRecord = {
      fechaInicio,
      fechaFin,
      idTipoHabitacion: Number(tipoHabitacionId),
      precioNoche: Number(precioNoche),
    };

    try {
      const tarifa = await actualizarTarifa(tarifaId, payload);
      router.push(tarifa?.id ? `/gestion/tarifas/${tarifa.id}` : '/gestion/tarifas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarifa');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <Link href={`/gestion/tarifas/${tarifaId}`} style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tarifa
      </Link>
      <h1>Editar Tarifa</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>Fecha inicio *<input required type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Fecha fin *<input required type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>
          <label>Tipo de habitación *
            <select required value={tipoHabitacionId} onChange={(e) => setTipoHabitacionId(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccionar tipo</option>
              {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre} ({tipo.capacidad} personas)</option>)}
            </select>
          </label>
          <label>Precio por noche *<input required type="number" min={0} step="0.01" value={precioNoche} onChange={(e) => setPrecioNoche(e.target.value)} style={{ width: '100%', padding: '8px' }} /></label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push(`/gestion/tarifas/${tarifaId}`)} disabled={saving} style={{ padding: '10px 20px' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}