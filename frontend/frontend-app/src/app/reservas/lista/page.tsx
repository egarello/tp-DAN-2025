'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getReservasByHotelIds, Reserva, pagarReserva, finalizarReserva, cancelarReserva } from '@/lib/reservas-api';
import { getHoteles, Hotel } from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdTable from '@/components/BdTable';
import BdButton from '@/components/BdButton';
import BdBackLink from '@/components/BdBackLink';
import PaymentModal from '@/components/PaymentModal';
import ReviewModal from '@/components/ReviewModal';
import CancelModal from '@/components/CancelModal';
import BdAlert from '@/components/BdAlert';
import BdEmptyState from '@/components/BdEmptyState';

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

const PAGABLES = new Set(['RESERVADA', 'CONFIRMADA', 'ADEUDADA']);
const CANCELABLES = new Set(['RESERVADA', 'CONFIRMADA']);

export default function ReservasListaPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingHoteles, setLoadingHoteles] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [selectedHotelIds, setSelectedHotelIds] = useState<number[]>([]);
  const [appliedHotelIds, setAppliedHotelIds] = useState<number[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotelesError, setHotelesError] = useState<string | null>(null);

  const [activePaymentReserva, setActivePaymentReserva] = useState<Reserva | null>(null);
  const [activeReviewReserva, setActiveReviewReserva] = useState<Reserva | null>(null);
  const [activeCancelReserva, setActiveCancelReserva] = useState<Reserva | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHoteles();
  }, []);

  const hotelesById = new Map(hoteles.map((hotel) => [hotel.id, hotel]));

  const fetchHoteles = async () => {
    try {
      setLoadingHoteles(true);
      setHotelesError(null);
      setHoteles(await getHoteles());
    } catch (err) {
      setHotelesError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingHoteles(false);
    }
  };

  const fetchReservas = async (hotelIds: number[]) => {
    if (hotelIds.length === 0) {
      setReservas([]);
      return;
    }

    try {
      setLoadingReservas(true);
      setError(null);
      setReservas(await getReservasByHotelIds(hotelIds));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingReservas(false);
    }
  };

  const toggleHotel = (hotelId: number) => {
    setSelectedHotelIds((current) => (
      current.includes(hotelId)
        ? current.filter((id) => id !== hotelId)
        : [...current, hotelId]
    ));
  };

  const handleBuscar = async () => {
    setAppliedHotelIds(selectedHotelIds);
    setHasSearched(true);
    await fetchReservas(selectedHotelIds);
  };

  const handleLimpiar = () => {
    setSelectedHotelIds([]);
    setAppliedHotelIds([]);
    setHasSearched(false);
    setReservas([]);
    setError(null);
    setActionError(null);
  };

  const refreshReservas = async () => {
    if (appliedHotelIds.length === 0) {
      setReservas([]);
      return;
    }

    await fetchReservas(appliedHotelIds);
  };

  const sumPagos = (r: Reserva) => (r.pago?.reduce((s, p) => s + ((p.amount?.precio) || 0), 0) || 0);
  const saldoPendiente = (r: Reserva) => (r.precioTotal != null ? Math.max(0, r.precioTotal - sumPagos(r)) : undefined);

  const handlePagar = async (reserva: Reserva, pago: any) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await pagarReserva(reserva._id, pago);
      await refreshReservas();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al pagar');
    } finally {
      setActionLoading(false);
      setActivePaymentReserva(null);
    }
  };

  const handleFinalizar = async (reserva: Reserva, review: any) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await finalizarReserva(reserva._id, review);
      await refreshReservas();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al finalizar');
    } finally {
      setActionLoading(false);
      setActiveReviewReserva(null);
    }
  };

  const handleCancelar = async () => {
    if (!activeCancelReserva) return;
    setActionError(null);
    setActionLoading(true);
    try {
      await cancelarReserva(activeCancelReserva._id);
      await refreshReservas();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al cancelar');
      throw err;
    } finally {
      setActionLoading(false);
      setActiveCancelReserva(null);
    }
  };

  // Demo flag: show Finalizar for host. Replace with real auth check later.
  const isHostDemo = true;

  return (
    <BdPageLayout>
      <BdBackLink href="/reservas">Reservas</BdBackLink>

      <div className="flex flex-wrap items-start justify-between gap-bd-md">
        <div>
          <h1 className="text-bd-primary">Reservas</h1>
          <p className="text-bd-secondary">Seleccioná uno o más hoteles y presioná Buscar para cargar sus reservas.</p>
        </div>
        <BdButton href="/reservas/nueva" variant="primary" size="md">+ Nueva Reserva</BdButton>
      </div>

      <section className="rounded-bd-lg border border-bd-subtle bg-bd-surface-2 p-bd-lg">
        <div className="mb-bd-md flex items-center justify-between gap-bd-sm">
          <div>
            <h2 className="text-bd-primary text-bd-md font-semibold">Filtrar por hotel</h2>
            <p className="text-bd-secondary text-bd-sm">La lista no consulta reservas hasta que presiones el botón.</p>
          </div>
          <span className="text-bd-secondary text-bd-sm">Seleccionados: {selectedHotelIds.length}</span>
        </div>

        {hotelesError && <div className="bd-alert bd-alert-error mb-bd-md"><strong>Error:</strong> {hotelesError}</div>}

        {loadingHoteles ? (
          <p className="bd-skeleton bd-skeleton-text">Cargando hoteles...</p>
        ) : hoteles.length === 0 ? (
          <BdEmptyState
            title="No hay hoteles disponibles"
            message="No se puede buscar reservas hasta que el backend devuelva hoteles."
          />
        ) : (
          <div className="grid gap-bd-sm md:grid-cols-2 xl:grid-cols-3">
            {hoteles.map((hotel) => (
              <label
                key={hotel.id}
                className={`flex cursor-pointer items-start gap-bd-sm rounded-bd-md border p-bd-md transition-colors ${selectedHotelIds.includes(hotel.id) ? 'border-bd-blue-bright bg-[rgba(45,212,191,0.08)]' : 'border-bd-subtle bg-bd-surface'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedHotelIds.includes(hotel.id)}
                  onChange={() => toggleHotel(hotel.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-bd-primary font-medium">{hotel.nombre}</span>
                  <span className="block text-bd-secondary text-bd-sm">{hotel.domicilio || `Hotel ${hotel.id}`}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-bd-md flex flex-wrap gap-bd-sm">
          <BdButton
            variant="primary"
            size="md"
            onClick={handleBuscar}
            disabled={loadingHoteles || loadingReservas || selectedHotelIds.length === 0}
          >
            Buscar reservas
          </BdButton>
          <BdButton
            variant="ghost"
            size="md"
            onClick={handleLimpiar}
            disabled={selectedHotelIds.length === 0 && appliedHotelIds.length === 0 && reservas.length === 0}
          >
            Limpiar
          </BdButton>
        </div>
      </section>

      {error && <div className="bd-alert bd-alert-error"><strong>Error:</strong> {error}</div>}
      {actionError && <BdAlert variant="error" message={actionError} onClose={() => setActionError(null)} />}

      {loadingReservas ? (
        <p className="bd-skeleton bd-skeleton-text">Cargando reservas...</p>
      ) : !hasSearched ? (
        <BdEmptyState
          title="Seleccioná hoteles para ver reservas"
          message="La tabla queda vacía hasta que ejecutes la búsqueda."
        />
      ) : reservas.length === 0 ? (
        <BdEmptyState
          title="No hay reservas para los hoteles seleccionados"
          message="Probá con otro hotel o ampliá la selección."
          action={<BdButton variant="ghost" size="sm" onClick={handleLimpiar}>Limpiar filtro</BdButton>}
        />
      ) : (
        <BdTable><table className="bd-table w-full" border={1} cellPadding="10">
          <thead>
            <tr>
              <th>Huésped</th>
              <th>Hotel</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => {
              const hotel = hotelesById.get(reserva.hotelId);
              const hotelLabel = hotel ? hotel.nombre : `Hotel ${reserva.hotelId}`;
              return (
                <tr key={reserva._id}>
                  <td>{reserva.huesped?.nombreApellido || reserva.huesped?.idUsuario || '-'}</td>
                  <td>{hotelLabel}</td>
                  <td>{formatFecha(reserva.checkIn)}</td>
                  <td>{formatFecha(reserva.checkOut)}</td>
                  <td>{reserva.precioTotal != null ? `$${reserva.precioTotal.toFixed(2)}` : '-'}</td>
                  <td>{reserva.estadoReserva || reserva.status || '-'}</td>
                  <td className="bd-row-actions">
                    <Link className="text-bd-link" href={`/reservas/detalle/${reserva._id}`}>Ver</Link>
                    {PAGABLES.has(reserva.estadoReserva || '') && (
                      <BdButton variant="cta" size="sm" onClick={() => setActivePaymentReserva(reserva)} className="ml-2" disabled={actionLoading}>Pagar</BdButton>
                    )}
                    {CANCELABLES.has(reserva.estadoReserva || '') && (reserva.pago?.length ?? 0) === 0 && (
                      <BdButton variant="danger" size="sm" onClick={() => setActiveCancelReserva(reserva)} className="ml-2" disabled={actionLoading}>Cancelar</BdButton>
                    )}
                    {isHostDemo && (
                      <BdButton variant="ghost" size="sm" onClick={() => setActiveReviewReserva(reserva)} className="ml-2" disabled={actionLoading}>Finalizar</BdButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table></BdTable>
      )}

      <PaymentModal
        open={!!activePaymentReserva}
        onClose={() => setActivePaymentReserva(null)}
        saldoPendiente={activePaymentReserva ? saldoPendiente(activePaymentReserva) : undefined}
        onSubmit={async (pago) => {
          if (!activePaymentReserva) return;
          await handlePagar(activePaymentReserva, pago);
        }}
      />

      <ReviewModal
        open={!!activeReviewReserva}
        onClose={() => setActiveReviewReserva(null)}
        onSubmit={async (review) => {
          if (!activeReviewReserva) return;
          await handleFinalizar(activeReviewReserva, review);
        }}
      />

      <CancelModal
        open={!!activeCancelReserva}
        reserva={activeCancelReserva}
        onClose={() => setActiveCancelReserva(null)}
        onConfirm={handleCancelar}
      />
    </BdPageLayout>
  );
}