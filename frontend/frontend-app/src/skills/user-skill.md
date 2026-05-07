# Skill: Gestión de Usuarios (USER‑SVC)

Descripción

Skill para el frontend que documenta los endpoints del servicio `user-svc` (consumidos a través del API Gateway en `http://localhost:8080`). Incluye: listado de endpoints, parámetros, ejemplos de request/response y referencias a JSON Schema para generación de formularios.

Base URL

- API Gateway: `http://localhost:8080`
- Base path del servicio de usuarios: `/users`

Notas generales

- Autenticación: no requerida en esta entrega (si en el futuro se agrega, los wrappers deberán incluir `Authorization` header).
- Validación: los JSON Schema reflejan las validaciones declaradas en los DTOs (`@NotBlank`, `@NotNull`, `@Email`, `@Size`); campos sin anotaciones se marcan como opcionales en los schemas.

Archivos de esquema

- `../schemas/user/HuespedRecord.schema.json`
- `../schemas/user/PropietarioRecord.schema.json`
- `../schemas/user/TarjetaCreditoRecord.schema.json`
- `../schemas/user/CuentaBancariaRecord.schema.json`
- `../schemas/user/BancoRecord.schema.json`

Endpoints

1) Crear usuario huesped

- Método: POST
- Ruta: `/users/huesped`
- Descripción: Crea un nuevo usuario de tipo `Huesped`. El body acepta datos del usuario y (opcionalmente) una tarjeta de crédito para asociar al crear.
- Request body (schema): `HuespedRecord` — `../schemas/user/HuespedRecord.schema.json`

Ejemplo request JSON:

```json
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "fechaNacimiento": "1990-01-01",
  "numeroCC": "4111111111111111",
  "nombreTitular": "JUAN PEREZ",
  "fechaVencimientoCC": "12/25",
  "cvcCC": "123",
  "esPrincipalCC": true,
  "idBanco": 1
}
```

Respuestas relevantes:
- `201 Created` si se crea correctamente.

Respuesta (ejemplo minimal de recurso creado) — la API retorna el recurso `Huesped` (ver modelo en backend):

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678"
}
```

---

2) Crear usuario propietario

- Método: POST
- Ruta: `/users/propietario`
- Descripción: Crea usuario de tipo `Propietario` (incluye `CuentaBancaria` como objeto anidado).
- Request body (schema): `PropietarioRecord` — `../schemas/user/PropietarioRecord.schema.json`

Ejemplo request JSON:

```json
{
  "nombre": "Ana Martínez",
  "dni": "87654321",
  "email": "ana.martinez@example.com",
  "telefono": "2991234567",
  "idHotel": 42,
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

---

3) Agregar tarjeta de crédito a un huesped

- Método: POST
- Ruta: `/users/huesped/{dni}/tarjeta`
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

---

4) Eliminar tarjeta de crédito de un huesped

- Método: DELETE
- Ruta: `/users/huesped/{dni}/eliminar-tarjeta`
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
- Ruta: `/users/huesped/{dni}/cambiar-tarjeta-principal`
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
- Ruta: `/users/huesped/eliminar/{dni}`
- Parámetros: `dni` en path (string)
- Nota: en el backend la firma del método usa `@RequestParam` pero el mapeo aplica `{dni}` en la ruta; documentar con `{dni}` en path y validar con el backend en caso de discrepancia.

Respuestas:
- `200 OK` si se eliminó correctamente.

---

7) Listar usuarios (búsqueda por nombre)

- Método: GET
- Ruta: `/users`
- Query params: `nombre` (opcional), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado)

Ejemplo response JSON:

```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "telefono": "1123456789",
      "dni": "12345678"
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
- Ruta: `/users/dni/{dni}`
- Parámetros: `dni` en path (string)
- Respuesta: `Usuario` (ver modelo)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678"
}
```

---

9) Buscar usuarios por DNI (contiene)

- Método: GET
- Ruta: `/users/buscar-dni`
- Query params: `dni` (string), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado). Usa el mismo formato que la respuesta de listado.

---

10) Obtener huésped por ID

- Método: GET
- Ruta: `/users/huesped/{id}`
- Parámetros: `id` en path (integer)
- Respuesta: `Huesped` con `tarjetaCredito` (array)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678",
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
- Ruta: `/users/{id}`
- Parámetros: `id` en path (integer)
- Respuesta: `Usuario`

Ejemplo response JSON: ver ejemplo en "Obtener usuario por DNI exacto" (estructura `Usuario`).

---

Referencias

- Controlador origen: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/controller/UserController.java`
- DTOs: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/dto/`
- Modelos (respuesta): `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/model/`

Checklist para frontend

- Usar `http://localhost:8080/users` como base para peticiones.
- Para formularios, consumir los JSON Schema en `frontend/frontend-app/src/schemas/user/`.
- Validar en cliente según los schemas y mostrar mensajes de error coherentes con las reglas del backend (por ejemplo, `PropietarioRecord.nombre` mínimo 5 caracteres).

Cambios futuros (opcional)

- Generar wrappers API y componentes esqueleto (wrappers con `fetch`/`axios`).
- Añadir autenticación si el Gateway lo requiere.
- Añadir tests e2e que validen flujos: crear huesped -> agregar tarjeta -> listar.
# Skill: Gestión de Usuarios (USER‑SVC)

Descripción

Skill para el frontend que documenta los endpoints del servicio `user-svc` (consumidos a través del API Gateway en `http://localhost:8080`). Incluye: listado de endpoints, parámetros, ejemplos de request/response y referencias a JSON Schema para generación de formularios.

Base URL

- API Gateway: `http://localhost:8080`
- Base path del servicio de usuarios: `/users`

Notas generales

- Autenticación: no requerida en esta entrega (si en el futuro se agrega, los wrappers deberán incluir `Authorization` header).
- Validación: los JSON Schema reflejan las validaciones declaradas en los DTOs (`@NotBlank`, `@NotNull`, `@Email`, `@Size`); campos sin anotaciones se marcan como opcionales en los schemas.

Archivos de esquema

- `../schemas/user/HuespedRecord.schema.json`
- `../schemas/user/PropietarioRecord.schema.json`
- `../schemas/user/TarjetaCreditoRecord.schema.json`
- `../schemas/user/CuentaBancariaRecord.schema.json`
- `../schemas/user/BancoRecord.schema.json`

Endpoints

1) Crear usuario huesped

- Método: POST
- Ruta: `/users/huesped`
- Descripción: Crea un nuevo usuario de tipo `Huesped`. El body acepta datos del usuario y (opcionalmente) una tarjeta de crédito para asociar al crear.
- Request body (schema): `HuespedRecord` — `../schemas/user/HuespedRecord.schema.json`

Ejemplo request JSON:

```json
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "fechaNacimiento": "1990-01-01",
  "numeroCC": "4111111111111111",
  "nombreTitular": "JUAN PEREZ",
  "fechaVencimientoCC": "12/25",
  "cvcCC": "123",
  "esPrincipalCC": true,
  "idBanco": 1
}
```

Respuestas relevantes:
- `201 Created` si se crea correctamente.

Respuesta (ejemplo minimal de recurso creado) — la API retorna el recurso `Huesped` (ver modelo en backend):

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678"
}
```

---

2) Crear usuario propietario

- Método: POST
- Ruta: `/users/propietario`
- Descripción: Crea usuario de tipo `Propietario` (incluye `CuentaBancaria` como objeto anidado).
- Request body (schema): `PropietarioRecord` — `../schemas/user/PropietarioRecord.schema.json`

Ejemplo request JSON:

```json
{
  "nombre": "Ana Martínez",
  "dni": "87654321",
  "email": "ana.martinez@example.com",
  "telefono": "2991234567",
  "idHotel": 42,
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

---

3) Agregar tarjeta de crédito a un huesped

- Método: POST
- Ruta: `/users/huesped/{dni}/tarjeta`
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

---

4) Eliminar tarjeta de crédito de un huesped

- Método: DELETE
- Ruta: `/users/huesped/{dni}/eliminar-tarjeta`
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
- Ruta: `/users/huesped/{dni}/cambiar-tarjeta-principal`
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
- Ruta: `/users/huesped/eliminar/{dni}`
- Parámetros: `dni` en path (string)
- Nota: en el backend la firma del método usa `@RequestParam` pero el mapeo aplica `{dni}` en la ruta; documentar con `{dni}` en path y validar con el backend en caso de discrepancia.

Respuestas:
- `200 OK` si se eliminó correctamente.

---

7) Listar usuarios (búsqueda por nombre)

- Método: GET
- Ruta: `/users`
- Query params: `nombre` (opcional), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado)

Ejemplo response JSON:

```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "telefono": "1123456789",
      "dni": "12345678"
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
- Ruta: `/users/dni/{dni}`
- Parámetros: `dni` en path (string)
- Respuesta: `Usuario` (ver modelo)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678"
}
```

---

9) Buscar usuarios por DNI (contiene)

- Método: GET
- Ruta: `/users/buscar-dni`
- Query params: `dni` (string), `page`, `size`
- Respuesta: `Page<Usuario>` (paginado). Usa el mismo formato que la respuesta de listado.

---

10) Obtener huésped por ID

- Método: GET
- Ruta: `/users/huesped/{id}`
- Parámetros: `id` en path (integer)
- Respuesta: `Huesped` con `tarjetaCredito` (array)

Ejemplo response JSON:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "dni": "12345678",
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
- Ruta: `/users/{id}`
- Parámetros: `id` en path (integer)
- Respuesta: `Usuario`

Ejemplo response JSON: ver ejemplo en "Obtener usuario por DNI exacto" (estructura `Usuario`).

---

Referencias

- Controlador origen: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/controller/UserController.java`
- DTOs: `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/dto/`
- Modelos (respuesta): `services/user-svc/src/main/java/edu/utn/frsf/isi/dan/user/model/`

Checklist para frontend

- Usar `http://localhost:8080/users` como base para peticiones.
- Para formularios, consumir los JSON Schema en `frontend/frontend-app/src/schemas/user/`.
- Validar en cliente según los schemas y mostrar mensajes de error coherentes con las reglas del backend (por ejemplo, `PropietarioRecord.nombre` mínimo 5 caracteres).

Cambios futuros (opcional)

- Generar wrappers API y componentes esqueleto (wrappers con `fetch`/`axios`).
- Añadir autenticación si el Gateway lo requiere.
- Añadir tests e2e que validen flujos: crear huesped -> agregar tarjeta -> listar.
