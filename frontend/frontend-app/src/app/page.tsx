export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hotel Management System - Frontend</h1>
      <p>Bienvenido a la aplicación de gestión hotelera</p>

      <h2>Navegación</h2>
      <ul>
        <li>
          <a href="/usuarios">Usuarios</a>
        </li>
        <li>
          <a href="/usuarios/buscar-dni-exacto">Buscar Usuario por DNI Exacto</a>
        </li>
        <li>
          <a href="/bancos">Bancos</a>
        </li>
        <li>
          <a href="/huespedes">Gestión de Huéspedes</a>
        </li>
        <li>
          <a href="/huespedes/nuevo">Nuevo Huésped</a>
        </li>
        <li>
          <a href="/propietarios/nuevo">Nuevo Propietario</a>
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
        <li><strong>GET /bancos</strong> - Listar bancos</li>
        <li><strong>GET /bancos/{'{'}bancoId{'}'}</strong> - Obtener banco por ID</li>
      </ul>

      <h4>POST (Creación)</h4>
      <ul>
        <li><strong>POST /users/huesped</strong> - Crear nuevo huésped</li>
        <li><strong>POST /users/propietario</strong> - Crear nuevo propietario</li>
        <li><strong>POST /users/huesped/{'{'}dni{'}'}/tarjeta</strong> - Agregar tarjeta de crédito a huésped</li>
      </ul>
    </div>
  );
}