'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearReserva, getHabitacionesCacheadas, HabitacionCacheada } from '@/lib/reservas-api';
import { getHoteles, Hotel } from '@/lib/gestion-api';
import { buscarUsuariosPorDni, Usuario } from '@/lib/api';
import BdPageLayout from '@/components/BdPageLayout';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';
import BdCard from '@/components/BdCard';
import BdAlert from '@/components/BdAlert';

const PAGE_SIZE = 10;

export default function NuevaReservaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [habitaciones, setHabitaciones] = useState<HabitacionCacheada[]>([]);

  const [dniInput, setDniInput] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(null);
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Usuario[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [buscandoUsuario, setBuscandoUsuario] = useState(false);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  const [selectedHotelId, setSelectedHotelId] = useState<number | ''>('');
  const [selectedHabitacionId, setSelectedHabitacionId] = useState<string>('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [hotelesData, habitacionesData] = await Promise.all([
          getHoteles(),
          getHabitacionesCacheadas(),
        ]);
        setHoteles(hotelesData);
        setHabitaciones(habitacionesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuscarUsuario = async (page = 0) => {
    if (!dniInput.trim()) return;
    setBuscandoUsuario(true);
    setError(null);
    setUsuarioEncontrado(null);
    try {
      const result = await buscarUsuariosPorDni(dniInput.trim(), page, PAGE_SIZE);
      setResultadosBusqueda(result.content);
      setTotalResultados(result.totalElements);
      setPaginaActual(page);
      setTotalPaginas(result.totalPages);
      setMostrandoResultados(true);
    } catch {
      setResultadosBusqueda([]);
      setTotalResultados(0);
      setError('Error al buscar usuarios');
    } finally {
      setBuscandoUsuario(false);
    }
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setUsuarioEncontrado(usuario);
    setDniInput(usuario.dni);
    setMostrandoResultados(false);
    setResultadosBusqueda([]);
  };

  const handleDniChange = (value: string) => {
    setDniInput(value);
    setUsuarioEncontrado(null);
    setMostrandoResultados(false);
    setResultadosBusqueda([]);
  };

  const habitacionesFiltradas = selectedHotelId
    ? habitaciones.filter((h) => h.hotel?.id === selectedHotelId)
    : [];

  const selectedHotel = hoteles.find((hotel) => hotel.id === selectedHotelId) ?? null;

  const habitacionSeleccionada = habitacionesFiltradas.find((h) => h.id === selectedHabitacionId) ?? null;
  const precioNocheEstimado = habitacionSeleccionada?.precioNoche ?? null;
  const nochesEstimadas = calcularNoches(checkIn, checkOut);
  const precioTotalEstimado = precioNocheEstimado != null && nochesEstimadas != null
    ? precioNocheEstimado * nochesEstimadas
    : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!selectedHotelId || !selectedHabitacionId || !usuarioEncontrado) return;

      const habitacion = habitaciones.find((h) => h.id === selectedHabitacionId);
      if (!habitacion) throw new Error('Habitación no encontrada');

      const reserva = await crearReserva({
        idHabitacion: habitacion.habitacionId.toString(),
        hotelId: selectedHotelId,
        checkIn: `${checkIn}T00:00:00Z`,
        checkOut: `${checkOut}T00:00:00Z`,
        huesped: {
          idUsuario: usuarioEncontrado.id.toString(),
          nombreApellido: `${usuarioEncontrado.nombre}`,
          email: usuarioEncontrado.email,
        },
      });

      router.push(reserva?._id ? `/reservas/detalle/${reserva._id}` : '/reservas/lista');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <BdPageLayout>
        <div className="mx-auto max-w-4xl">
          <BdBackLink href="/reservas/lista" className="mb-bd-lg" />
          <BdCard title="Nueva Reserva" className="max-w-4xl">
            <p className="text-bd-secondary bd-skeleton bd-skeleton-text">Cargando datos...</p>
          </BdCard>
        </div>
      </BdPageLayout>
    );
  }

  return (
    <BdPageLayout>
      <div className="mx-auto w-full max-w-4xl">
        <BdBackLink href="/reservas/lista" className="mb-bd-lg" />

        <div className="mb-bd-xl flex flex-wrap items-start justify-between gap-bd-md">
          <div>
            <h1 className="text-bd-primary text-bd-xl font-bold">Nueva Reserva</h1>
            <p className="text-bd-secondary">
              Completá los datos esenciales y revisá el resumen antes de guardar.
            </p>
          </div>
          <div className="rounded-bd-full border border-bd-subtle bg-bd-surface-2 px-bd-md py-bd-sm text-bd-secondary text-bd-sm">
            Estado inicial: Reservada
          </div>
        </div>

        {error && <BdAlert variant="error" className="mb-bd-lg">{error}</BdAlert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-bd-lg">
          <BdCard title="Selección base">
            <div className="grid gap-bd-md md:grid-cols-2">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Hotel *</span>
                <select
                  required
                  value={selectedHotelId}
                  onChange={(e) => { setSelectedHotelId(e.target.value ? Number(e.target.value) : ''); setSelectedHabitacionId(''); }}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                >
                  <option value="">Seleccionar hotel...</option>
                  {hoteles.map((hotel) => (
                    <option key={hotel.id} value={hotel.id} disabled={Boolean(hotel.cerrado)}>
                      {hotel.nombre}{hotel.cerrado ? ' - Cerrado' : ''}
                    </option>
                  ))}
                </select>
                {selectedHotel?.cerrado && (
                  <p className="text-bd-urgency text-bd-xs">
                    Este hotel está cerrado y no permite crear reservas.
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Habitación *</span>
                <select
                  required
                  value={selectedHabitacionId}
                  onChange={(e) => setSelectedHabitacionId(e.target.value)}
                  disabled={!selectedHotelId}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus disabled:opacity-60"
                >
                  <option value="">{selectedHotelId ? 'Seleccionar habitación...' : 'Primero seleccione un hotel'}</option>
                  {habitacionesFiltradas.map((h) => (
                    <option key={h.id} value={h.id}>N° {h.numero} - {h.tipoHabitacion || 'Sin tipo'} (Cap. {h.capacidad})</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-bd-lg rounded-bd-md border border-bd-subtle bg-bd-surface-2 p-bd-md">
              <div className="flex items-center justify-between gap-bd-sm">
                <div>
                  <h3 className="text-bd-primary font-semibold">Tarifa estimada</h3>
                  <p className="text-bd-secondary text-bd-sm">Se toma del valor vigente de la habitación seleccionada.</p>
                </div>
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Solo lectura</span>
              </div>
              <div className="mt-bd-md grid gap-bd-md md:grid-cols-3">
                <div>
                  <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Precio por noche</span>
                  <p className="text-bd-primary mt-1 text-bd-lg font-semibold">{formatMoney(precioNocheEstimado)}</p>
                </div>
                <div>
                  <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Noches</span>
                  <p className="text-bd-primary mt-1 text-bd-lg font-semibold">{nochesEstimadas ?? '-'}</p>
                </div>
                <div>
                  <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Total estimado</span>
                  <p className="text-bd-primary mt-1 text-bd-lg font-semibold">{formatMoney(precioTotalEstimado)}</p>
                </div>
              </div>
            </div>
          </BdCard>

          <BdCard title="Huésped">
            <div className="flex flex-col gap-bd-md">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Buscar por DNI *</span>
                <div className="flex flex-col gap-bd-sm sm:flex-row sm:items-center">
                  <input
                    type="text"
                    required={!usuarioEncontrado}
                    value={dniInput}
                    onChange={(e) => handleDniChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleBuscarUsuario(); } }}
                    placeholder="Buscar por DNI..."
                    className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                  />
                  <BdButton type="button" variant="primary" size="md" onClick={() => handleBuscarUsuario()} disabled={buscandoUsuario || !dniInput.trim()}>
                    {buscandoUsuario ? 'Buscando...' : 'Buscar'}
                  </BdButton>
                </div>
              </label>

              {mostrandoResultados && resultadosBusqueda.length > 0 && !usuarioEncontrado && (
                <div className="rounded-bd-md border border-bd-subtle bg-bd-surface-2 overflow-hidden">
                  {resultadosBusqueda.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => seleccionarUsuario(u)}
                      className="flex w-full flex-col items-start gap-1 border-b border-bd-subtle px-bd-md py-bd-sm text-left transition-colors last:border-b-0 hover:bg-bd-surface"
                    >
                      <strong className="text-bd-primary">{u.nombre} {u.apellido}</strong>
                      <span className="text-bd-secondary text-bd-sm">DNI: {u.dni} · {u.email}</span>
                    </button>
                  ))}
                  {totalPaginas > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-bd-sm border-t border-bd-subtle px-bd-md py-bd-sm text-bd-sm text-bd-secondary">
                      <BdButton type="button" variant="ghost" size="sm" disabled={paginaActual === 0} onClick={() => handleBuscarUsuario(paginaActual - 1)}>
                        Anterior
                      </BdButton>
                      <span>
                        Pág. {paginaActual + 1} de {totalPaginas} ({totalResultados} resultados)
                      </span>
                      <BdButton type="button" variant="ghost" size="sm" disabled={paginaActual >= totalPaginas - 1} onClick={() => handleBuscarUsuario(paginaActual + 1)}>
                        Siguiente
                      </BdButton>
                    </div>
                  )}
                </div>
              )}

              {mostrandoResultados && resultadosBusqueda.length === 0 && !buscandoUsuario && !usuarioEncontrado && (
                <BdAlert variant="warning" message="No se encontraron usuarios con ese DNI" />
              )}

              {usuarioEncontrado && (
                <div className="flex items-center justify-between gap-bd-sm rounded-bd-md border border-bd-subtle bg-bd-surface-2 px-bd-md py-bd-sm">
                  <div>
                    <p className="text-bd-primary font-semibold">
                      {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
                    </p>
                    <p className="text-bd-secondary text-bd-sm">{usuarioEncontrado.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUsuarioEncontrado(null); setDniInput(''); }}
                    className="bd-btn bd-btn-ghost bd-btn-sm"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>
          </BdCard>

          <BdCard title="Fechas de estadía">
            <div className="grid gap-bd-md md:grid-cols-2">
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Check In *</span>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>
              <label className="flex flex-col gap-bd-xs">
                <span className="text-bd-muted text-bd-xs uppercase tracking-widest">Check Out *</span>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-bd-input text-bd-primary border-bd-border-input rounded-bd-md p-bd-sm w-full focus:border-bd-focus focus:ring-bd-focus"
                />
              </label>
            </div>
          </BdCard>

          <div className="flex flex-col gap-bd-sm sm:flex-row sm:justify-end">
            <BdButton type="button" variant="ghost" size="md" onClick={() => router.push('/reservas/lista')} disabled={loading}>
              Cancelar
            </BdButton>
            <BdButton type="submit" variant="cta" size="md" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Reserva'}
            </BdButton>
          </div>
        </form>
      </div>
    </BdPageLayout>
  );
}

function calcularNoches(checkIn: string, checkOut: string): number | null {
  if (!checkIn || !checkOut) return null;

  const inicio = new Date(`${checkIn}T00:00:00Z`);
  const fin = new Date(`${checkOut}T00:00:00Z`);
  const diff = Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

  return Number.isFinite(diff) && diff > 0 ? diff : null;
}

function formatMoney(value: number | null): string {
  if (value == null) return '-';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
}
