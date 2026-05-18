# Testing Connection - Frontend to Backend

## Estructura Creada

### Frontend Pages
- `/` - Home con navegación
- `/usuarios` - Lista de usuarios desde el backend

### API Service
- `src/lib/api.ts` - Funciones para conectar con el backend

## Cómo Testear Localmente

### Prerequisitos
1. Iniciar todos los servicios (Gateway, User Service, MySQL, etc.)
2. Asegurarse de que hay datos en la BD de usuarios

### Pasos

```bash
# 1. Instalar dependencias (desde frontend/frontend-app)
pnpm install

# 2. Correr el servidor de desarrollo
pnpm dev

# 3. Abrir en el navegador
http://localhost:3000

# 4. Navegar a /usuarios
http://localhost:3000/usuarios
```

### Con Docker Compose

```bash
# Desde la raíz del proyecto
docker compose -f infra/docker-compose.yml up

# El frontend estará disponible en
http://localhost:3000

# Y los usuarios en
http://localhost:3000/usuarios
```

## Endpoint Usado

```
GET http://localhost:8080/users?page=0&size=10
```

El frontend hace fetch a este endpoint a través del API Gateway.

## Estructura de Respuesta Esperada

```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",
      "email": "juan@example.com",
      "telefono": "1234567890"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "size": 10
}
```

## Posibles Errores

### "Error: Connection refused"
- Verificar que el API Gateway está corriendo en puerto 8080
- Verificar que el User Service está registrado en Eureka
- Ver logs: `docker logs dan-spring-gateway`

### "Error: 404"
- Verificar que hay usuarios en la BD
- Verificar la ruta en el gateway: `/users/**` → `user-svc`

### CORS Errors
- Si ves errores CORS, es necesario agregar configuración CORS al gateway

## Próximos Pasos

1. Agregar más páginas (reservas, gestión)
2. Agregar estilos y componentes reutilizables
3. Agregar formularios para crear/actualizar usuarios
4. Agregar manejo de autenticación
