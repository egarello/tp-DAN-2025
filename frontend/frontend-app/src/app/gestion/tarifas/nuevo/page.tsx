'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearTarifa, getTiposHabitacion, TarifaRecord, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdAlert from '@/components/BdAlert';

export default function NuevaTarifaPage() {
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
      const tarifa = await crearTarifa(payload);
      router.push(tarifa?.id ? `/gestion/tarifas/${tarifa.id}` : '/gestion/tarifas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarifa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-4xl">
        <BdBackLink href="/gestion/tarifas" className="mb-bd-lg" />

        <div className="mb-bd-xl flex flex-wrap items-start justify-between gap-bd-md">
          <div>
            <h1 className="text-bd-primary text-bd-xl font-bold">Nueva Tarifa</h1>
            <p className="text-bd-secondary">
              Definí el período, precio y el tipo de habitación correspondiente.
            </p>
          </div>
        </div>

        {error && <BdAlert variant="error" className="mb-bd-lg">{error}</BdAlert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
          <BdCard title="Detalles de la Tarifa">
            <div className="grid gap-bd-md md:grid-cols-2">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Fecha inicio *</span>
                <input
                  required
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Fecha fin *</span>
                <input
                  required
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Tipo de habitación *</span>
                <select
                  required
                  disabled={loadingOptions}
                  value={formData.tipoHabitacionId}
                  onChange={(e) => setFormData({ ...formData, tipoHabitacionId: e.target.value })}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus disabled:opacity-60"
                >
                  <option value="">
                    {loadingOptions ? 'Cargando tipos...' : 'Seleccionar tipo'}
                  </option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre} (Cap. {tipo.capacidad})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Precio por noche *</span>
                <div className="relative">
                  <span className="text-bd-muted absolute left-3 top-1/2 -translate-y-1/2 select-none">$</span>
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.precioNoche}
                    onChange={(e) => setFormData({ ...formData, precioNoche: e.target.value })}
                    placeholder="0.00"
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm pl-8 w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </div>
              </label>
            </div>
          </BdCard>

          <div className="flex flex-col gap-bd-sm sm:flex-row sm:justify-end">
            <BdButton type="button" variant="ghost" size="md" onClick={() => router.push('/gestion/tarifas')} disabled={loading}>
              Cancelar
            </BdButton>
            <BdButton type="submit" variant="cta" size="md" disabled={loading || loadingOptions}>
              {loading ? 'Guardando...' : 'Crear Tarifa'}
            </BdButton>
          </div>
        </form>
      </div>
    </BdPageLayout>
  );
}