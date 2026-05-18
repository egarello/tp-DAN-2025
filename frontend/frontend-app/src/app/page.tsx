import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hotel Management System - Frontend</h1>
      <p>Bienvenido a la aplicación de gestión hotelera</p>

      <h2>Navegación</h2>
      <ul>
        <li>
          <Link href="/usuarios">Usuarios</Link>
        </li>
        <li>
          <Link href="/usuarios/buscar-dni-exacto">Buscar Usuario por DNI Exacto</Link>
        </li>
        <li>
          <Link href="/bancos">Bancos</Link>
        </li>
        <li>
          <Link href="/huespedes">Gestión de Huéspedes</Link>
        </li>
        <li>
          <Link href="/huespedes/nuevo">Nuevo Huésped</Link>
        </li>
        <li>
          <Link href="/propietarios/nuevo">Nuevo Propietario</Link>
        </li>
        <li>
          <Link href="/gestion">Gestión Hotelera</Link>
        </li>
        <li>
          <Link href="/reservas">Reservas</Link>
        </li>
      </ul>

      <h2>Estado del Sistema</h2>
      <p>
        Esta aplicación frontend se conecta a través del API Gateway (puerto 8080) que rutea las solicitudes a los diferentes microservicios.
      </p>

      <h3>API Gateway</h3>
      <ul>
        <li>URL: http://localhost:8080</li>
        <li>/users/* → user-svc (puerto 8081)</li>
        <li>/reservas/* → reservas-svc (puerto 8082)</li>
        <li>/gestion/* → gestion-svc (puerto 8083)</li>
      </ul>

      <h3>Endpoints USER-SVC disponibles</h3>
      <h4>GET (Lectura)</h4>
      <ul>
        <li><strong>GET /users</strong> - Listar usuarios (con búsqueda por nombre)</li>
        <li><strong>GET /users/{'{'}id{'}'}</strong> - Obtener usuario por ID</li>
        <li><strong>GET /users/dni/{'{'}dni{'}'}</strong> - Obtener usuario por DNI exacto</li>
        <li><strong>GET /users/buscar-dni</strong> - Buscar usuarios por DNI (contiene)</li>
        <li><strong>GET /users/huesped/{'{'}id{'}'}</strong> - Obtener huésped por ID</li>
        <li><strong>GET /users/banco</strong> - Listar bancos</li>
        <li><strong>GET /users/banco/{'{'}bancoId{'}'}</strong> - Obtener banco por ID</li>
      </ul>

      <h4>POST (Creación)</h4>
      <ul>
        <li><strong>POST /users/huesped</strong> - Crear nuevo huésped</li>
        <li><strong>POST /users/propietario</strong> - Crear nuevo propietario</li>
        <li><strong>POST /users/huesped/{'{'}dni{'}'}/tarjeta</strong> - Agregar tarjeta de crédito a huésped</li>
      </ul>

      <h4>PUT (Actualización)</h4>
      <ul>
        <li><strong>PUT /users/huesped/{'{'}dni{'}'}/cambiar-tarjeta-principal</strong> - Cambiar tarjeta principal de un huésped</li>
      </ul>

      <h4>DELETE (Eliminación)</h4>
      <ul>
        <li><strong>DELETE /users/huesped/{'{'}dni{'}'}/eliminar-tarjeta</strong> - Eliminar tarjeta de crédito de un huésped</li>
        <li><strong>DELETE /users/huesped/eliminar/{'{'}dni{'}'}</strong> - Eliminar huésped por DNI</li>
      </ul>

      <h3>Endpoints GESTION-SVC disponibles</h3>
      <h4>GET (Lectura)</h4>
      <ul>
        <li><strong>GET /gestion/hoteles</strong> - Listar hoteles</li>
        <li><strong>GET /gestion/habitaciones</strong> - Listar habitaciones</li>
        <li><strong>GET /gestion/tipos-habitacion</strong> - Listar tipos de habitación</li>
        <li><strong>GET /gestion/tarifas</strong> - Listar tarifas</li>
      </ul>

      <h4>POST (Creación)</h4>
      <ul>
        <li><strong>POST /gestion/hoteles</strong> - Crear hotel</li>
        <li><strong>POST /gestion/hoteles/{'{'}hotel{'}'}/amenities/add</strong> - Agregar amenities a hotel</li>
        <li><strong>POST /gestion/habitaciones</strong> - Crear habitación</li>
        <li><strong>POST /gestion/tipos-habitacion</strong> - Crear tipo de habitación</li>
        <li><strong>POST /gestion/tarifas</strong> - Crear tarifa</li>
        <li><strong>POST /gestion/tarifas/promocional</strong> - Crear tarifa promocional</li>
      </ul>

      <h3>Endpoints RESERVAS-SVC disponibles</h3>
      <h4>GET (Lectura)</h4>
      <ul>
        <li><strong>GET /reservas/reservas</strong> - Listar reservas</li>
        <li><strong>GET /reservas/reservas/{'{'}id{'}'}</strong> - Obtener reserva por ID</li>
        <li><strong>GET /reservas/habitaciones</strong> - Listar habitaciones cacheadas</li>
        <li><strong>GET /reservas/habitaciones/{'{'}id{'}'}</strong> - Obtener habitación cacheada por ID</li>
      </ul>
      <h4>POST (Creación)</h4>
      <ul>
        <li><strong>POST /reservas/reservas</strong> - Crear nueva reserva</li>
      </ul>
      <h4>PUT (Actualización)</h4>
      <ul>
        <li><strong>PUT /reservas/reservas/{'{'}id{'}'}</strong> - Actualizar reserva (reemplazo completo)</li>
      </ul>
      <h4>DELETE (Eliminación)</h4>
      <ul>
        <li><strong>DELETE /reservas/reservas/{'{'}id{'}'}</strong> - Eliminar reserva</li>
      </ul>
    </div>
  );
 }
