package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Tarifa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Integer> {
    List<Tarifa> findByTipoHabitacion_Id(Integer idTipoHabitacion);
}
