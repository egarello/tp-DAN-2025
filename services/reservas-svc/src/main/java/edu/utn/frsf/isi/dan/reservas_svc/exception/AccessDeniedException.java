package edu.utn.frsf.isi.dan.reservas_svc.exception;

/**
 * El gateway ya garantiza el rol (HUESPED/PROPIETARIO) de quien llama, pero no puede
 * saber si la reserva {id} del path le pertenece. Eso se valida acá comparando
 * reserva.huesped.idUsuario contra el header X-User-Id ya verificado por el gateway.
 */
public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
