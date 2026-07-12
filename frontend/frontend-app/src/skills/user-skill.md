# Skill: Gestión de Usuarios (USER‑SVC)

Descripción

Skill para el frontend que documenta los endpoints del servicio `user-svc` (consumidos a través del API Gateway en `http://localhost:8080`). Incluye: listado de endpoints, parámetros, roles requeridos, ejemplos de request/response y referencias a JSON Schema para generación de formularios.

Base URL

- API Gateway: `http://localhost:8080`
- Base path del `UserController` vía Gateway: `/users/users`
- Base path del `BancoController` vía Gateway: `/users/bancos`
- Base path del `AuthController` vía Gateway: `/users/auth`
- Nota de ruteo: en endpoints del `UserController`, el primer `/users` selecciona el microservicio `user-svc` en el API Gateway y el segundo `/users` corresponde al mapping del controller. En bancos y auth no se repite el prefijo; se consumen con `/users/bancos` y `/users/auth` respectivamente.

Notas generales

- **Autenticación**: el sistema tiene login con JWT. Hay 2 roles, `HUESPED` y `PROPIETARIO` (mismos valores que el discriminador `tipo` de la entidad `Usuario` — no hay traducción a otro vocabulario en ninguna capa). El JWT se obtiene con `POST /users/auth/login` y se valida **únicamente en el API Gateway** (`common/dan-spring-gateway/.../security/JwtAuthFilter.java`) — `user-svc` en sí no tiene Spring Security ni valida tokens, confía en los headers `X-User-Id`/`X-User-Email`/`X-User-Nombre`/`X-User-Role` que el gateway reenvía tras validar. Toda petición a una ruta protegida debe incluir `Authorization: Bearer <token>`.
- **Roles por endpoint**: ver la columna "Rol" en la tabla de cada endpoint más abajo. La fuente de verdad es la tabla `RULES` de `JwtAuthFilter.java`.
- Validación: los JSON Schema reflejan las validaciones declaradas en los DTOs (`@NotBlank`, `@NotNull`, `@Email`, `@Size`); campos sin anotaciones se marcan como opcionales en los schemas. Los DTOs `HuespedRecord`/`PropietarioRecord` ahora incluyen un campo `password` (`@NotBlank @Length(min=8)`), obligatorio al dar de alta un usuario.
- La tarjeta de crédito de un Huesped es **opcional**: si no se envía ningún dato de tarjeta (`numeroCC` vacío/ausente), el Huesped se crea sin tarjetas. Si se envía algún dato, el backend exige que estén completos los 5 campos (`numeroCC`, `nombreTitular`, `fechaVencimientoCC`, `cvcCC`, `idBanco`) — todo o nada, si falta alguno responde 400 con un mensaje claro.

Archivos de esquema

- `../schemas/user/HuespedRecord.schema.json`
- `../schemas/user/PropietarioRecord.schema.json`
- `../schemas/user/TarjetaCreditoRecord.schema.json`
- `../schemas/user/CuentaBancariaRecord.schema.json`
- `../schemas/user/BancoRecord.schema.json`

Endpoints

0) Login

- Método: POST
- Ruta: `/users/auth/login`
- Rol: **Público**
- Request body: `{ "email": "...", "password": "..." }`
- Response body: `{ "token": "...", "id": 1, "nombre": "...", "email": "...", "rol": "HUESPED" | "PROPIETARIO" }`
- Respuestas: `200 OK` con el token; `401` (`{"message":"Email o contraseña inválidos", ...}`) si las credenciales no son válidas.

---

1) Crear usuario huesped

- Método: POST
- Ruta: `/users/users/huesped`
- Rol: **Público** (auto-registro)
- Descripción: Crea un nuevo usuario de tipo `Huesped`. El body acepta datos del usuario, contraseña, y (opcionalmente, todo-o-nada) una tarjeta de crédito para asociar al crear.
- Request body (schema): `HuespedRecord` — `../schemas/user/HuespedRecord.schema.json`

Ejemplo request JSON (con tarjeta):

```json
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "fechaNacimiento": "1990-01-01",
  "password": "MiClave123!",
  "numeroCC": "4111111111111111",
  "nombreTitular": "JUAN PEREZ",
  "fechaVencimientoCC": "12/25",
  "cvcCC": "123",
  "esPrincipalCC": true,
  "idBanco": 1
}
```

Ejemplo request JSON (sin tarjeta — todos los campos de tarjeta ausentes/vacíos):

```json
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "fechaNacimiento": "1990-01-01",
  "password": "MiClave123!"
}
```

Respuestas relevantes:
- `201 Created` si se crea correctamente.
- `400 Bad Request` si se envía un dato de tarjeta parcial (ej. `numeroCC` sin `idBanco`).

Respuesta (ejemplo minimal de recurso creado) — la API retorna el recurso `Huesped` (ver modelo en backend; `password` nunca se serializa, tiene `@JsonIgnore`):

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678",
  "tipo": "HUESPED"
}
```

---

2) Crear usuario propietario

- Método: POST
- Ruta: `/users/users/propietario`
- Rol: **PROPIETARIO** (ya NO es auto-registro público — solo un Propietario ya logueado puede crear otras cuentas Propietario, porque el rol tiene acceso total a la plataforma)
- Descripción: Crea usuario de tipo `Propietario` (incluye `CuentaBancaria` como objeto anidado y contraseña).
- Request body (schema): `PropietarioRecord` — `../schemas/user/PropietarioRecord.schema.json`

Ejemplo request JSON:

```json
{
  "nombre": "Ana Martínez",
  "dni": "87654321",
  "email": "ana.martinez@example.com",
  "telefono": "2991234567",
  "idHotel": 42,
  "password": "OtraClave123!",
  "cuentaBancaria": {
    "numeroCuenta": "00012345",
    "cbu": "1230000000000000000001",
    "alias": "ana.alias",
    "idBanco": 1
  }
}
```

Respuestas:
- `201 Created` si se crea correctamente.
- `401`/`403` si no se manda un JWT válido con rol `PROPIETARIO`.

---

3) Agregar tarjeta de crédito a un huesped

- Método: POST
- Ruta: `/users/users/huesped/{dni}/tarjeta`
- Rol: **HUESPED** (ownership: el `{dni}` del path debe ser el del propio usuario autenticado, salvo que el llamador sea PROPIETARIO)
- Parámetros: `dni` en path (string)
- Request body (schema): `TarjetaCreditoRecord` — `../schemas/user/TarjetaCreditoRecord.schema.json`

Ejemplo request JSON:

```json
{
  "numeroCC": "4111111111111111",
  "nombreTitular": "Juan Pérez",
  "fechaVencimientoCC": "12/25",
  "cvcCC": "123",
  "esPrincipalCC": true,
  "idBanco": 1
}
```

Respuestas:
- `201 Created` si la tarjeta fue asociada correctamente.
- `403` si el `{dni}` no corresponde al usuario autenticado (y no es PROPIETARIO).

---

4) Eliminar tarjeta de crédito de un huesped

- Método: DELETE
- Ruta: `/users/users/huesped/{dni}/eliminar-tarjeta`
- Rol: **HUESPED** (ownership, mismo criterio que el punto 3)
- Parámetros: `dni` en path (string)
- Request body (schema): `TarjetaCreditoRecord` (se usa para identificar la tarjeta a eliminar)

Ejemplo request JSON (mínimo para identificar la tarjeta):

```json
{
  "numeroCC": "4111111111111111",
  "idBanco": 1
}
```

Respuestas:
- `204 No Content` si la eliminación fue exitosa.

---

5) Cambiar la tarjeta principal de un huesped

- Método: PUT
- Ruta: `/users/users/huesped/{dni}/cambiar-tarjeta-principal`
- Rol: **HUESPED** (ownership, mismo criterio que el punto 3)
- Parámetros: `dni` en path (string)
- Request body (schema): `TarjetaCreditoRecord` (tarjeta que se desea marcar como principal)

Ejemplo request JSON:

```json
{
  "numeroCC": "4111111111111111",
  "idBanco": 1
}
```

Respuestas:
- `204 No Content` si la actualización fue correcta.

---

6) Eliminar usuario huesped por DNI

- Método: DELETE
- Ruta: `/users/users/huesped/eliminar/{dni}`
- Rol: **PROPIETARIO**
- Parámetros: `dni` en path (string)
- Nota: en el backend la firma del método usa `@RequestParam` pero el mapeo aplica `{dni}` en la ruta; documentar con `{dni}` en path y validar con el backend en caso de discrepancia.

Respuestas:
- `200 OK` si se eliminó correctamente.

---

7) Listar usuarios (búsqueda por nombre)

- Método: GET
- Ruta: `/users/users`
- Rol: **PROPIETARIO**
- Query params: `nombre` (opcional), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado). Cada `Usuario` incluye un campo `tipo` (`"HUESPED"` | `"PROPIETARIO"`, getter calculado por `instanceof`) que el frontend usa para decidir a qué pantalla de detalle navegar y si mostrar o no la acción de eliminar (un Propietario no se puede eliminar).

Ejemplo response JSON:

```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "telefono": "1123456789",
      "dni": "12345678",
      "tipo": "HUESPED"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```

---

8) Obtener usuario por DNI exacto

- Método: GET
- Ruta: `/users/users/dni/{dni}`
- Rol: **PROPIETARIO**
- Parámetros: `dni` en path (string)
- Respuesta: `Usuario` (ver modelo)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678",
  "tipo": "HUESPED"
}
```

---

9) Buscar usuarios por DNI (contiene)

- Método: GET
- Ruta: `/users/users/buscar-dni`
- Rol: **PROPIETARIO**
- Query params: `dni` (string), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado). Usa el mismo formato que la respuesta de listado.

---

10) Obtener huésped por ID

- Método: GET
- Ruta: `/users/users/huesped/{id}`
- Rol: **HUESPED** (ownership: el `{id}` debe ser el propio) o **PROPIETARIO**
- Parámetros: `id` en path (integer)
- Respuesta: `Huesped` con `tarjetaCredito` (array, puede ser vacío si no cargó ninguna)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678",
  "tipo": "HUESPED",
  "fechaNacimiento": "1990-01-01",
  "tarjetaCredito": [
    {
      "id": 10,
      "numero": "4111111111111111",
      "nombreTitular": "JUAN PEREZ",
      "fechaVencimiento": "12/25",
      "cvc": "123",
      "esPrincipal": true,
      "banco": {
        "id": 1,
        "nombre": "Banco Nación"
      }
    }
  ]
}
```

---

11) Obtener usuario por ID

- Método: GET
- Ruta: `/users/users/{id}`
- Rol: **PROPIETARIO**
- Parámetros: `id` en path (integer)
- Respuesta: `Usuario` (también es la única vista de detalle disponible para un Propietario, ya que no existe un endpoint de detalle "por tipo" separado)

Ejemplo response JSON: ver ejemplo en "Obtener usuario por DNI exacto" (estructura `Usuario`).

---

12) Listar bancos

- Método: GET
- Ruta: `/users/bancos`
- Rol: **Público** (se necesita antes de loguearse, para los formularios de alta)
- Query params: `page`, `size`
- Respuesta: `Page<Banco>`

---

13) Obtener banco por ID

- Método: GET
- Ruta: `/users/bancos/{bancoId}`
- Rol: **Público**
- Parámetros: `bancoId` en path (integer)
- Respuesta: `Banco`

---

Referencias

- Controladores origen: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/controller/UserController.java`, `AuthController.java`
- DTOs: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/dto/`
- Modelos (respuesta): `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/model/`
- Reglas de rol por endpoint (fuente de verdad): `common/dan-spring-gateway/src/main/java/com/example/demo/security/JwtAuthFilter.java` (lista `RULES`)
- Autenticación en el frontend: `frontend/frontend-app/src/lib/auth.ts`, `context/AuthContext.tsx`, `middleware.ts`, `lib/http.ts`

Checklist para frontend

- Usar `http://localhost:8080/users/users` como base para peticiones del `UserController`, siempre con `Authorization: Bearer <token>` en rutas protegidas (ver `lib/http.ts#apiGet/apiSend`, que ya lo agrega automáticamente leyendo la cookie `dan_token`).
- Para formularios, consumir los JSON Schema en `frontend/frontend-app/src/schemas/user/`.
- Validar en cliente según los schemas y mostrar mensajes de error coherentes con las reglas del backend (por ejemplo, `PropietarioRecord.nombre` mínimo 5 caracteres, tarjeta todo-o-nada).

Cambios futuros (opcional)

- Generar wrappers API y componentes esqueleto (wrappers con `fetch`/`axios`).
- Añadir tests e2e que validen flujos: login -> crear huesped -> agregar tarjeta -> listar.
