package edu.utn.frsf.isi.dan.reservas_svc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class ControllerAdvisor {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionInfo> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        ExceptionInfo exceptionInfo = new ExceptionInfo(
                ex.getMessage(),
                request.getDescription(false),
                String.valueOf(System.currentTimeMillis()),
                HttpStatus.FORBIDDEN.value()
        );
        return new ResponseEntity<>(exceptionInfo, HttpStatus.FORBIDDEN);
    }
}
