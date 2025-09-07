package edu.utn.frsf.isi.dan.gestion.dto;

import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import edu.utn.frsf.isi.dan.gestion.model.TipoHabitacion;

import java.time.LocalDate;

public record TarifaRecord(
    String fechaInicio,
    String fechaFin,
    Integer idTipoHabitacion,
    Double precioNoche
) {
 public Tarifa toTarifa() {
        return Tarifa.builder()
            .fechaInicio(LocalDate.parse(this.fechaInicio))
            .fechaFin(LocalDate.parse(this.fechaFin))
            .tipoHabitacion(createTipoHabitacionById(this.idTipoHabitacion))
            .precioNoche(this.precioNoche)
            .build();
    }

    private static TipoHabitacion createTipoHabitacionById(Integer id) {
        TipoHabitacion tipo = new TipoHabitacion();
        tipo.setId(id);
        return tipo;
    }
}
