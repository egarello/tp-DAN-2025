# Skill: Reservas Service API

## Base URL (vía Gateway)

```
http://localhost:8080/reservas
```

> **Nota:** El Gateway aplica `StripPrefix=1`, lo que significa que el primer segmento `/reservas` del path se elimina antes de reenviar al servicio. Por eso las rutas tienen el segmento duplicado (ej. `/reservas/reservas`).

## Endpoints

---

### 1. Listar Reservas

- **Método:** `GET`
- **Gateway:** `GET http://localhost:8080/reservas/reservas`
- **Servicio directo:** `GET http://localhost:8082/reservas`
- **Descripción:** Obtiene todas las reservas registradas en MongoDB.

#### Parámetros
Ninguno.

#### Response (200 OK)
```json
[
  {
    "_id": "abc123def456",
    "idHabitacion": "1",
    "hotelId": 9999998,
    "createdAt": "2026-05-10T12:00:00Z",
    "checkIn": "2026-06-05T00:00:00Z",
    "checkOut": "2026-06-10T00:00:00Z",
    "precioNoche": 100.0,
    "precioTotal": 500.0,
    "status": "CONFIRMED",
    "huesped": {
      "idUsuario": "123456",
      "nombreApellido": "Juan Pérez",
      "email": "juan@email.com"
    },
    "pago": [
      {
        "method": "CREDIT_CARD",
        "transactionId": "txn_abc123",
        "amount": {
          "precio": 50000.0,
          "moneda": "ARS"
        },
        "status": "COMPLETED"
      }
    ],
    "clientReview": null,
    "hostReview": null,
    "estadoReserva": "CONFIRMADA"
  }
]
```

---

### 2. Obtener Reserva por ID

- **Método:** `GET`
- **Gateway:** `GET http://localhost:8080/reservas/reservas/{id}`
- **Servicio directo:** `GET http://localhost:8082/reservas/{id}`
- **Descripción:** Obtiene una reserva por su `_id` de MongoDB.

#### Parámetros
| Nombre | Tipo | Ubicación | Requerido | Descripción |
|--------|------|-----------|-----------|-------------|
| `id` | `string` | Path | Sí | ID del documento MongoDB (ObjectId) |

#### Response (200 OK)
Misma estructura que `Reserva` en el listado.

#### Response (404 Not Found)
```json
{
  "timestamp": "2026-05-11T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Reserva not found with id: abc123def456"
}
```

---

### 3. Crear Reserva

- **Método:** `POST`
- **Gateway:** `POST http://localhost:8080/reservas/reservas`
- **Servicio directo:** `POST http://localhost:8082/reservas`
- **Descripción:** Crea una nueva reserva. Valida que el huésped exista en `user-svc`, el hotel y la habitación en `gestion-svc`, que `checkIn < checkOut`, y que la habitación esté disponible (sin solapamiento con reservas activas: `CONFIRMADA`, `RESERVADA` o `BLOQUEADA`).
- **Content-Type:** `application/json`

#### Request Body (JSON)
```json
{
  "idHabitacion": "1",
  "hotelId": 9999998,
  "checkIn": "2026-06-05T00:00:00Z",
  "checkOut": "2026-06-10T00:00:00Z",
  "precioNoche": 100.0,
  "precioTotal": 500.0,
  "status": "PENDING",
  "huesped": {
    "idUsuario": "123456",
    "nombreApellido": "Juan Pérez",
    "email": "juan@email.com"
  },
  "pago": [
    {
      "method": "CREDIT_CARD",
      "transactionId": "txn_abc123",
      "amount": {
        "precio": 50000.0,
        "moneda": "ARS"
      },
      "status": "COMPLETED"
    }
  ],
  "estadoReserva": "RESERVADA"
}
```

#### Campos del Request Body
| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `_id` | `string` | No | MongoDB ID (se auto-genera si se omite) |
| `idHabitacion` | `string` | Sí | ID de la habitación |
| `hotelId` | `integer` | Sí | ID del hotel |
| `createdAt` | `string (ISO 8601)` | No | Timestamp de creación |
| `checkIn` | `string (ISO 8601)` | Sí | Fecha/hora de check-in |
| `checkOut` | `string (ISO 8601)` | Sí | Fecha/hora de check-out |
| `precioNoche` | `number` | No | Precio por noche |
| `precioTotal` | `number` | No | Precio total |
| `status` | `string` | No | Estado libre (ej. PENDING, CONFIRMED) |
| `huesped` | `object` | No | Información del huésped |
| `pago` | `array` | No | Detalles de pago |
| `clientReview` | `object or null` | No | Review del cliente |
| `hostReview` | `object or null` | No | Review del anfitrión |
| `estadoReserva` | `string (enum)` | No | Estado enum de la reserva |

#### Response (200 OK)
La reserva creada con su `_id` asignado.

---

### 4. Actualizar Reserva (Full Replacement)

- **Método:** `PUT`
- **Gateway:** `PUT http://localhost:8080/reservas/reservas/{id}`
- **Servicio directo:** `PUT http://localhost:8082/reservas/{id}`
- **Descripción:** Reemplaza completamente una reserva existente. El `_id` del body se sobreescribe con el del path.
- **Content-Type:** `application/json`

#### Parámetros
| Nombre | Tipo | Ubicación | Requerido | Descripción |
|--------|------|-----------|-----------|-------------|
| `id` | `string` | Path | Sí | ID del documento MongoDB a actualizar |

#### Request Body
Misma estructura que el POST. Enviar el objeto `Reserva` completo.

#### Response (200 OK)
La reserva actualizada.

#### Response (404 Not Found)
Si el `id` no existe.

---

### 5. Eliminar Reserva

- **Método:** `DELETE`
- **Gateway:** `DELETE http://localhost:8080/reservas/reservas/{id}`
- **Servicio directo:** `DELETE http://localhost:8082/reservas/{id}`
- **Descripción:** Elimina una reserva por su `_id`.

#### Parámetros
| Nombre | Tipo | Ubicación | Requerido | Descripción |
|--------|------|-----------|-----------|-------------|
| `id` | `string` | Path | Sí | ID del documento MongoDB a eliminar |

#### Response (204 No Content)
Sin cuerpo.

#### Response (404 Not Found)
Si el `id` no existe.

---

### 6. Listar Habitaciones (Cacheadas)

- **Método:** `GET`
- **Gateway:** `GET http://localhost:8080/reservas/habitaciones`
- **Servicio directo:** `GET http://localhost:8082/habitaciones`
- **Descripción:** Obtiene todas las habitaciones almacenadas en la caché local de MongoDB (sincronizadas desde `gestion-svc` vía RabbitMQ).

#### Parámetros
Ninguno.

#### Response (200 OK)
```json
[
  {
    "id": "mongoId1",
    "habitacionId": 101,
    "numero": 101,
    "capacidad": 2,
    "precioNoche": 45000.0,
    "amenities": ["wifi", "tv", "aire"],
    "reservas": [
      {
        "_id": "reservaId1",
        "checkIn": "2026-06-05T00:00:00Z",
        "checkOut": "2026-06-10T00:00:00Z",
        "precioTotal": 225000.0,
        "estadoReserva": "CONFIRMADA"
      }
    ],
    "hotel": {
      "id": 1,
      "nombre": "Hotel Buenos Aires",
      "categoria": 4,
      "domicilio": "Av. Corrientes 1234",
      "ubicacion": {
        "type": "Point",
        "coordinates": [-58.3816, -34.6037]
      }
    },
    "idTipoHabitacion": 1,
    "tipoHabitacion": "DOBLE"
  }
]
```

---

### 7. Obtener Habitación por ID

- **Método:** `GET`
- **Gateway:** `GET http://localhost:8080/reservas/habitaciones/{id}`
- **Servicio directo:** `GET http://localhost:8082/habitaciones/{id}`
- **Descripción:** Obtiene una habitación cacheada por su `_id` de MongoDB (no es lo mismo que `habitacionId` de `gestion-svc`).

#### Parámetros
| Nombre | Tipo | Ubicación | Requerido | Descripción |
|--------|------|-----------|-----------|-------------|
| `id` | `string` | Path | Sí | ID del documento MongoDB de la habitación |

#### Response (200 OK)
Objeto `Habitacion` (misma estructura que en el listado).

#### Response (404 Not Found)
Si el `id` no existe.

---

## JSON Schemas (Draft-07)

### Schema: `Reserva`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://example.com/schemas/reserva.json",
  "title": "Reserva",
  "description": "Representa una reserva de habitación",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "description": "ID del documento MongoDB (auto-generado si se omite)"
    },
    "idHabitacion": {
      "type": "string",
      "description": "ID de la habitación (como string)"
    },
    "hotelId": {
      "type": "integer",
      "description": "ID del hotel"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp de creación (ISO 8601)"
    },
    "checkIn": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha y hora de check-in (ISO 8601)"
    },
    "checkOut": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha y hora de check-out (ISO 8601)"
    },
    "precioNoche": {
      "type": "number",
      "description": "Precio por noche"
    },
    "precioTotal": {
      "type": "number",
      "description": "Precio total de la reserva"
    },
    "status": {
      "type": "string",
      "description": "Estado libre del sistema (ej. PENDING, CONFIRMED)"
    },
    "huesped": {
      "$ref": "#/definitions/Huesped"
    },
    "pago": {
      "type": "array",
      "items": { "$ref": "#/definitions/Pago" },
      "description": "Detalles de pago"
    },
    "clientReview": {
      "oneOf": [
        { "$ref": "#/definitions/Review" },
        { "type": "null" }
      ],
      "description": "Review del cliente (nullable)"
    },
    "hostReview": {
      "oneOf": [
        { "$ref": "#/definitions/Review" },
        { "type": "null" }
      ],
      "description": "Review del anfitrión (nullable)"
    },
    "estadoReserva": {
      "$ref": "#/definitions/EstadoReserva"
    }
  },
  "required": ["idHabitacion", "hotelId", "checkIn", "checkOut"],
  "definitions": {
    "Huesped": {
      "type": "object",
      "properties": {
        "idUsuario": { "type": "string" },
        "nombreApellido": { "type": "string" },
        "email": { "type": "string", "format": "email" }
      },
      "required": ["idUsuario"]
    },
    "Pago": {
      "type": "object",
      "properties": {
        "method": { "type": "string" },
        "transactionId": { "type": "string" },
        "amount": { "$ref": "#/definitions/Tarifa" },
        "status": { "type": "string" }
      }
    },
    "Tarifa": {
      "type": "object",
      "properties": {
        "precio": { "type": "number" },
        "moneda": { "type": "string" }
      }
    },
    "Review": {
      "type": "object",
      "properties": {
        "rating": { "type": "number", "minimum": 1, "maximum": 5 },
        "comment": { "type": "string" },
        "createdAt": { "type": "string" }
      }
    },
    "EstadoReserva": {
      "type": "string",
      "enum": ["CONFIRMADA", "RESERVADA", "CANCELADA", "FINALIZADA", "BLOQUEADA", "ADEUDADA"],
      "description": "CONFIRMADA, RESERVADA, BLOQUEADA se consideran activas (afectan disponibilidad)"
    }
  }
}
```

### Schema: `Habitacion`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://example.com/schemas/habitacion.json",
  "title": "Habitacion",
  "description": "Representa una habitación cacheada desde gestion-svc",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID del documento MongoDB (auto-generado)"
    },
    "habitacionId": {
      "type": "integer",
      "description": "ID de la habitación en gestion-svc (business key)"
    },
    "numero": {
      "type": "integer",
      "description": "Número de habitación"
    },
    "capacidad": {
      "type": "integer",
      "description": "Capacidad máxima de huéspedes"
    },
    "precioNoche": {
      "type": "number",
      "description": "Precio por noche"
    },
    "amenities": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Lista de servicios/amenidades"
    },
    "reservas": {
      "type": "array",
      "items": { "$ref": "#/definitions/ReservaSimple" },
      "description": "Reservas asociadas (versión simplificada)"
    },
    "hotel": {
      "$ref": "#/definitions/Hotel"
    },
    "idTipoHabitacion": {
      "type": "integer",
      "description": "ID del tipo de habitación"
    },
    "tipoHabitacion": {
      "type": "string",
      "description": "Descripción del tipo de habitación (ej. DOBLE)"
    }
  },
  "definitions": {
    "ReservaSimple": {
      "type": "object",
      "properties": {
        "_id": { "type": "string" },
        "checkIn": { "type": "string", "format": "date-time" },
        "checkOut": { "type": "string", "format": "date-time" },
        "precioTotal": { "type": "number" },
        "estadoReserva": { "$ref": "reserva.json#/definitions/EstadoReserva" }
      }
    },
    "Hotel": {
      "type": "object",
      "properties": {
        "id": { "type": "integer" },
        "nombre": { "type": "string" },
        "categoria": { "type": "integer" },
        "domicilio": { "type": "string" },
        "ubicacion": {
          "type": "object",
          "properties": {
            "type": { "type": "string", "enum": ["Point"] },
            "coordinates": {
              "type": "array",
              "items": { "type": "number" },
              "minItems": 2,
              "maxItems": 2
            }
          },
          "required": ["type", "coordinates"]
        }
      }
    }
  }
}
```

---

## Estados de Reserva

| Valor | Descripción | Activa (afecta disponibilidad) |
|-------|-------------|:---:|
| `CONFIRMADA` | Reserva confirmada | Sí |
| `RESERVADA` | Reserva pendiente | Sí |
| `BLOQUEADA` | Habitación bloqueada | Sí |
| `CANCELADA` | Reserva cancelada | No |
| `FINALIZADA` | Reserva finalizada | No |
| `ADEUDADA` | Reserva con deuda pendiente | No |

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200 OK` | Operación exitosa (GET, POST, PUT) |
| `204 No Content` | Eliminación exitosa (DELETE) |
| `404 Not Found` | Recurso no encontrado |
| `500 Internal Server Error` | Error de validación o interno |

---

## Notas Técnicas

- **Gateway base:** `http://localhost:8080`
- **Servicio directo:** `http://localhost:8082`
- **Base de datos:** MongoDB (colecciones `reserva` y `habitacion`)
- **Sincronización:** Las habitaciones se sincronizan desde `gestion-svc` vía RabbitMQ (eventos `HabitacionEvent`)
- **Validaciones en POST:**
  - El huésped debe existir en `user-svc` (Feign client `GET /users/{id}`)
  - El hotel debe existir en `gestion-svc` (Feign client `GET /hoteles/{id}`)
  - La habitación debe existir y pertenecer al hotel (Feign client `GET /habitaciones/{id}`)
  - `checkIn` debe ser anterior a `checkOut`
  - La habitación debe estar disponible (sin solapamiento de fechas con reservas activas)
