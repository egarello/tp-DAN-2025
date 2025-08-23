package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Habitacion;
import edu.utn.frsf.isi.dan.gestion.model.TipoHabitacion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoHabitacionRepository extends JpaRepository<TipoHabitacion, Integer> {
    @Query(
        "SELECT DISTINCT h FROM habitacion h "+
        "JOIN h.tipohabitacion t " +
        "JOIN t.tarifas f "+
        "WHERE (:cantidad IS NULL OR t.capacidad=:cantidad) "+
        "AND (:tipo IS NULL OR t.nombre = :tipo) " +
        "AND (:precioMin IS NULL OR f.precio >= :precioMin) " +
        "AND (:precioMax IS NULL OR f.precio <= :precioMax) " +
        "AND (f.fechaFin IS NULL OR f.fechaFin >= CURRENT_DATE) " +
        "AND f.fechaInicio <= CURRENT_DATE"
        )
    List<Habitacion> searchHabitaciones(@Param("cantidad") Integer cantHuespedes,@Param("tipo") TipoHabitacion tipoHabitacion, @Param("precioMin") Float precioMin,@Param("precioMax") Float precioMax);

}
