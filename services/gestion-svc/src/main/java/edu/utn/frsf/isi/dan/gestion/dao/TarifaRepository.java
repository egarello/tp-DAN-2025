package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import edu.utn.frsf.isi.dan.gestion.model.TipoHabitacion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Integer> {
    List<Tarifa> findByTipoHabitacion(TipoHabitacion tipoHabitacion);
    List<Tarifa> findByTipoHabitacion_Id(Integer idTipoHabitacion);
}
