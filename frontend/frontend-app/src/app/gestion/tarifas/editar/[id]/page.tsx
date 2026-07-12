'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { actualizarTarifa, getTarifaPorId, getTiposHabitacion, TarifaRecord, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBreadcrumb from '@/components/BdBreadcrumb';
import BdButton from '@/components/BdButton';

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
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 700 }}>
      <BdBreadcrumb items={[
        { label: 'Gestión', href: '/gestion' },
        { label: 'Tarifas', href: '/gestion/tarifas' },
        { label: `Tarifa ${tarifaId}`, href: `/gestion/tarifas/${tarifaId}` },
        { label: 'Editar' },
      ]} />
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
            <BdButton type="button" variant="ghost" onClick={() => router.push(`/gestion/tarifas/${tarifaId}`)} disabled={saving}>Cancelar</BdButton>
            <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div></BdPageLayout>
  );
}