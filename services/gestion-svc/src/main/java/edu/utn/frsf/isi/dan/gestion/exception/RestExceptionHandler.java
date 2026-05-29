package edu.utn.frsf.isi.dan.gestion.exception;

import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.bind.MethodArgumentNotValidException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class RestExceptionHandler {
    
    /* @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<String> errorValidacion(MethodArgumentNotValidException e) {
        String campo = e.getBindingResult().getFieldError().getField();
        return new ResponseEntity<>("Error validando entrada de: " +campo+" --> " + e.getMessage(), HttpStatus.BAD_REQUEST);
    } */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionInfo> handleValidationException(
            MethodArgumentNotValidException ex,
            WebRequest request) 
    {
        // Recorre todos los errores de campo y los concatena
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
            .map(fieldError -> fieldError.getField() + ": " 
                            + fieldError.getDefaultMessage())
            .reduce((m1, m2) -> m1 + ", " + m2)
            .orElse("Validation error");

        ExceptionInfo exceptionInfo = new ExceptionInfo(
            errorMessage,
            request.getDescription(false),
            String.valueOf(System.currentTimeMillis()),
            HttpStatus.BAD_REQUEST.value()
        );

        return new ResponseEntity<>(exceptionInfo, HttpStatus.BAD_REQUEST);
    }
}
