package edu.utn.frsf.isi.dan.reservas_svc.client;

import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HotelDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "gestion-svc")
public interface GestionServiceClient {
    
    @GetMapping("/hoteles/{id}")
    HotelDto getHotel(@PathVariable("id") Long id);
    
    @GetMapping("/habitaciones/{id}")
    HabitacionDto getHabitacion(@PathVariable("id") Long id);
    
    @GetMapping("/habitaciones/{id}/disponible")
    Boolean isHabitacionDisponible(@PathVariable("id") Long id);
}
