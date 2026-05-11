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

async function sendGestion<T>(path: string, method: 'POST' | 'PUT', body: unknown): Promise<T | null> {
  const response = await fetch(`${GESTION_BASE_PATH}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) as T : null;
}

async function deleteGestion(path: string): Promise<string | null> {
  const response = await fetch(`${GESTION_BASE_PATH}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  const responseText = await response.text();
  return responseText || null;
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

export interface HotelRecord {
  nombre: string;
  cuit?: string;
  domicilio?: string;
  latitud?: number;
  longitud?: number;
  telefono?: string;
  correoContacto?: string;
  categoria?: number;
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
}

export interface TipoHabitacionRecord {
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

export interface HabitacionRecord {
  numero: number;
  piso: number;
  tipoHabitacion: {
    id: number;
  };
  hotel: {
    id: number;
  };
}

export interface Tarifa {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  tipoHabitacion?: TipoHabitacion;
  precioNoche: number;
}

export interface TarifaRecord {
  fechaInicio: string;
  fechaFin: string;
  idTipoHabitacion: number;
  precioNoche: number;
}

export type Amenity =
  | 'PILETA'
  | 'GIMNASIO'
  | 'RESTAURANTE'
  | 'BAR'
  | 'ESTACIONAMIENTO'
  | 'WIFI'
  | 'AIRE_ACONDICIONADO'
  | 'TV_CABLE'
  | 'SERVICIO_HABITACIONES'
  | 'LIMPIEZA_DIARIA'
  | 'SPA'
  | 'SALA_REUNIONES';

export async function getHoteles(): Promise<Hotel[]> {
  return fetchGestion<Hotel[]>('/hoteles');
}

export async function crearHotel(hotel: HotelRecord): Promise<Hotel | null> {
  return sendGestion<Hotel>('/hoteles', 'POST', hotel);
}

export async function actualizarHotel(id: number, hotel: HotelRecord): Promise<Hotel | null> {
  return sendGestion<Hotel>(`/hoteles/${id}`, 'PUT', hotel);
}

export async function eliminarHotel(id: number): Promise<void> {
  await deleteGestion(`/hoteles/${id}`);
}

export async function eliminarAmenityHotel(idHotel: number, amenity: string): Promise<Hotel | null> {
  const params = new URLSearchParams({ amenity });
  const response = await fetch(`${GESTION_BASE_PATH}/hoteles/${idHotel}/amenities/remove?${params.toString()}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) as Hotel : null;
}

export async function agregarAmenitiesHotel(idHotel: number, amenities: Amenity[]): Promise<Hotel | null> {
  return sendGestion<Hotel>(`/hoteles/${idHotel}/amenities/add`, 'POST', amenities);
}

export async function getHotelPorId(id: number): Promise<Hotel> {
  return fetchGestion<Hotel>(`/hoteles/${id}`);
}

export async function getHabitaciones(): Promise<Habitacion[]> {
  return fetchGestion<Habitacion[]>('/habitaciones');
}

export async function crearHabitacion(habitacion: HabitacionRecord): Promise<Habitacion | null> {
  return sendGestion<Habitacion>('/habitaciones', 'POST', habitacion);
}

export async function actualizarHabitacion(id: number, habitacion: HabitacionRecord): Promise<Habitacion | null> {
  return sendGestion<Habitacion>(`/habitaciones/${id}`, 'PUT', habitacion);
}

export async function eliminarHabitacion(id: number): Promise<void> {
  await deleteGestion(`/habitaciones/${id}`);
}

export async function getHabitacionPorId(id: number): Promise<Habitacion> {
  return fetchGestion<Habitacion>(`/habitaciones/${id}`);
}

export async function getTiposHabitacion(): Promise<TipoHabitacion[]> {
  return fetchGestion<TipoHabitacion[]>('/tipos-habitacion');
}

export async function crearTipoHabitacion(tipoHabitacion: TipoHabitacionRecord): Promise<TipoHabitacion | null> {
  return sendGestion<TipoHabitacion>('/tipos-habitacion', 'POST', tipoHabitacion);
}

export async function actualizarTipoHabitacion(id: number, tipoHabitacion: TipoHabitacionRecord): Promise<TipoHabitacion | null> {
  return sendGestion<TipoHabitacion>(`/tipos-habitacion/${id}`, 'PUT', tipoHabitacion);
}

export async function eliminarTipoHabitacion(id: number): Promise<void> {
  await deleteGestion(`/tipos-habitacion/${id}`);
}

export async function getTipoHabitacionPorId(id: number): Promise<TipoHabitacion> {
  return fetchGestion<TipoHabitacion>(`/tipos-habitacion/${id}`);
}

export async function getTarifas(): Promise<Tarifa[]> {
  return fetchGestion<Tarifa[]>('/tarifas');
}

export async function crearTarifa(tarifa: TarifaRecord): Promise<Tarifa | null> {
  return sendGestion<Tarifa>('/tarifas', 'POST', tarifa);
}

export async function actualizarTarifa(id: number, tarifa: TarifaRecord): Promise<Tarifa | null> {
  return sendGestion<Tarifa>(`/tarifas/${id}`, 'PUT', tarifa);
}

export async function eliminarTarifa(id: number): Promise<void> {
  await deleteGestion(`/tarifas/${id}`);
}

export async function crearTarifaPromocional(tarifa: TarifaRecord, fechaInicio: string, fechaFin: string): Promise<Tarifa[] | null> {
  const params = new URLSearchParams({ fechaInicio, fechaFin });
  return sendGestion<Tarifa[]>(`/tarifas/promocional?${params.toString()}`, 'POST', tarifa);
}

export async function getTarifaPorId(id: number): Promise<Tarifa> {
  return fetchGestion<Tarifa>(`/tarifas/${id}`);
}

export async function getTarifaPorHabitacion(idHabitacion: number): Promise<Tarifa | null> {
  const response = await fetch(`${GESTION_BASE_PATH}/tarifas/habitacion/${idHabitacion}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
  }

  return await response.json() as Tarifa;
}
