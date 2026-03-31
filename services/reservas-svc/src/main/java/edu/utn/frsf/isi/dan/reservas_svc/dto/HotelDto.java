package edu.utn.frsf.isi.dan.reservas_svc.dto;

public class HotelDto {
    private Integer id;
    private String nombre;
    private String cuit;
    private String domicilio;
    private Double latitud;
    private Double longitud;
    private String telefono;
    private String correoContacto;
    private Integer categoria;
    
    public HotelDto() {}
    
    public HotelDto(Integer id, String nombre, String cuit, String domicilio, Double latitud, Double longitud, String telefono, String correoContacto, Integer categoria) {
        this.id = id;
        this.nombre = nombre;
        this.cuit = cuit;
        this.domicilio = domicilio;
        this.latitud = latitud;
        this.longitud = longitud;
        this.telefono = telefono;
        this.correoContacto = correoContacto;
        this.categoria = categoria;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getCuit() { return cuit; }
    public void setCuit(String cuit) { this.cuit = cuit; }
    
    public String getDomicilio() { return domicilio; }
    public void setDomicilio(String domicilio) { this.domicilio = domicilio; }
    
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getCorreoContacto() { return correoContacto; }
    public void setCorreoContacto(String correoContacto) { this.correoContacto = correoContacto; }
    
    public Integer getCategoria() { return categoria; }
    public void setCategoria(Integer categoria) { this.categoria = categoria; }
}
