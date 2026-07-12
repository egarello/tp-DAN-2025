import { apiGet, apiSend } from '@/lib/http';

const USERS_BASE_PATH = '/users/users';
const BANCOS_BASE_PATH = '/users/bancos';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  tipo?: 'HUESPED' | 'PROPIETARIO';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export async function getUsuarios(nombre?: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  const params = new URLSearchParams();
  if (nombre) params.append('nombre', nombre);
  params.append('page', page.toString());
  params.append('size', size.toString());
  return apiGet<PageResponse<Usuario>>(`${USERS_BASE_PATH}?${params.toString()}`);
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  return apiGet<Usuario>(`${USERS_BASE_PATH}/${id}`);
}

export async function buscarUsuariosPorDni(dni: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  const params = new URLSearchParams();
  params.append('dni', dni);
  params.append('page', page.toString());
  params.append('size', size.toString());
  return apiGet<PageResponse<Usuario>>(`${USERS_BASE_PATH}/buscar-dni?${params.toString()}`);
}

export async function searchUsuariosByNombre(nombre: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  const params = new URLSearchParams();
  params.append('nombre', nombre);
  params.append('page', page.toString());
  params.append('size', size.toString());
  return apiGet<PageResponse<Usuario>>(`${USERS_BASE_PATH}?${params.toString()}`);
}

export async function getUsuarioPorDniExacto(dni: string): Promise<Usuario> {
  return apiGet<Usuario>(`${USERS_BASE_PATH}/dni/${dni}`);
}

export interface Huesped {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento?: string;
  tarjetaCredito?: TarjetaCredito[];
}

export interface TarjetaCredito {
  id: number;
  numero: string;
  nombreTitular: string;
  fechaVencimiento: string;
  cvc: string;
  esPrincipal: boolean;
  banco: Banco;
}

export interface HuespedRecord {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  password: string;
  numeroCC?: string;
  nombreTitular?: string;
  fechaVencimientoCC?: string;
  cvcCC?: string;
  esPrincipalCC?: boolean;
  idBanco?: number;
}

export interface PropietarioRecord {
  nombre: string;
  dni?: string;
  email?: string;
  telefono: string;
  idHotel?: number;
  password: string;
  cuentaBancaria: {
    numeroCuenta: string;
    cbu: string;
    alias?: string;
    idBanco: number;
  };
}

export interface TarjetaCreditoRecord {
  numeroCC: string;
  nombreTitular: string;
  fechaVencimientoCC: string;
  cvcCC: string;
  esPrincipalCC: boolean;
  idBanco: number;
}

export async function crearHuesped(huesped: HuespedRecord): Promise<Huesped | null> {
  return apiSend<Huesped>(`${USERS_BASE_PATH}/huesped`, 'POST', huesped);
}

export async function crearPropietario(propietario: PropietarioRecord): Promise<void> {
  await apiSend(`${USERS_BASE_PATH}/propietario`, 'POST', propietario);
}

export async function agregarTarjetaCredito(dni: string, tarjeta: TarjetaCreditoRecord): Promise<void> {
  await apiSend(`${USERS_BASE_PATH}/huesped/${dni}/tarjeta`, 'POST', tarjeta);
}

export async function cambiarTarjetaPrincipal(dni: string, tarjeta: Partial<TarjetaCreditoRecord>): Promise<void> {
  await apiSend(`${USERS_BASE_PATH}/huesped/${dni}/cambiar-tarjeta-principal`, 'PUT', tarjeta);
}

export async function eliminarTarjetaCredito(dni: string, tarjeta: Partial<TarjetaCreditoRecord>): Promise<void> {
  await apiSend(`${USERS_BASE_PATH}/huesped/${dni}/eliminar-tarjeta`, 'DELETE', tarjeta);
}

export async function eliminarHuespedPorDni(dni: string): Promise<void> {
  await apiSend(`${USERS_BASE_PATH}/huesped/eliminar/${dni}?dni=${encodeURIComponent(dni)}`, 'DELETE');
}

export async function getHuespedPorId(id: number): Promise<Huesped> {
  return apiGet<Huesped>(`${USERS_BASE_PATH}/huesped/${id}`);
}

export interface Banco {
  id: number;
  nombre: string;
  codigo: string;
}

export async function getBancos(page: number = 0, size: number = 10): Promise<PageResponse<Banco>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  return apiGet<PageResponse<Banco>>(`${BANCOS_BASE_PATH}?${params.toString()}`);
}

export async function getBancoPorId(bancoId: number): Promise<Banco> {
  return apiGet<Banco>(`${BANCOS_BASE_PATH}/${bancoId}`);
}
