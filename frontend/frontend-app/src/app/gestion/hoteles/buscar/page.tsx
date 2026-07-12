'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdAlert from '@/components/BdAlert';
import { Amenity, AmenityHotel, getAvailableAmenities, Hotel, searchHotelesByAmenities } from '@/lib/gestion-api';

function formatAmenityLabel(amenity: Amenity) {
  return amenity
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeAmenity(amenity: string | AmenityHotel) {
  return typeof amenity === 'string' ? amenity : amenity.amenity;
}

export default function BuscarHotelesPage() {
  const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [results, setResults] = useState<Hotel[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const hasSelection = selectedAmenities.length > 0;
  const canSearch = hasSelection && !loadingAmenities && !amenitiesError;
  const hintText = useMemo(() => {
    if (!hasSelection) {
      return 'Selecciona amenities para buscar hoteles que cumplan con todos.';
    }
    return 'Se mostraran solo hoteles que incluyan todos los amenities seleccionados.';
  }, [hasSelection]);

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const removeAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) => prev.filter((item) => item !== amenity));
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoadingAmenities(true);
        setAmenitiesError(null);
        setAvailableAmenities(await getAvailableAmenities());
      } catch (err) {
        setAmenitiesError(err instanceof Error ? err.message : 'Error al cargar amenities');
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, []);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      setResults(await searchHotelesByAmenities(selectedAmenities));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar hoteles');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-5xl">
        <BdBackLink href="/gestion/hoteles" className="mb-bd-lg" />

        <h1 className="text-bd-primary text-bd-xl font-bold">Buscar hoteles por amenities</h1>
        <p className="text-bd-secondary mb-bd-lg">
          Filtro de hoteles en gestion-svc.
        </p>

        <BdCard className="mb-bd-xl">
          <form onSubmit={handleSearch} className="flex flex-col gap-bd-lg">
            <div>
              <p className="text-bd-muted text-bd-xs uppercase tracking-[0.2em]">Amenities</p>
              <p className="text-bd-secondary text-sm mt-bd-xs">{hintText}</p>
              <p className="text-bd-muted text-xs mt-bd-xs">
                Seleccionados: {selectedAmenities.length}
              </p>
            </div>
            {loadingAmenities ? (
              <p className="text-bd-muted text-sm">Cargando amenities disponibles...</p>
            ) : (
              <div className="grid gap-bd-md sm:grid-cols-2 lg:grid-cols-3">
                {availableAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className={`flex items-center gap-bd-sm rounded-bd-md border px-bd-md py-bd-sm text-sm transition-all ${isSelected ? 'border-bd-medium bg-bd-card-hover text-bd-primary shadow-bd-card' : 'border-bd-subtle bg-bd-card text-bd-secondary hover:border-bd-medium hover:bg-bd-card-hover hover:text-bd-primary'}`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-bd-blue-bright"
                        checked={isSelected}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span>{formatAmenityLabel(amenity)}</span>
                    </label>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-bd-sm">
              <BdButton type="submit" variant="primary" disabled={!canSearch || loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </BdButton>
              <BdButton
                type="button"
                variant="ghost"
                disabled={!hasSelection || loading}
                onClick={() => setSelectedAmenities([])}
              >
                Limpiar
              </BdButton>
            </div>
            {hasSelection && (
              <div className="flex flex-col gap-bd-sm">
                <p className="text-bd-muted text-xs uppercase tracking-[0.2em]">Filtros activos</p>
                <div className="flex flex-wrap gap-bd-sm">
                  {selectedAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="inline-flex items-center gap-bd-xs rounded-bd-pill border border-bd-medium bg-bd-card-hover px-bd-md py-[6px] text-xs font-semibold text-bd-primary transition-colors hover:border-bd-blue-bright"
                      aria-label={`Quitar ${formatAmenityLabel(amenity)}`}
                    >
                      {formatAmenityLabel(amenity)}
                      <span className="text-bd-muted">×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!loadingAmenities && availableAmenities.length === 0 && (
              <p className="text-bd-muted text-sm">No hay amenities disponibles en la base.</p>
            )}
          </form>
        </BdCard>

        {amenitiesError && (
          <BdAlert variant="error" className="mb-bd-lg" onClose={() => setAmenitiesError(null)}>
            <strong>Error:</strong> {amenitiesError}
          </BdAlert>
        )}

        {error && (
          <BdAlert variant="error" className="mb-bd-lg" onClose={() => setError(null)}>
            <strong>Error:</strong> {error}
          </BdAlert>
        )}

        {searched && !loading && (
          results.length === 0 ? (
            <p className="text-bd-secondary">No se encontraron hoteles con esos amenities.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-bd-sm mb-bd-md">
                <p className="text-bd-secondary text-sm">
                  Resultados: <span className="text-bd-primary font-semibold">{results.length}</span>
                </p>
                <div className="flex flex-wrap gap-bd-sm">
                  {selectedAmenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center rounded-bd-pill border border-bd-subtle bg-bd-card px-bd-sm py-[4px] text-xs text-bd-secondary"
                    >
                      {formatAmenityLabel(amenity)}
                    </span>
                  ))}
                </div>
              </div>
              <BdTable>
                <table className="bd-table w-full" border={1} cellPadding="10">
                <thead>
                  <tr>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Nombre</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Domicilio</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Categoría</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Teléfono</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Amenities</th>
                    <th className="text-bd-muted font-semibold text-bd-xs uppercase tracking-wider whitespace-nowrap p-bd-md text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((hotel) => (
                    <tr key={hotel.id}>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.nombre}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.domicilio || '-'}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.categoria ?? '-'}</td>
                      <td className="p-bd-md text-bd-primary border-b border-bd-subtle">{hotel.telefono || '-'}</td>
                      <td className="p-bd-md text-bd-secondary border-b border-bd-subtle">
                        {hotel.amenities?.length
                          ? hotel.amenities.map((amenity) => formatAmenityLabel(normalizeAmenity(amenity) as Amenity)).join(', ')
                          : '-'}
                      </td>
                      <td className="p-bd-md border-b border-bd-subtle">
                        <Link className="text-bd-link" href={`/gestion/hoteles/${hotel.id}`}>
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </BdTable>
            </>
          )
        )}
      </div>
    </BdPageLayout>
  );
}
