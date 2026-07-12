package edu.utn.frsf.isi.dan.user.exception;

/**
 * Se usa para el chequeo de ownership que el gateway no puede hacer por sí solo
 * (el gateway solo valida el rol; si el recurso pedido pertenece al usuario que
 * hace la llamada se valida acá, comparando contra el header X-User-Id).
 */
public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
