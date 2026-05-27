-- Agregar columnas para cierre de hotel
ALTER TABLE IF EXISTS tp_dan.hotel
  ADD COLUMN IF NOT EXISTS cerrado boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS tp_dan.hotel
  ADD COLUMN IF NOT EXISTS fecha_cierre timestamp NULL;
