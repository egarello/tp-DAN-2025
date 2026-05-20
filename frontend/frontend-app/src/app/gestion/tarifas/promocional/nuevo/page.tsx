'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearTarifaPromocional, getTiposHabitacion, TarifaRecord, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';

export default function NuevaTarifaPromocionalPage() {
  const router = useRouter();
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fechaInicio: '', fechaFin: '', tipoHabitacionId: '', precioNoche: '' });

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoadingOptions(true);
        setTipos(await getTiposHabitacion());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar tipos de habitación');
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchTipos();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: TarifaRecord = {
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      idTipoHabitacion: Number(formData.tipoHabitacionId),
      precioNoche: Number(formData.precioNoche),
    };

    try {
      const tarifas = await crearTarifaPromocional(payload, formData.fechaInicio, formData.fechaFin);
      const tarifaPromocional = tarifas?.find((tarifa) => tarifa.fechaInicio === formData.fechaInicio && tarifa.fechaFin === formData.fechaFin) || tarifas?.[0];
      router.push(tarifaPromocional?.id ? `/gestion/tarifas/${tarifaPromocional.id}` : '/gestion/tarifas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarifa promocional');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout><div className="mx-auto" style={{ maxWidth: 700 }}>
      <Link href="/gestion/tarifas" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Tarifas
      </Link>
      <h1>Nueva Tarifa Promocional</h1>
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>Fecha inicio promoción *<input required type="date" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Fecha fin promoción *<input required type="date" value={formData.fechaFin} onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>
        <label>Tipo de habitación *
          <select required disabled={loadingOptions} value={formData.tipoHabitacionId} onChange={(e) => setFormData({ ...formData, tipoHabitacionId: e.target.value })} style={{ width: '100%', padding: '8px' }}>
            <option value="">Seleccionar tipo</option>
            {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre} ({tipo.capacidad} personas)</option>)}
          </select>
        </label>
        <label>Precio promocional por noche *<input required type="number" min={0} step="0.01" value={formData.precioNoche} onChange={(e) => setFormData({ ...formData, precioNoche: e.target.value })} style={{ width: '100%', padding: '8px' }} /></label>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => router.push('/gestion/tarifas')} disabled={loading} style={{ padding: '10px 20px' }}>Cancelar</button>
          <button type="submit" disabled={loading || loadingOptions} style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? 'Guardando...' : 'Crear Promoción'}
          </button>
        </div>
      </form>
    </div></BdPageLayout>
  );
}
