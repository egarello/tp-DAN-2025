package edu.utn.frsf.isi.dan.gestion.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @NotNull(message = "El tipo de habitación no puede ser nulo")
    @ManyToOne
    @JoinColumn(name = "id_tipo")
    private TipoHabitacion tipoHabitacion;
    @NotNull(message = "El hotel no puede ser nulo")
    @ManyToOne
    @JoinColumn(name = "id_hotel")
    private Hotel hotel;

    @JsonProperty("idTipoHabitacion")
    public void setIdTipoHabitacion(Integer idTipoHabitacion) {
        this.tipoHabitacion = idTipoHabitacion == null ? null : TipoHabitacion.builder().id(idTipoHabitacion).build();
    }

    @JsonProperty("idHotel")
    public void setIdHotel(Integer idHotel) {
        this.hotel = idHotel == null ? null : Hotel.builder().id(idHotel).build();
    }
    
}
