const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const GESTION_BASE_PATH = `${API_BASE_URL}/gestion`;

async function fetchGestion<T>(path: string): Promise<T> {
  const response = await fetch(`${GESTION_BASE_PATH}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  return await response.json() as T;
}

export interface AmenityHotel {
  id: number;
  amenity: string;
}

export interface Hotel {
  id: number;
  nombre: string;
  cuit?: string;
  domicilio?: string;
  latitud?: number;
  longitud?: number;
  telefono?: string;
  correoContacto?: string;
  categoria?: number;
  amenities?: Array<string | AmenityHotel>;
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
}

export interface Habitacion {
  id: number;
  numero: number;
  piso: number;
  tipoHabitacion?: TipoHabitacion;
  hotel?: Hotel;
}

export interface Tarifa {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  tipoHabitacion?: TipoHabitacion;
  precioNoche: number;
}

export async function getHoteles(): Promise<Hotel[]> {
  return fetchGestion<Hotel[]>('/hoteles');
}

export async function getHotelPorId(id: number): Promise<Hotel> {
  return fetchGestion<Hotel>(`/hoteles/${id}`);
}

export async function getHabitaciones(): Promise<Habitacion[]> {
  return fetchGestion<Habitacion[]>('/habitaciones');
}

export async function getHabitacionPorId(id: number): Promise<Habitacion> {
  return fetchGestion<Habitacion>(`/habitaciones/${id}`);
}

export async function getTiposHabitacion(): Promise<TipoHabitacion[]> {
  return fetchGestion<TipoHabitacion[]>('/tipos-habitacion');
}

export async function getTipoHabitacionPorId(id: number): Promise<TipoHabitacion> {
  return fetchGestion<TipoHabitacion>(`/tipos-habitacion/${id}`);
}

export async function getTarifas(): Promise<Tarifa[]> {
  return fetchGestion<Tarifa[]>('/tarifas');
}

export async function getTarifaPorId(id: number): Promise<Tarifa> {
  return fetchGestion<Tarifa>(`/tarifas/${id}`);
}
