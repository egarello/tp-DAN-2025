'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { crearReserva, getHabitacionesCacheadas, HabitacionCacheada, EstadoReserva } from '@/lib/reservas-api';
import { getHoteles, Hotel } from '@/lib/gestion-api';
import { buscarUsuariosPorDni, Usuario } from '@/lib/api';

type EstadoLabel = { value: EstadoReserva; label: string };

const ESTADOS: EstadoLabel[] = [
  { value: 'RESERVADA', label: 'Reservada' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'FINALIZADA', label: 'Finalizada' },
  { value: 'BLOQUEADA', label: 'Bloqueada' },
  { value: 'ADEUDADA', label: 'Adeudada' },
];

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
  const [precioNoche, setPrecioNoche] = useState('');
  const [precioTotal, setPrecioTotal] = useState('');
  const [estadoReserva, setEstadoReserva] = useState<EstadoReserva>('RESERVADA');
  const [status, setStatus] = useState('');

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
        precioNoche: precioNoche ? Number(precioNoche) : undefined,
        precioTotal: precioTotal ? Number(precioTotal) : undefined,
        status: status || undefined,
        huesped: {
          idUsuario: usuarioEncontrado.id.toString(),
          nombreApellido: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}`,
          email: usuarioEncontrado.email,
        },
        estadoReserva,
      });

      router.push(reserva?._id ? `/reservas/detalle/${reserva._id}` : '/reservas/lista');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <div style={{ padding: '20px' }}><p>Cargando datos...</p></div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/reservas/lista" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        ← Reservas
      </Link>

      <h1>Nueva Reserva</h1>

      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red' }}><strong>Error:</strong> {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>
          Hotel *
          <select
            required
            value={selectedHotelId}
            onChange={(e) => { setSelectedHotelId(e.target.value ? Number(e.target.value) : ''); setSelectedHabitacionId(''); }}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Seleccionar hotel...</option>
            {hoteles.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Habitación *
          <select
            required
            value={selectedHabitacionId}
            onChange={(e) => setSelectedHabitacionId(e.target.value)}
            disabled={!selectedHotelId}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">{selectedHotelId ? 'Seleccionar habitación...' : 'Primero seleccione un hotel'}</option>
            {habitacionesFiltradas.map((h) => (
              <option key={h.id} value={h.id}>N° {h.numero} - {h.tipoHabitacion || 'Sin tipo'} (Cap. {h.capacidad})</option>
            ))}
          </select>
        </label>

        <label>
          Huésped *
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              required={!usuarioEncontrado}
              value={dniInput}
              onChange={(e) => handleDniChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleBuscarUsuario(); } }}
              placeholder="Buscar por DNI..."
              style={{ flex: 1, padding: '8px' }}
            />
            <button type="button" onClick={() => handleBuscarUsuario()} disabled={buscandoUsuario || !dniInput.trim()}
              style={{ padding: '8px 16px', backgroundColor: buscandoUsuario ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: buscandoUsuario ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {buscandoUsuario ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {mostrandoResultados && resultadosBusqueda.length > 0 && !usuarioEncontrado && (
            <div style={{ marginTop: '8px', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '260px', overflowY: 'auto' }}>
              {resultadosBusqueda.map((u) => (
                <div
                  key={u.id}
                  onClick={() => seleccionarUsuario(u)}
                  style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', backgroundColor: '#fff' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  <strong>{u.nombre} {u.apellido}</strong> — DNI: {u.dni} — {u.email}
                </div>
              ))}
              {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px', borderTop: '1px solid #eee' }}>
                  <button type="button" disabled={paginaActual === 0} onClick={() => handleBuscarUsuario(paginaActual - 1)}
                    style={{ padding: '4px 12px', ...disabledBtnStyle(paginaActual === 0) }}>
                    Anterior
                  </button>
                  <span style={{ padding: '4px 8px', alignSelf: 'center' }}>
                    Pág. {paginaActual + 1} de {totalPaginas} ({totalResultados} resultados)
                  </span>
                  <button type="button" disabled={paginaActual >= totalPaginas - 1} onClick={() => handleBuscarUsuario(paginaActual + 1)}
                    style={{ padding: '4px 12px', ...disabledBtnStyle(paginaActual >= totalPaginas - 1) }}>
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}

          {mostrandoResultados && resultadosBusqueda.length === 0 && !buscandoUsuario && !usuarioEncontrado && (
            <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
              No se encontraron usuarios con ese DNI
            </div>
          )}

          {usuarioEncontrado && (
            <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
              <strong>{usuarioEncontrado.nombre} {usuarioEncontrado.apellido}</strong> — {usuarioEncontrado.email}
              <button type="button" onClick={() => { setUsuarioEncontrado(null); setDniInput(''); }}
                style={{ marginLeft: '12px', padding: '2px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}>
                Cambiar
              </button>
            </div>
          )}
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            Check In *
            <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Check Out *
            <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            Precio por Noche
            <input type="number" step="0.01" min="0" value={precioNoche} onChange={(e) => setPrecioNoche(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Precio Total
            <input type="number" step="0.01" min="0" value={precioTotal} onChange={(e) => setPrecioTotal(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <label>
          Estado de Reserva
          <select value={estadoReserva} onChange={(e) => setEstadoReserva(e.target.value as EstadoReserva)} style={{ width: '100%', padding: '8px' }}>
            {ESTADOS.map((est) => (
              <option key={est.value} value={est.value}>{est.label}</option>
            ))}
          </select>
        </label>

        <label>
          Status (libre)
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Ej: PENDING, CONFIRMED" style={{ width: '100%', padding: '8px' }} />
        </label>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => router.push('/reservas/lista')} disabled={loading} style={{ padding: '10px 20px' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? 'Guardando...' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}

function disabledBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    backgroundColor: disabled ? '#e9ecef' : '#007bff',
    color: disabled ? '#999' : 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
