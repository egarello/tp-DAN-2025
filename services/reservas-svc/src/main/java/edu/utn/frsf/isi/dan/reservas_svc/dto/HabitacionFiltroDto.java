package edu.utn.frsf.isi.dan.reservas_svc.dto;

import java.time.Instant;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HabitacionFiltroDto {
    @NotNull
    private Instant checkIn;
    @NotNull
    private Instant checkOut;
    @NotNull
    private Integer capacidad;
    private Double precioMin;
    private Double precioMax;
    private Integer categoria;
    private List<String> amenities;

    // Filtros Geoespaciales
    private Double latitud;
    private Double longitud;
    private String unidad = "m"; // 'm' para metros, 'km' para kilómetros

    public boolean tieneGeo() {
        return latitud != null && longitud != null;
    }
}
