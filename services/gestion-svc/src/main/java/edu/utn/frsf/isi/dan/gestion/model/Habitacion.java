package edu.utn.frsf.isi.dan.gestion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "habitacion", schema = "tp_dan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "El número de habitación no puede ser nulo")
    @Min(value=1, message = "El número de habitación debe ser mayor a 0")
    private Integer numero;
    @NotNull(message = "El piso no puede ser nulo")
    @Min(value=1, message = "El piso debe ser mayor a 0")
    private Integer piso;
    @ManyToOne
    @JoinColumn(name = "id_tipo")
    private TipoHabitacion tipoHabitacion;
    @ManyToOne
    @JoinColumn(name = "id_hotel")
    private Hotel hotel;
    
}
