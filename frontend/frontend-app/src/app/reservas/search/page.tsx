'use client';

import { FormEvent, useState } from 'react';
import BdAlert from '@/components/BdAlert';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdEmptyState from '@/components/BdEmptyState';
import BdPageLayout from '@/components/BdPageLayout';
import BdPagination from '@/components/BdPagination';
import { buscarHabitaciones, BuscarHabitacionesFiltros, HabitacionesSearchPage, HabitacionCacheada } from '@/lib/reservas-api';

const DEFAULT_PAGE_SIZE = 10;

interface SearchFormState {
  checkIn: string;
  checkOut: string;
  capacidad: string;
  precioMin: string;
  precioMax: string;
  categoria: string;
  amenities: string;
  latitud: string;
  longitud: string;
  maxDistancia: string;
  unidad: 'km' | 'm';
}

const initialForm: SearchFormState = {
  checkIn: '',
  checkOut: '',
  capacidad: '2',
  precioMin: '',
  precioMax: '',
  categoria: '',
  amenities: '',
  latitud: '',
  longitud: '',
  maxDistancia: '',
  unidad: 'km',
};

export default function BuscarHabitacionesPage() {
  const [form, setForm] = useState<SearchFormState>(initialForm);
  const [results, setResults] = useState<HabitacionesSearchPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const updateField = (field: keyof SearchFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await runSearch(0);
  };

  const runSearch = async (page: number) => {
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const filtros = buildFilters(form, page);
      setResults(await buscarHabitaciones(filtros));
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : 'Error al buscar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setForm(initialForm);
    setResults(null);
    setError(null);
    setSearched(false);
  };

  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-bd-xl flex flex-wrap items-start justify-between gap-bd-md">
          <div>
            <p className="text-bd-muted text-bd-xs uppercase tracking-[0.2em]">Reservas</p>
            <h1 className="text-bd-primary text-bd-xl font-bold">Buscar habitaciones</h1>
            <p className="text-bd-secondary mt-bd-xs">
              Consulta disponibilidad por fechas, capacidad, precio, categoria, amenities y ubicacion.
            </p>
          </div>
          <div className="rounded-bd-pill border border-bd-subtle bg-bd-card px-bd-md py-bd-sm text-bd-secondary text-bd-sm">
            GET /reservas/habitaciones/search
          </div>
        </div>

        <BdCard className="mb-bd-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
            <section>
              <h2 className="text-bd-primary font-semibold">Disponibilidad</h2>
              <p className="text-bd-secondary text-sm mt-bd-xs">Campos obligatorios para consultar habitaciones disponibles.</p>
              <div className="mt-bd-md grid gap-bd-md md:grid-cols-3">
                <Field label="Check In *">
                  <input
                    required
                    type="date"
                    value={form.checkIn}
                    onChange={(event) => updateField('checkIn', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Check Out *">
                  <input
                    required
                    type="date"
                    value={form.checkOut}
                    onChange={(event) => updateField('checkOut', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Capacidad *">
                  <input
                    required
                    min="1"
                    type="number"
                    value={form.capacidad}
                    onChange={(event) => updateField('capacidad', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="text-bd-primary font-semibold">Filtros opcionales</h2>
              <div className="mt-bd-md grid gap-bd-md md:grid-cols-4">
                <Field label="Precio minimo">
                  <input
                    min="0"
                    type="number"
                    value={form.precioMin}
                    onChange={(event) => updateField('precioMin', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Precio maximo">
                  <input
                    min="0"
                    type="number"
                    value={form.precioMax}
                    onChange={(event) => updateField('precioMax', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Categoria hotel">
                  <input
                    min="1"
                    type="number"
                    value={form.categoria}
                    onChange={(event) => updateField('categoria', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Amenities">
                  <input
                    type="text"
                    value={form.amenities}
                    onChange={(event) => updateField('amenities', event.target.value)}
                    placeholder="wifi, tv, aire"
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="text-bd-primary font-semibold">Ubicacion</h2>
              <p className="text-bd-secondary text-sm mt-bd-xs">
                Si informas coordenadas, tambien se requiere distancia maxima y unidad.
              </p>
              <div className="mt-bd-md grid gap-bd-md md:grid-cols-4">
                <Field label="Latitud">
                  <input
                    step="any"
                    type="number"
                    value={form.latitud}
                    onChange={(event) => updateField('latitud', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Longitud">
                  <input
                    step="any"
                    type="number"
                    value={form.longitud}
                    onChange={(event) => updateField('longitud', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Distancia max.">
                  <input
                    min="0"
                    step="any"
                    type="number"
                    value={form.maxDistancia}
                    onChange={(event) => updateField('maxDistancia', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                </Field>
                <Field label="Unidad">
                  <select
                    value={form.unidad}
                    onChange={(event) => updateField('unidad', event.target.value)}
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  >
                    <option value="km">Kilometros</option>
                    <option value="m">Metros</option>
                  </select>
                </Field>
              </div>
            </section>

            <div className="flex flex-col gap-bd-sm sm:flex-row sm:items-center sm:justify-end">
              <BdButton type="button" variant="ghost" onClick={clearFilters} disabled={loading}>
                Limpiar
              </BdButton>
              <BdButton type="submit" variant="cta" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar habitaciones'}
              </BdButton>
            </div>
          </form>
        </BdCard>

        {error && (
          <BdAlert variant="error" className="mb-bd-lg">
            <strong>Error:</strong> {error}
          </BdAlert>
        )}

        {loading && <LoadingResults />}

        {searched && !loading && results?.empty && (
          <BdEmptyState
            title="Sin habitaciones disponibles"
            message="No encontramos habitaciones con esos filtros. Ajusta fechas, capacidad o precio e intenta nuevamente."
          />
        )}

        {searched && !loading && results && !results.empty && (
          <section aria-live="polite">
            <div className="mb-bd-md flex flex-wrap items-center justify-between gap-bd-sm">
              <div>
                <p className="text-bd-primary font-semibold">Habitaciones disponibles</p>
                <p className="text-bd-secondary text-sm">
                  {results.totalElements} resultado{results.totalElements === 1 ? '' : 's'} encontrados
                </p>
              </div>
              <span className="rounded-bd-pill border border-bd-subtle bg-bd-card px-bd-sm py-[4px] text-bd-secondary text-xs">
                Pagina {results.number + 1} de {results.totalPages}
              </span>
            </div>

            <div className="flex flex-col gap-bd-lg">
              {results.content.map((habitacion) => (
                <HabitacionResultCard key={habitacion.id} habitacion={habitacion} />
              ))}
            </div>

            {results.totalPages > 1 && (
              <BdPagination
                page={results.number}
                totalPages={results.totalPages}
                totalResults={results.totalElements}
                onPageChange={runSearch}
              />
            )}
          </section>
        )}
      </div>
    </BdPageLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-bd-xs">
      <span className="text-bd-muted text-bd-xs uppercase tracking-widest">{label}</span>
      {children}
    </label>
  );
}

function HabitacionResultCard({ habitacion }: { habitacion: HabitacionCacheada }) {
  const hotel = habitacion.hotel;
  const amenities = habitacion.amenities ?? [];

  return (
    <article className="bd-card flex flex-col gap-bd-lg p-0 shadow-bd-card transition-all duration-200 hover:-translate-y-1 hover:border-bd-medium hover:bg-bd-card-hover hover:shadow-bd-card-hover md:flex-row md:overflow-hidden">
      <div className="flex min-h-[160px] items-center justify-center bg-bd-sidebar px-bd-xl py-bd-lg md:w-[220px] md:flex-shrink-0">
        <div className="text-center">
          <p className="text-bd-muted text-bd-xs uppercase tracking-[0.2em]">Habitacion</p>
          <p className="text-bd-primary text-4xl font-bold">{habitacion.numero}</p>
          <p className="text-bd-secondary text-sm">Capacidad {habitacion.capacidad}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-bd-sm p-bd-lg">
        <header className="flex flex-col gap-bd-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-bd-primary text-bd-xl font-bold leading-tight">
              {hotel?.nombre ?? 'Hotel sin nombre'}
            </h2>
            <p className="text-bd-secondary text-sm">
              {hotel?.domicilio ?? 'Domicilio no informado'}
            </p>
          </div>
          {hotel?.categoria != null && (
            <div className="rounded-bd-md bg-bd-blue-badge px-bd-sm py-bd-xs text-bd-blue-badge-txt text-sm font-bold">
              {hotel.categoria} estrellas
            </div>
          )}
        </header>

        <div className="flex flex-wrap gap-bd-sm text-bd-secondary text-sm">
          <span className="rounded-bd-pill border border-bd-subtle px-bd-sm py-[3px]">Tipo: {habitacion.tipoHabitacion || '-'}</span>
          <span className="rounded-bd-pill border border-bd-subtle px-bd-sm py-[3px]">ID gestion: {habitacion.habitacionId}</span>
          {hotel?.cerrado && <span className="rounded-bd-pill border border-bd-subtle px-bd-sm py-[3px] text-bd-urgency">Hotel cerrado</span>}
        </div>

        {amenities.length > 0 && (
          <ul className="flex flex-wrap gap-bd-xs" aria-label="Amenities incluidas">
            {amenities.map((amenity) => (
              <li key={amenity} className="rounded-bd-pill border border-bd-border-input px-bd-sm py-[3px] text-bd-secondary text-xs">
                {formatAmenity(amenity)}
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-auto flex flex-col gap-bd-md border-t border-bd-subtle pt-bd-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-bd-muted text-bd-xs uppercase tracking-widest">Precio por noche</p>
            <p className="text-bd-primary text-bd-xl font-bold">{formatMoney(habitacion.precioNoche)}</p>
          </div>
          <BdButton href={`/reservas/habitaciones/${habitacion.id}`} variant="cta">
            Ver detalle
          </BdButton>
        </footer>
      </div>
    </article>
  );
}

function LoadingResults() {
  return (
    <div className="flex flex-col gap-bd-lg">
      {[0, 1, 2].map((item) => (
        <div key={item} className="bd-card flex min-h-[160px] gap-bd-lg">
          <div className="bd-skeleton hidden w-[220px] md:block" />
          <div className="flex flex-1 flex-col gap-bd-md">
            <div className="bd-skeleton h-6 w-1/2" />
            <div className="bd-skeleton h-4 w-2/3" />
            <div className="bd-skeleton h-4 w-1/3" />
            <div className="bd-skeleton mt-auto h-9 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function buildFilters(form: SearchFormState, page: number): BuscarHabitacionesFiltros {
  const locationValues = [form.latitud, form.longitud, form.maxDistancia];
  const hasPartialLocation = locationValues.some(Boolean);
  const hasFullLocation = locationValues.every(Boolean) && Boolean(form.unidad);

  if (hasPartialLocation && !hasFullLocation) {
    throw new Error('Para filtrar por ubicacion informa latitud, longitud, distancia maxima y unidad.');
  }

  return {
    checkIn: toIsoDate(form.checkIn),
    checkOut: toIsoDate(form.checkOut),
    capacidad: Number(form.capacidad),
    precioMin: parseOptionalNumber(form.precioMin),
    precioMax: parseOptionalNumber(form.precioMax),
    categoria: parseOptionalNumber(form.categoria),
    amenities: parseAmenities(form.amenities),
    latitud: parseOptionalNumber(form.latitud),
    longitud: parseOptionalNumber(form.longitud),
    maxDistancia: parseOptionalNumber(form.maxDistancia),
    unidad: hasFullLocation ? form.unidad : undefined,
    page,
    size: DEFAULT_PAGE_SIZE,
  };
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value) return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function parseAmenities(value: string): string[] | undefined {
  const amenities = value
    .split(',')
    .map((amenity) => amenity.trim())
    .filter(Boolean);

  return amenities.length > 0 ? amenities : undefined;
}

function toIsoDate(value: string): string {
  return `${value}T00:00:00Z`;
}

function formatMoney(value?: number): string {
  if (value == null) return '-';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAmenity(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
