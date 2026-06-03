const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchReservas<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function sendReservas<T>(path: string, method: 'POST' | 'PUT', body: unknown): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) as T : null;
}

async function deleteReservas(path: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }
}

export interface HuespedReserva {
  idUsuario: string;
  nombreApellido?: string;
  email?: string;
}

export interface PagoAmount {
  precio: number;
  moneda: string;
}

export interface Pago {
  method: string;
  transactionId?: string;
  amount?: PagoAmount;
  status?: string;
}

export interface Review {
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export type EstadoReserva = 'CONFIRMADA' | 'RESERVADA' | 'CANCELADA' | 'FINALIZADA' | 'BLOQUEADA' | 'ADEUDADA';

export interface Reserva {
  _id: string;
  idHabitacion: string;
  hotelId: number;
  createdAt?: string;
  checkIn: string;
  checkOut: string;
  precioNoche?: number;
  precioTotal?: number;
  status?: string;
  huesped?: HuespedReserva;
  pago?: Pago[];
  clientReview?: Review | null;
  hostReview?: Review | null;
  estadoReserva?: EstadoReserva;
}

export interface ReservaSimple {
  _id: string;
  checkIn: string;
  checkOut: string;
  precioTotal?: number;
  estadoReserva?: EstadoReserva;
}

export interface HotelCacheado {
  id: number;
  nombre: string;
  categoria?: number;
  domicilio?: string;
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number];
  };
  cerrado?: boolean;
  fechaCierre?: string | null;
}

export interface HabitacionCacheada {
  id: string;
  habitacionId: number;
  numero: number;
  capacidad: number;
  precioNoche?: number;
  amenities?: string[];
  reservas?: ReservaSimple[];
  hotel?: HotelCacheado;
  idTipoHabitacion?: number;
  tipoHabitacion?: string;
}

export interface BuscarHabitacionesFiltros {
  checkIn: string;
  checkOut: string;
  capacidad: number;
  precioMin?: number;
  precioMax?: number;
  categoria?: number;
  amenities?: string[];
  latitud?: number;
  longitud?: number;
  maxDistancia?: number;
  unidad?: 'm' | 'km';
  page?: number;
  size?: number;
}

export interface HabitacionesSearchPage {
  content: HabitacionCacheada[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export async function getReservas(): Promise<Reserva[]> {
  return fetchReservas<Reserva[]>('/reservas/reservas');
}

export async function getReservasByHotelIds(hotelIds: number[]): Promise<Reserva[]> {
  if (hotelIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams();
  hotelIds.forEach((hotelId) => params.append('hotelIds', String(hotelId)));
  return fetchReservas<Reserva[]>(`/reservas/reservas?${params.toString()}`);
}

export async function getReservaPorId(id: string): Promise<Reserva> {
  return fetchReservas<Reserva>(`/reservas/reservas/${id}`);
}

export async function getHabitacionesCacheadas(): Promise<HabitacionCacheada[]> {
  return fetchReservas<HabitacionCacheada[]>('/reservas/habitaciones');
}

export async function buscarHabitaciones(filtros: BuscarHabitacionesFiltros): Promise<HabitacionesSearchPage> {
  const params = new URLSearchParams();

  Object.entries(filtros).forEach(([key, value]) => {
    if (value == null || value === '') {
      return;
    }

    if (key === 'amenities' && Array.isArray(value)) {
      value.filter(Boolean).forEach((amenity) => params.append('amenities', amenity));
      return;
    }

    if (!Array.isArray(value)) {
      params.append(key, String(value));
    }
  });

  return fetchReservas<HabitacionesSearchPage>(`/reservas/habitaciones/search?${params.toString()}`);
}

export interface ReservaRecord {
  idHabitacion: string;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  precioNoche?: number;
  precioTotal?: number;
  status?: string;
  huesped?: HuespedReserva;
  estadoReserva?: EstadoReserva;
}

export interface ReservaCreateRecord {
  idHabitacion: string;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  huesped?: HuespedReserva;
}

export async function crearReserva(reserva: ReservaCreateRecord): Promise<Reserva | null> {
  return sendReservas<Reserva>('/reservas/reservas', 'POST', reserva);
}

export async function actualizarReserva(id: string, reserva: ReservaRecord): Promise<Reserva | null> {
  return sendReservas<Reserva>(`/reservas/reservas/${id}`, 'PUT', reserva);
}

export async function eliminarReserva(id: string): Promise<void> {
  await deleteReservas(`/reservas/reservas/${id}`);
}

export async function getHabitacionCacheadaPorId(id: string): Promise<HabitacionCacheada> {
  return fetchReservas<HabitacionCacheada>(`/reservas/habitaciones/${id}`);
}

export async function pagarReserva(id: string, nuevoPago: Pago): Promise<Reserva | null> {
  if (!nuevoPago.transactionId || nuevoPago.transactionId.trim() === '') {
    nuevoPago.transactionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return sendReservas<Reserva>(`/reservas/reservas/${id}/pagar`, 'POST', nuevoPago);
}

export async function cancelarReserva(id: string): Promise<Reserva | null> {
  return sendReservas<Reserva>(`/reservas/reservas/${id}/cancelar`, 'POST', {});
}

export async function finalizarReserva(id: string, hostReview: Review): Promise<Reserva | null> {
  return sendReservas<Reserva>(`/reservas/reservas/${id}/finalizar`, 'POST', hostReview);
}
