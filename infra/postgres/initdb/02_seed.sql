-- =====================================================
-- DATOS DE PRUEBA PARA DESARROLLO - TP DAN 2025
-- =====================================================

-- Insertar hoteles de prueba
INSERT INTO tp_dan.hotel (nombre, cuit, domicilio, latitud, longitud, telefono, correo_contacto, categoria) VALUES
    ('Hotel Plaza Mayor', '30-12345678-9', 'Av. San Martín 1234, Córdoba', -31.4167, -64.1833, '0351-1234567', 'info@plazamayor.com', 4),
    ('Resort Las Sierras', '30-87654321-0', 'Ruta 5 Km 45, Villa Carlos Paz', -31.4000, -64.5167, '03541-987654', 'reservas@lassierras.com', 5),
    ('Hotel Centro', '30-11223344-5', 'Belgrano 567, Córdoba', -31.4167, -64.1833, '0351-5551234', 'contacto@hotelcentro.com', 3),
    ('Cabañas del Lago', '30-55667788-9', 'Lago San Roque, Villa Carlos Paz', -31.4000, -64.5167, '03541-123789', 'info@cabanasdellago.com', 2),
    ('Hotel Business', '30-99887766-5', 'Av. Colón 890, Córdoba', -31.4167, -64.1833, '0351-4445678', 'business@hotelbusiness.com', 4)
ON CONFLICT (id) DO NOTHING;

-- Insertar habitaciones para cada hotel
-- Hotel Plaza Mayor (id=1)
INSERT INTO tp_dan.habitacion (numero, piso, id_tipo, id_hotel) VALUES
    (101, 1, 1, 1), -- Single
    (102, 1, 2, 1), -- Doble Individual
    (201, 2, 3, 1), -- Doble
    (202, 2, 4, 1), -- Triple Individual
    (301, 3, 7, 1), -- Doble Superior
    (302, 3, 8, 1), -- Triple Superior
    (401, 4, 9, 1)  -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Resort Las Sierras (id=2)
INSERT INTO tp_dan.habitacion (numero, piso, id_tipo, id_hotel) VALUES
    (101, 1, 3, 2), -- Doble
    (102, 1, 5, 2), -- Triple
    (201, 2, 6, 2), -- Cuádruple
    (202, 2, 7, 2), -- Doble Superior
    (301, 3, 8, 2), -- Triple Superior
    (401, 4, 9, 2)  -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Hotel Centro (id=3)
INSERT INTO tp_dan.habitacion (numero, piso, id_tipo, id_hotel) VALUES
    (101, 1, 1, 3), -- Single
    (102, 1, 2, 3), -- Doble Individual
    (201, 2, 3, 3), -- Doble
    (202, 2, 4, 3)  -- Triple Individual
ON CONFLICT (id) DO NOTHING;

-- Cabañas del Lago (id=4)
INSERT INTO tp_dan.habitacion (numero, piso, id_tipo, id_hotel) VALUES
    (1, 1, 5, 4),   -- Triple
    (2, 1, 6, 4),   -- Cuádruple
    (3, 1, 8, 4),   -- Triple Superior
    (4, 1, 9, 4)    -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Hotel Business (id=5)
INSERT INTO tp_dan.habitacion (numero, piso, id_tipo, id_hotel) VALUES
    (101, 1, 1, 5), -- Single
    (102, 1, 2, 5), -- Doble Individual
    (201, 2, 3, 5), -- Doble
    (202, 2, 7, 5), -- Doble Superior
    (301, 3, 8, 5)  -- Triple Superior
ON CONFLICT (id) DO NOTHING;

-- Insertar tarifas para diferentes períodos
-- Tarifas para temporada alta (diciembre - febrero)
INSERT INTO tp_dan.tarifa (fecha_inicio, fecha_fin, id_tipo_habitacion, precio_noche) VALUES
    ('2024-12-01', '2025-02-28', 1, 150.00), -- Single
    ('2024-12-01', '2025-02-28', 2, 200.00), -- Doble Individual
    ('2024-12-01', '2025-02-28', 3, 220.00), -- Doble
    ('2024-12-01', '2025-02-28', 4, 280.00), -- Triple Individual
    ('2024-12-01', '2025-02-28', 5, 300.00), -- Triple
    ('2024-12-01', '2025-02-28', 6, 350.00), -- Cuádruple
    ('2024-12-01', '2025-02-28', 7, 250.00), -- Doble Superior
    ('2024-12-01', '2025-02-28', 8, 320.00), -- Triple Superior
    ('2024-12-01', '2025-02-28', 9, 380.00)  -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Tarifas para temporada media (marzo - mayo, septiembre - noviembre)
INSERT INTO tp_dan.tarifa (fecha_inicio, fecha_fin, id_tipo_habitacion, precio_noche) VALUES
    ('2025-03-01', '2025-05-31', 1, 120.00), -- Single
    ('2025-03-01', '2025-05-31', 2, 160.00), -- Doble Individual
    ('2025-03-01', '2025-05-31', 3, 180.00), -- Doble
    ('2025-03-01', '2025-05-31', 4, 220.00), -- Triple Individual
    ('2025-03-01', '2025-05-31', 5, 240.00), -- Triple
    ('2025-03-01', '2025-05-31', 6, 280.00), -- Cuádruple
    ('2025-03-01', '2025-05-31', 7, 200.00), -- Doble Superior
    ('2025-03-01', '2025-05-31', 8, 260.00), -- Triple Superior
    ('2025-03-01', '2025-05-31', 9, 300.00), -- Cuádruple Superior
    ('2025-09-01', '2025-11-30', 1, 120.00), -- Single
    ('2025-09-01', '2025-11-30', 2, 160.00), -- Doble Individual
    ('2025-09-01', '2025-11-30', 3, 180.00), -- Doble
    ('2025-09-01', '2025-11-30', 4, 220.00), -- Triple Individual
    ('2025-09-01', '2025-11-30', 5, 240.00), -- Triple
    ('2025-09-01', '2025-11-30', 6, 280.00), -- Cuádruple
    ('2025-09-01', '2025-11-30', 7, 200.00), -- Doble Superior
    ('2025-09-01', '2025-11-30', 8, 260.00), -- Triple Superior
    ('2025-09-01', '2025-11-30', 9, 300.00)  -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Tarifas para temporada baja (junio - agosto)
INSERT INTO tp_dan.tarifa (fecha_inicio, fecha_fin, id_tipo_habitacion, precio_noche) VALUES
    ('2025-06-01', '2025-08-31', 1, 100.00), -- Single
    ('2025-06-01', '2025-08-31', 2, 130.00), -- Doble Individual
    ('2025-06-01', '2025-08-31', 3, 150.00), -- Doble
    ('2025-06-01', '2025-08-31', 4, 180.00), -- Triple Individual
    ('2025-06-01', '2025-08-31', 5, 200.00), -- Triple
    ('2025-06-01', '2025-08-31', 6, 230.00), -- Cuádruple
    ('2025-06-01', '2025-08-31', 7, 170.00), -- Doble Superior
    ('2025-06-01', '2025-08-31', 8, 220.00), -- Triple Superior
    ('2025-06-01', '2025-08-31', 9, 250.00)  -- Cuádruple Superior
ON CONFLICT (id) DO NOTHING;

-- Insertar amenities para cada hotel
-- Hotel Plaza Mayor (id=1) - Hotel 4 estrellas
INSERT INTO tp_dan.amenity_hotel (id_hotel, amenity) VALUES
    (1, 'PILETA'),
    (1, 'GIMNASIO'),
    (1, 'RESTAURANTE'),
    (1, 'BAR'),
    (1, 'ESTACIONAMIENTO'),
    (1, 'WIFI'),
    (1, 'AIRE_ACONDICIONADO'),
    (1, 'TV_CABLE'),
    (1, 'SERVICIO_HABITACIONES'),
    (1, 'LIMPIEZA_DIARIA'),
    (1, 'SPA'),
    (1, 'SALA_REUNIONES')
ON CONFLICT (id) DO NOTHING;

-- Resort Las Sierras (id=2) - Resort 5 estrellas
INSERT INTO tp_dan.amenity_hotel (id_hotel, amenity) VALUES
    (2, 'PILETA'),
    (2, 'PISCINA_CUBIERTA'),
    (2, 'PISCINA_DESCUBIERTA'),
    (2, 'SAUNA'),
    (2, 'GIMNASIO'),
    (2, 'RESTAURANTE'),
    (2, 'BAR'),
    (2, 'ESTACIONAMIENTO'),
    (2, 'WIFI'),
    (2, 'AIRE_ACONDICIONADO'),
    (2, 'CALENTADOR'),
    (2, 'TV_CABLE'),
    (2, 'SERVICIO_HABITACIONES'),
    (2, 'LIMPIEZA_DIARIA'),
    (2, 'SPA'),
    (2, 'SALA_JUEGOS'),
    (2, 'SALA_REUNIONES'),
    (2, 'TRANSPORTE_AEROPUERTO')
ON CONFLICT (id) DO NOTHING;

-- Hotel Centro (id=3) - Hotel 3 estrellas
INSERT INTO tp_dan.amenity_hotel (id_hotel, amenity) VALUES
    (3, 'WIFI'),
    (3, 'AIRE_ACONDICIONADO'),
    (3, 'TV_CABLE'),
    (3, 'LIMPIEZA_DIARIA'),
    (3, 'ESTACIONAMIENTO')
ON CONFLICT (id) DO NOTHING;

-- Cabañas del Lago (id=4) - Cabañas 2 estrellas
INSERT INTO tp_dan.amenity_hotel (id_hotel, amenity) VALUES
    (4, 'PILETA'),
    (4, 'ESTACIONAMIENTO'),
    (4, 'WIFI'),
    (4, 'AIRE_ACONDICIONADO'),
    (4, 'TV_CABLE')
ON CONFLICT (id) DO NOTHING;

-- Hotel Business (id=5) - Hotel 4 estrellas
INSERT INTO tp_dan.amenity_hotel (id_hotel, amenity) VALUES
    (5, 'GIMNASIO'),
    (5, 'RESTAURANTE'),
    (5, 'BAR'),
    (5, 'ESTACIONAMIENTO'),
    (5, 'WIFI'),
    (5, 'AIRE_ACONDICIONADO'),
    (5, 'TV_CABLE'),
    (5, 'SERVICIO_HABITACIONES'),
    (5, 'LIMPIEZA_DIARIA'),
    (5, 'SALA_REUNIONES'),
    (5, 'TRANSPORTE_AEROPUERTO')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CONSULTAS DE PRUEBA ÚTILES PARA DESARROLLO
-- =====================================================

-- Para verificar que los datos se insertaron correctamente:
-- SELECT 'Hoteles' as tabla, COUNT(*) as cantidad FROM tp_dan.hotel
-- UNION ALL
-- SELECT 'Habitaciones', COUNT(*) FROM tp_dan.habitacion
-- UNION ALL
-- SELECT 'Tarifas', COUNT(*) FROM tp_dan.tarifa
-- UNION ALL
-- SELECT 'Amenities', COUNT(*) FROM tp_dan.amenity_hotel;

-- Para ver hoteles con sus amenities:
-- SELECT h.nombre, h.categoria, array_agg(ah.amenity) as amenities
-- FROM tp_dan.hotel h
-- LEFT JOIN tp_dan.amenity_hotel ah ON h.id = ah.id_hotel
-- GROUP BY h.id, h.nombre, h.categoria
-- ORDER BY h.categoria DESC;

-- Para ver habitaciones disponibles con precios:
-- SELECT h.nombre as hotel, hab.numero, hab.piso, th.nombre as tipo, th.capacidad, t.precio_noche
-- FROM tp_dan.hotel h
-- JOIN tp_dan.habitacion hab ON h.id = hab.id_hotel
-- JOIN tp_dan.tipo_habitacion th ON hab.id_tipo = th.id
-- LEFT JOIN tp_dan.tarifa t ON th.id = t.id_tipo_habitacion
-- WHERE t.fecha_inicio <= CURRENT_DATE AND t.fecha_fin >= CURRENT_DATE
-- ORDER BY h.nombre, hab.numero;
