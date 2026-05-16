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

export async function getReservas(): Promise<Reserva[]> {
  return fetchReservas<Reserva[]>('/reservas/reservas');
}

export async function getReservaPorId(id: string): Promise<Reserva> {
  return fetchReservas<Reserva>(`/reservas/reservas/${id}`);
}

export async function getHabitacionesCacheadas(): Promise<HabitacionCacheada[]> {
  return fetchReservas<HabitacionCacheada[]>('/reservas/habitaciones');
}

export async function getHabitacionCacheadaPorId(id: string): Promise<HabitacionCacheada> {
  return fetchReservas<HabitacionCacheada>(`/reservas/habitaciones/${id}`);
}
