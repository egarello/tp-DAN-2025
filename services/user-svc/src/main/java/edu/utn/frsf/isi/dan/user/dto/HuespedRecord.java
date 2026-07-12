package edu.utn.frsf.isi.dan.user.dto;

import java.time.LocalDate;

import edu.utn.frsf.isi.dan.user.model.Huesped;
import edu.utn.frsf.isi.dan.user.model.TarjetaCredito;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record HuespedRecord(
    String nombre,
    String dni,
    String email,
    String telefono,
    LocalDate fechaNacimiento,
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Length(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    String password,
    String numeroCC,
    String nombreTitular,
    String fechaVencimientoCC,
    String cvcCC,
    Boolean esPrincipalCC,
    Integer idBanco
) {

    public Huesped toHuesped() {
        Huesped huesped = new Huesped();
        huesped.setNombre(this.nombre);
        huesped.setDni(this.dni);
        huesped.setEmail(this.email);
        huesped.setTelefono(this.telefono);
        huesped.setFechaNacimiento(this.fechaNacimiento);
        return huesped;
    }

    public TarjetaCredito toTarjetaCredito() {
        return TarjetaCredito.builder()
            .numero(this.numeroCC)
            .fechaVencimiento(this.fechaVencimientoCC)
            .nombreTitular(this.nombreTitular)
            .cvc(this.cvcCC)
            .esPrincipal(this.esPrincipalCC)
            .build();
    }

    // La tarjeta es opcional: se considera que el usuario quiso cargar una solo si
    // completó el número. Si no, se crea el Huesped sin ninguna tarjeta asociada.
    public boolean tieneDatosDeTarjeta() {
        return numeroCC != null && !numeroCC.isBlank();
    }

}