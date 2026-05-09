const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USERS_BASE_PATH = `${API_BASE_URL}/users/users`;
const BANCOS_BASE_PATH = `${API_BASE_URL}/users/bancos`;

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export async function getUsuarios(nombre?: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  try {
    const params = new URLSearchParams();
    if (nombre) params.append('nombre', nombre);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await fetch(
      `${USERS_BASE_PATH}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching usuario ${id}:`, error);
    throw error;
  }
}

export async function buscarUsuariosPorDni(dni: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  try {
    const params = new URLSearchParams();
    params.append('dni', dni);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await fetch(
      `${USERS_BASE_PATH}/buscar-dni?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching usuarios by dni:', error);
    throw error;
  }
}

export async function searchUsuariosByNombre(nombre: string, page: number = 0, size: number = 10): Promise<PageResponse<Usuario>> {
  try {
    const params = new URLSearchParams();
    params.append('nombre', nombre);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await fetch(
      `${USERS_BASE_PATH}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching usuarios by nombre:', error);
    throw error;
  }
}

export async function getUsuarioPorDniExacto(dni: string): Promise<Usuario> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/dni/${dni}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching usuario by dni ${dni}:`, error);
    throw error;
  }
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
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(huesped),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) as Huesped : null;
  } catch (error) {
    console.error('Error creando huesped:', error);
    throw error;
  }
}

export async function crearPropietario(propietario: PropietarioRecord): Promise<void> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/propietario`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propietario),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('Error creando propietario:', error);
    throw error;
  }
}

export async function agregarTarjetaCredito(dni: string, tarjeta: TarjetaCreditoRecord): Promise<void> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped/${dni}/tarjeta`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarjeta),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error agregando tarjeta:', error);
    throw error;
  }
}

export async function cambiarTarjetaPrincipal(dni: string, tarjeta: Partial<TarjetaCreditoRecord>): Promise<void> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped/${dni}/cambiar-tarjeta-principal`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarjeta),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error cambiando tarjeta principal:', error);
    throw error;
  }
}

export async function eliminarTarjetaCredito(dni: string, tarjeta: Partial<TarjetaCreditoRecord>): Promise<void> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped/${dni}/eliminar-tarjeta`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarjeta),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error eliminando tarjeta:', error);
    throw error;
  }
}

export async function eliminarHuespedPorDni(dni: string): Promise<void> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped/eliminar/${dni}?dni=${encodeURIComponent(dni)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`Error eliminando huesped con dni ${dni}:`, error);
    throw error;
  }
}

export async function getHuespedPorId(id: number): Promise<Huesped> {
  try {
    const response = await fetch(
      `${USERS_BASE_PATH}/huesped/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching huesped ${id}:`, error);
    throw error;
  }
}

export interface Banco {
  id: number;
  nombre: string;
  codigo: string;
}

export async function getBancos(page: number = 0, size: number = 10): Promise<PageResponse<Banco>> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await fetch(
      `${BANCOS_BASE_PATH}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching bancos:', error);
    throw error;
  }
}

export async function getBancoPorId(bancoId: number): Promise<Banco> {
  try {
    const response = await fetch(
      `${BANCOS_BASE_PATH}/${bancoId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching banco ${bancoId}:`, error);
    throw error;
  }
}
