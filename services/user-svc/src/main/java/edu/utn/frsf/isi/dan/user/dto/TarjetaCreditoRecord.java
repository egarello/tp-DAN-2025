package edu.utn.frsf.isi.dan.user.dto;

import edu.utn.frsf.isi.dan.user.model.TarjetaCredito;

public record TarjetaCreditoRecord(
    String numeroCC,
    String nombreTitular,
    String fechaVencimientoCC,
    String cvcCC,
    Boolean esPrincipalCC,
    Integer idBanco
) {
 public TarjetaCredito toTarjetaCredito() {
        return TarjetaCredito.builder()
            .numero(this.numeroCC)
            .fechaVencimiento(this.fechaVencimientoCC)
            .nombreTitular(this.nombreTitular)
            .cvc(this.cvcCC)
            .esPrincipal(this.esPrincipalCC)
            .build();
    }
}
