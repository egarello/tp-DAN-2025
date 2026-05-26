'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  eliminarHabitacion,
  getHabitacionPorId,
  getTarifaPorHabitacion,
  getTipoHabitacionPorId,
  Habitacion,
  Tarifa,
  TipoHabitacion,
} from '@/lib/gestion-api';
import BdPageLayout from '@/components/BdPageLayout';
import BdCard from '@/components/BdCard';
import BdBackLink from '@/components/BdBackLink';
import BdButton from '@/components/BdButton';

export default function HabitacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [tipoHabitacion, setTipoHabitacion] = useState<TipoHabitacion | null>(null);
  const [tarifa, setTarifa] = useState<Tarifa | null>(null);
  const [tarifaError, setTarifaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitacion = async () => {
      try {
        setLoading(true);
        setError(null);
        setTarifaError(null);

        const habitacionData = await getHabitacionPorId(roomId);
        setHabitacion(habitacionData);

        const tipo = habitacionData.tipoHabitacion;
        if (tipo?.id && (!tipo.nombre || tipo.capacidad == null)) {
          setTipoHabitacion(await getTipoHabitacionPorId(tipo.id));
        } else {
          setTipoHabitacion(tipo || null);
        }

        try {
          setTarifa(await getTarifaPorHabitacion(roomId));
        } catch (tarifaErr) {
          setTarifa(null);
          setTarifaError(tarifaErr instanceof Error ? tarifaErr.message : 'Error al cargar la tarifa vigente');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchHabitacion();
  }, [roomId]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar definitivamente esta habitación?')) return;
    try {
      setError(null);
      await eliminarHabitacion(roomId);
      router.push('/gestion/habitaciones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la habitación');
    }
  };

  return (
    <BdPageLayout>
      <BdBackLink href="/gestion/habitaciones" className="mb-bd-lg" />
      {/* style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }} */}

      <h1 className="text-bd-primary">Detalle de Habitación</h1>
      {error && (
        <div className="bd-alert bd-alert-error">
          {/* style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }} */}
          <strong>Error:</strong> {error}
        </div>
      )}
      {loading ? (
        <div className="bd-skeleton bd-skeleton-text" />
      ) : habitacion ? (
        <div className="flex flex-col gap-bd-lg" style={{ maxWidth: '900px' }}>
          {/* style={{ display: 'grid', gap: '20px', maxWidth: '900px' }} */}

          <BdCard>
            {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
            <h2 className="text-bd-primary mb-bd-md">Habitación</h2>
            <p className="text-bd-primary mb-bd-sm"><strong>Número:</strong> {habitacion.numero}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Piso:</strong> {habitacion.piso}</p>
            <p className="text-bd-primary mb-bd-sm"><strong>Hotel:</strong> {habitacion.hotel?.nombre || '-'}</p>
            <div className="mt-bd-lg flex flex-row gap-bd-sm">
              <BdButton variant="primary" href={`/gestion/habitaciones/editar/${habitacion.id}`}>
                Editar Habitación
              </BdButton>
              <BdButton variant="danger" onClick={handleEliminar}>
                Eliminar Habitación
              </BdButton>
            </div>
          </BdCard>

          <BdCard>
            {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
            <h2 className="text-bd-primary mb-bd-md">Tipo de Habitación</h2>
            {tipoHabitacion ? (
              <>
                <p className="text-bd-primary mb-bd-sm"><strong>Nombre:</strong> {tipoHabitacion.nombre || '-'}</p>
                <p className="text-bd-primary mb-bd-sm"><strong>Capacidad:</strong> {tipoHabitacion.capacidad ?? '-'}</p>
                <p className="text-bd-primary mb-bd-sm"><strong>Descripción:</strong> {tipoHabitacion.descripcion || '-'}</p>
              </>
            ) : (
              <p className="text-bd-secondary">No hay tipo de habitación asociado.</p>
            )}
          </BdCard>

          <BdCard>
            {/* style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} */}
            <h2 className="text-bd-primary mb-bd-md">Tarifa Vigente</h2>
            {tarifaError ? (
              <div className="bd-alert bd-alert-error">
                {/* style={{ color: 'red' }} */}
                {tarifaError}
              </div>
            ) : tarifa ? (
              <>
                <p className="text-bd-primary mb-bd-sm"><strong>Fecha Inicio:</strong> {tarifa.fechaInicio}</p>
                <p className="text-bd-primary mb-bd-sm"><strong>Fecha Fin:</strong> {tarifa.fechaFin}</p>
                <p className="text-bd-primary mb-bd-sm"><strong>Precio por Noche:</strong> {tarifa.precioNoche}</p>
                <p className="text-bd-primary mb-bd-sm"><strong>Tipo Habitación:</strong> {tarifa.tipoHabitacion?.nombre || tipoHabitacion?.nombre || '-'}</p>
              </>
            ) : (
              <p className="text-bd-secondary">No hay tarifa vigente para esta habitación.</p>
            )}
          </BdCard>
        </div>
      ) : <p className="text-bd-secondary">Habitación no encontrada</p>}
    </BdPageLayout>
  );
}
