package edu.utn.frsf.isi.dan.reservas_svc.repository;

import edu.utn.frsf.isi.dan.reservas_svc.model.Habitacion;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HabitacionRepository extends MongoRepository<Habitacion, String> {
    Page<Habitacion> findAll(Pageable pageable);
    /* Page<Habitacion> findByFiltros(
        Instant checkIn, 
        Instant checkOut, 
        Integer capacidad,
        Double precioMin, 
        Double precioMax, 
        List<String> amenities,
        Integer categoria, 
        Pageable pageable
    ); */
}
