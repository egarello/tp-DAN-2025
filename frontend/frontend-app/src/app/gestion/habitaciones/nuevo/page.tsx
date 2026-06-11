'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearHabitacion, getHoteles, getTiposHabitacion, HabitacionRecord, Hotel, TipoHabitacion } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdAlert from '@/components/BdAlert';

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
    <BdPageLayout>
      <div className="mx-auto w-full max-w-4xl">
        <BdBackLink href="/gestion/habitaciones" className="mb-bd-lg" />

        <div className="mb-bd-xl flex flex-wrap items-start justify-between gap-bd-md">
          <div>
            <h1 className="text-bd-primary text-bd-xl font-bold">Nueva Habitación</h1>
            <p className="text-bd-secondary">
              Registrá una nueva habitación asignándola a un hotel y tipo específico.
            </p>
          </div>
        </div>

        {error && <BdAlert variant="error" className="mb-bd-lg">{error}</BdAlert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
          <BdCard title="Detalles de la Habitación">
            <div className="grid gap-bd-md md:grid-cols-2">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Número *</span>
                <input
                  required
                  type="number"
                  min={1}
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="Ej. 101"
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Piso *</span>
                <input
                  required
                  type="number"
                  min={1}
                  value={formData.piso}
                  onChange={(e) => setFormData({ ...formData, piso: e.target.value })}
                  placeholder="Ej. 1"
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Hotel *</span>
                <select
                  required
                  disabled={loadingOptions}
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus disabled:opacity-60"
                >
                  <option value="">
                    {loadingOptions ? 'Cargando hoteles...' : 'Seleccionar hotel'}
                  </option>
                  {hoteles.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.nombre}
                    </option>
                  ))}
                </select>
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
            </div>
          </BdCard>

          <div className="flex flex-col gap-bd-sm sm:flex-row sm:justify-end">
            <BdButton type="button" variant="ghost" size="md" onClick={() => router.push('/gestion/habitaciones')} disabled={loading}>
              Cancelar
            </BdButton>
            <BdButton type="submit" variant="cta" size="md" disabled={loading || loadingOptions}>
              {loading ? 'Guardando...' : 'Crear Habitación'}
            </BdButton>
          </div>
        </form>
      </div>
    </BdPageLayout>
  );
}