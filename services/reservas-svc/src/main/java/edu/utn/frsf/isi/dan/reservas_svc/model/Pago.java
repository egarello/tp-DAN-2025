package edu.utn.frsf.isi.dan.reservas_svc.model;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pago {
    private String transactionId;
    private String method;
    private Tarifa amount;
    private String status;
}
