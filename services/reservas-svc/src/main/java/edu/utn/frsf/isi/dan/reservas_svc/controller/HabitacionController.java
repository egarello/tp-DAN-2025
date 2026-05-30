package edu.utn.frsf.isi.dan.reservas_svc.controller;

import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionFiltroDto;
import edu.utn.frsf.isi.dan.reservas_svc.model.Habitacion;
import edu.utn.frsf.isi.dan.reservas_svc.service.HabitacionService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/habitaciones")
public class HabitacionController {
    @Autowired
    private HabitacionService habitacionService;

    @GetMapping
    public List<Habitacion> getAll() {
        return habitacionService.findAll();
    }

    /* @GetMapping("/search")
    public Page<Habitacion> getAllPaginated(
            @RequestParam(required = true) Instant checkIn,
            @RequestParam(required = true) Instant checkOut,
            @RequestParam(required = true) Integer capacidad,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Integer categoria,
            @RequestParam(required = false) List<String> amenities,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Construir consulta con filtros
        Pageable pageable = PageRequest.of(page, size);
        return habitacionService.findByFiltros(checkIn, checkOut, capacidad, precioMin, precioMax, categoria, amenities, pageable);
    }
    */
    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> getById(@PathVariable String id) {
        return habitacionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    } 
   @GetMapping("/search")
   public Page<Habitacion> getAllPaginated(
    @ModelAttribute @Valid HabitacionFiltroDto filtro,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return habitacionService.findByFiltros(filtro, pageable);
    }

}
