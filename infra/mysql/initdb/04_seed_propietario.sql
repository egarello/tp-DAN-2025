-- Bootstrap: primer usuario Propietario, necesario porque el alta de Propietario
-- ya no es auto-registro público (requiere sesión de un Propietario existente).
-- Password en texto plano: Propietario123!  (hash BCrypt precalculado abajo)
-- INSERT IGNORE: si este script llegara a correr más de una vez (ej. el volumen
-- se recrea y por algún motivo la fila ya existiera), no falla por PK/UNIQUE duplicada.
INSERT IGNORE INTO users.usuarios (dni, nombre, email, telefono, tipo, password)
VALUES (
    '00000000',
    'Propietario Inicial',
    'propietario@dan-hoteles.com',
    '0000000000',
    'PROPIETARIO',
    '$2b$10$942WML/reTE4Kvjjm0L4/eSoSW8c7QbTmoDc8FyvOiBUoc9SJ//b2'
);
