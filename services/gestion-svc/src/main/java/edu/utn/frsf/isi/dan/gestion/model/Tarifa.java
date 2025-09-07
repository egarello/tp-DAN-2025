package edu.utn.frsf.isi.dan.gestion.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import io.micrometer.common.lang.Nullable;

@Entity
@Table(name = "tarifa", schema = "tp_dan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarifa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Nullable
    private LocalDate fechaInicio;
    @Nullable
    private LocalDate fechaFin;
    @ManyToOne
    @JoinColumn(name = "id_tipo_habitacion")
    private TipoHabitacion tipoHabitacion;
    private Double precioNoche;
}
