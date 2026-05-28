package edu.utn.frsf.isi.dan.reservas_svc.service;

import org.springframework.stereotype.Service;

import edu.utn.frsf.isi.dan.reservas_svc.model.Pago;

@Service
public class PagoService {
    public boolean validarPago(Pago pago) {
        // Validar que el monto del pago sea positivo
        if (pago.getAmount().getPrecio() <= 0) {
            throw new RuntimeException("El monto del pago debe ser positivo");
        }
        // Validar que el método de pago sea válido (ejemplo: tarjeta de crédito, débito, etc.)
        if (pago.getMethod() == null || pago.getMethod().isEmpty()) {
            throw new RuntimeException("El método de pago no puede estar vacío");
        }
        return true;
    }
}
