'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { crearHotel, HotelRecord } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdAlert from '@/components/BdAlert';

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
    <BdPageLayout>
      <div className="mx-auto w-full max-w-4xl">
        <BdBackLink href="/gestion/hoteles" className="mb-bd-lg" />

        <div className="mb-bd-xl flex flex-wrap items-start justify-between gap-bd-md">
          <div>
            <h1 className="text-bd-primary text-bd-xl font-bold">Nuevo Hotel</h1>
            <p className="text-bd-secondary">
              Completá los datos esenciales para registrar un nuevo hotel en el sistema.
            </p>
          </div>
        </div>

        {error && <BdAlert variant="error" className="mb-bd-lg">{error}</BdAlert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
          
          {/* Card: Datos Principales */}
          <BdCard title="Datos Principales">
            <div className="grid gap-bd-md md:grid-cols-2">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Nombre *</span>
                <input
                  required
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  placeholder="Ej. Hotel Central"
                />
              </label>
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">CUIT</span>
                <input
                  value={formData.cuit}
                  onChange={(e) => updateField('cuit', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  placeholder="Sin guiones"
                />
              </label>
            </div>
          </BdCard>

          {/* Card: Ubicación */}
          <BdCard title="Ubicación">
            <div className="flex flex-col gap-bd-md">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Domicilio</span>
                <input
                  value={formData.domicilio}
                  onChange={(e) => updateField('domicilio', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>
              <div className="grid gap-bd-md md:grid-cols-2">
                <label className="flex flex-col gap-bd-xs">
                  <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Latitud</span>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitud ?? ''}
                    onChange={(e) => updateField('latitud', e.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </label>
                <label className="flex flex-col gap-bd-xs">
                  <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Longitud</span>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitud ?? ''}
                    onChange={(e) => updateField('longitud', e.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </label>
              </div>
            </div>
          </BdCard>

          {/* Card: Contacto y Clasificación */}
          <BdCard title="Contacto y Clasificación">
            <div className="grid gap-bd-md md:grid-cols-3">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Teléfono</span>
                <input
                  value={formData.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Correo de contacto</span>
                <input
                  type="email"
                  value={formData.correoContacto}
                  onChange={(e) => updateField('correoContacto', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Categoría</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.categoria ?? ''}
                  onChange={(e) => updateField('categoria', e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  placeholder="1 a 5"
                />
              </label>
            </div>
          </BdCard>

          <div className="flex flex-col gap-bd-sm sm:flex-row sm:justify-end">
            <BdButton type="button" variant="ghost" size="md" onClick={() => router.push('/gestion/hoteles')} disabled={loading}>
              Cancelar
            </BdButton>
            <BdButton type="submit" variant="cta" size="md" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Hotel'}
            </BdButton>
          </div>
        </form>
      </div>
    </BdPageLayout>
  );
}