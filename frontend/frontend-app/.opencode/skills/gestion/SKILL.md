---
name: gestion
description: Skill para el frontend que documenta los endpoints del servicio gestion-svc (consumidos a través del API Gateway en http://localhost:8080). Incluye método, ruta completa (vía Gateway /gestion), parámetros, esquema/estructura del RequestBody cuando aplica y ejemplos JSON.
---

Base URL

API Gateway: http://localhost:8080
Prefijo Gateway para este servicio: /gestion (ej: /gestion/hoteles)
Referencias código

--

Schemas disponibles en `../schemas/gestion/*.schema.json`

--

Controladores: controller
Modelos: model
DTO Tarifa: TarifaRecord.java
HotelController (mapeo controller: /hoteles, uso en Gateway: /gestion/hoteles)
Model: Hotel.java
Amenity enum: Amenity.java

1) POST /gestion/hoteles

- Descripción: Crear un hotel.
- RequestBody: Hotel (envíe datos del hotel; campos relevantes: nombre, cuit, domicilio, latitud, longitud, telefono, correoContacto, categoria).
- Ejemplo request:
{
"nombre": "Hotel Central",
"cuit": "30-12345678-9",
"domicilio": "Av. Siempre Viva 742",
"latitud": -34.6037,
"longitud": -58.3816,
"telefono": "1145678900",
"correoContacto": "contacto@hotelcentral.com",
"categoria": 4
}
- Respuesta: 200 OK → Hotel creado (objeto Hotel).

2) GET /gestion/hoteles/{id}

- Parámetros: path id (Integer)
- Respuesta: 200 OK → Hotel o 404 Not Found.

3) GET /gestion/hoteles

- Parámetros: ninguno (devuelve lista)
- Respuesta: 200 OK → [Hotel]

4) PUT /gestion/hoteles/{id}

- Parámetros: path id
- RequestBody: Hotel (mismo formato que POST; id se toma del path)
- Respuesta: 200 OK → Hotel actualizado o 404.

5) DELETE /gestion/hoteles/{id}

- Parámetros: path id
- Respuesta: 204 No Content o 404.

6) POST /gestion/hoteles/{id}/amenities/add

- Parámetros: path id
- RequestBody: List<Amenity> (lista de strings con nombres del enum, p.ej. ["WIFI","PILETA"])
- Respuesta: 200 OK → Hotel actualizado.

7) DELETE /gestion/hoteles/{id}/amenities/remove?amenity={AMENITY}

- Parámetros: path id, query amenity (uno de los valores del enum Amenity, p.ej. WIFI)
- Respuesta: 200 OK → Hotel actualizado.

8) GET /gestion/hoteles/buscar

- Query params (todos opcionales): nombre, domicilio, latitud, longitud, telefono, correoContacto, categoria, amenity, sortBy
- Respuesta: 200 OK → [Hotel] (lista filtrada)

--

HabitacionController (mapeo: /habitaciones, uso: /gestion/habitaciones)
Model: Habitacion.java

1) POST /gestion/habitaciones

- Descripción: Crear habitación.
- RequestBody: Habitacion (campos: numero (int, >=1), piso (int, >=1), tipoHabitacion (obj con id), hotel (obj con id)).
- Ejemplo request:
{
"numero": 101,
"piso": 1,
"tipoHabitacion": { "id": 1 },
"hotel": { "id": 10 }
}
- Respuesta: 200 OK → Habitacion creada.

2) GET /gestion/habitaciones/{id}

- Parámetros: path id
- Respuesta: 200 OK → Habitacion o 404.

3) GET /gestion/habitaciones

- Respuesta: 200 OK → [Habitacion].

4) PUT /gestion/habitaciones/{id}

- RequestBody: Habitacion (se usa id del path).
- Respuesta: 200 OK → Habitacion actualizada o 404.

5) DELETE /gestion/habitaciones/{id}

- Respuesta: 204 No Content o 404.

6) GET /gestion/habitaciones/search

- Query params (opcionales): cantHuespedes (Integer), tipoHabitacionId (Integer), precioMin (Double), precioMax (Double)
- Respuesta: 200 OK → [Habitacion] (lista que cumple filtros)

--

TipoHabitacionController (mapeo: /tipos-habitacion, uso: /gestion/tipos-habitacion)
Model: TipoHabitacion.java

1) POST /gestion/tipos-habitacion

- RequestBody: TipoHabitacion (id, nombre, descripcion, capacidad). Ejemplo:
{
"id": 1,
"nombre": "Double",
"descripcion": "Doble estándar",
"capacidad": 2
}
- Respuesta: 200 OK → TipoHabitacion creado.

2) GET /gestion/tipos-habitacion/{id}

- Respuesta: 200 OK → TipoHabitacion.

3) GET /gestion/tipos-habitacion

- Respuesta: 200 OK → [TipoHabitacion].

4)  PUT /gestion/tipos-habitacion/{id}

- RequestBody: TipoHabitacion (id tomado del path)
- Respuesta: 200 OK → actualizado.

5) DELETE /gestion/tipos-habitacion/{id}

- Respuesta: 204 No Content.

-- 

TarifaController (mapeo: /tarifas, uso: /gestion/tarifas)
DTO request: TarifaRecord.java
Model respuesta: Tarifa.java

1) POST /gestion/tarifas

- RequestBody: TarifaRecord:
{
"fechaInicio": "2026-06-01", // ISO date as string
"fechaFin": "2026-06-30",
"idTipoHabitacion": 1,
"precioNoche": 1500.0
}
- Respuesta: 200 OK → Tarifa (obj con id, fechaInicio, fechaFin, tipoHabitacion, precioNoche).

2) GET /gestion/tarifas/{id}

- Respuesta: 200 OK → Tarifa o 404.

3) GET /gestion/tarifas

- Respuesta: 200 OK → [Tarifa].

4) PUT /gestion/tarifas/{id}

- RequestBody: TarifaRecord (igual a POST)
- Respuesta: 200 OK → Tarifa actualizado o 404.

5) DELETE /gestion/tarifas/{id}

- Respuesta: 204 No Content o 404.

6) POST /gestion/tarifas/promocional?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD

- RequestBody: TarifaRecord (promocional)
- Query params: fechaInicio, fechaFin (fecha en ISO)
- Respuesta: 200 OK → List<Tarifa> (múltiples tarifas afectadas: la actual modificada, la promocional y la siguiente).

7) GET /gestion/tarifas/habitacion/{idHabitacion}

- Parámetros: path idHabitacion
- Respuesta: 200 OK → Tarifa vigente para la habitación o 404.

Notas finales y recomendaciones para el frontend

Rutas de consumo vía Gateway: prefix http://localhost:8080/gestion/.... Confirma el prefijo de Gateway si cambia.
Para RequestBody que contienen entidades JPA con relaciones (p.ej. Habitacion con tipoHabitacion y hotel), en el cliente es suficiente enviar los objetos anidados con solo id cuando se quiere referenciar entidades existentes (p.ej. "tipoHabitacion": {"id": 1}).
Para Amenity usar los valores del enum como strings (p.ej. "WIFI", "PILETA").
Validaciones del backend (ej.: Habitacion.numero y piso deben ser >=1, Propietario.nombre mínimo 5 caracteres) deben reflejarse en los formularios del frontend.