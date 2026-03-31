package edu.utn.frsf.isi.dan.reservas_svc.dto;

import java.util.List;

public class HabitacionDto {
    private Long habitacionId;
    private Integer numero;
    private Integer piso;
    private Integer tipoHabitacionId;
    private Integer capacidad;
    private String tipoHabitacion;
    private String tipoHabitacionDescripcion;
    private Double precioNoche;
    private List<String> amenities;
    private HotelDto hotel;
    
    public HabitacionDto() {}
    
    public HabitacionDto(Long habitacionId, Integer numero, Integer piso, Integer tipoHabitacionId, Integer capacidad, String tipoHabitacion, String tipoHabitacionDescripcion, Double precioNoche, List<String> amenities, HotelDto hotel) {
        this.habitacionId = habitacionId;
        this.numero = numero;
        this.piso = piso;
        this.tipoHabitacionId = tipoHabitacionId;
        this.capacidad = capacidad;
        this.tipoHabitacion = tipoHabitacion;
        this.tipoHabitacionDescripcion = tipoHabitacionDescripcion;
        this.precioNoche = precioNoche;
        this.amenities = amenities;
        this.hotel = hotel;
    }
    
    public Long getHabitacionId() { return habitacionId; }
    public void setHabitacionId(Long habitacionId) { this.habitacionId = habitacionId; }
    
    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }
    
    public Integer getPiso() { return piso; }
    public void setPiso(Integer piso) { this.piso = piso; }
    
    public Integer getTipoHabitacionId() { return tipoHabitacionId; }
    public void setTipoHabitacionId(Integer tipoHabitacionId) { this.tipoHabitacionId = tipoHabitacionId; }
    
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    
    public String getTipoHabitacion() { return tipoHabitacion; }
    public void setTipoHabitacion(String tipoHabitacion) { this.tipoHabitacion = tipoHabitacion; }
    
    public String getTipoHabitacionDescripcion() { return tipoHabitacionDescripcion; }
    public void setTipoHabitacionDescripcion(String tipoHabitacionDescripcion) { this.tipoHabitacionDescripcion = tipoHabitacionDescripcion; }
    
    public Double getPrecioNoche() { return precioNoche; }
    public void setPrecioNoche(Double precioNoche) { this.precioNoche = precioNoche; }
    
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    
    public HotelDto getHotel() { return hotel; }
    public void setHotel(HotelDto hotel) { this.hotel = hotel; }
}
