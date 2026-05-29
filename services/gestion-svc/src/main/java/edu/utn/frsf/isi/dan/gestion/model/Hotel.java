package edu.utn.frsf.isi.dan.gestion.model;

import java.util.List;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "hotel", schema = "tp_dan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "El nombre del hotel es obligatorio")
    private String nombre;

    @NotBlank(message = "El CUIT del hotel es obligatorio")
    private String cuit;

    @NotBlank(message = "El domicilio del hotel es obligatorio")
    private String domicilio;

    @NotNull(message = "La latitud del hotel es obligatoria")
    private Double latitud;
    @NotNull(message = "La longitud del hotel es obligatoria")
    private Double longitud;

    @NotBlank(message = "El telefono del hotel es obligatorio")
    private String telefono;

    @NotBlank(message = "El correo de contacto del hotel es obligatorio")
    private String correoContacto;

    @NotNull(message = "La categoria del hotel es obligatoria")
    private Integer categoria;
    @Builder.Default
    private Boolean cerrado = false;
    private LocalDateTime fechaCierre;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hotel")
    @JsonIgnore
    private List<Habitacion> habitaciones;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hotel", orphanRemoval = true)
    private List<AmenityHotel> amenities;

}
