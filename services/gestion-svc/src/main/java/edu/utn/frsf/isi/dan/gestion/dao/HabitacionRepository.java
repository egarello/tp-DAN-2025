package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    //este método permite traer los tipos de habitación siempre que busquemos una habitación. Se usa para el endpoint de tarifa.
    @Query("SELECT h FROM Habitacion h JOIN FETCH h.tipoHabitacion JOIN FETCH h.hotel WHERE h.id = :id")
    Optional<Habitacion> findByIdWithTipoAndHotel(@Param("id") Integer id);
}
