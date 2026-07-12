-- Agrega soporte de autenticación a la tabla de usuarios
ALTER TABLE users.usuarios ADD COLUMN password VARCHAR(255) NULL;
ALTER TABLE users.usuarios ADD CONSTRAINT uq_usuarios_email UNIQUE (email);
