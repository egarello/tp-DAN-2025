'use client';

import Link from 'next/link';
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
      <Link href="/gestion/habitaciones" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Habitaciones
      </Link>

      <h1>Detalle de Habitación</h1>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}
      {loading ? <p>Cargando...</p> : habitacion ? (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '900px' }}>
          <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h2>Habitación</h2>
            <p><strong>Número:</strong> {habitacion.numero}</p>
            <p><strong>Piso:</strong> {habitacion.piso}</p>
            <p><strong>Hotel:</strong> {habitacion.hotel?.nombre || '-'}</p>
            <Link href={`/gestion/habitaciones/editar/${habitacion.id}`} style={{ display: 'inline-block', marginTop: '12px', padding: '10px 16px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px' }}>
              Editar Habitación
            </Link>
            <button onClick={handleEliminar} style={{ marginTop: '12px', marginLeft: '10px', padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Eliminar Habitación
            </button>
          </section>

          <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h2>Tipo de Habitación</h2>
            {tipoHabitacion ? (
              <>
                <p><strong>Nombre:</strong> {tipoHabitacion.nombre || '-'}</p>
                <p><strong>Capacidad:</strong> {tipoHabitacion.capacidad ?? '-'}</p>
                <p><strong>Descripción:</strong> {tipoHabitacion.descripcion || '-'}</p>
              </>
            ) : (
              <p>No hay tipo de habitación asociado.</p>
            )}
          </section>

          <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h2>Tarifa Vigente</h2>
            {tarifaError ? (
              <div style={{ color: 'red' }}>{tarifaError}</div>
            ) : tarifa ? (
              <>
                <p><strong>Fecha Inicio:</strong> {tarifa.fechaInicio}</p>
                <p><strong>Fecha Fin:</strong> {tarifa.fechaFin}</p>
                <p><strong>Precio por Noche:</strong> {tarifa.precioNoche}</p>
                <p><strong>Tipo Habitación:</strong> {tarifa.tipoHabitacion?.nombre || tipoHabitacion?.nombre || '-'}</p>
              </>
            ) : (
              <p>No hay tarifa vigente para esta habitación.</p>
            )}
          </section>
        </div>
      ) : <p>Habitación no encontrada</p>}
    </BdPageLayout>
  );
}
