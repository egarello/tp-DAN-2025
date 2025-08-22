package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.TarifaRepository;
import edu.utn.frsf.isi.dan.gestion.model.Habitacion;
import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TarifaService {
    @Autowired
    private TarifaRepository tarifaRepository;

    public Tarifa save(Tarifa tarifa) {
        return tarifaRepository.save(tarifa);
    }

    public void deleteById(Integer id) {
        tarifaRepository.deleteById(id);
    }

    public Optional<Tarifa> findById(Integer id) {
        return tarifaRepository.findById(id);
    }

    public List<Tarifa> findAll() {
        return tarifaRepository.findAll();
    }

    public Optional<Tarifa> getTarifaByHabitacion(Habitacion habitacion) {
        LocalDate fechaActual = LocalDate.now();
        return tarifaRepository.findByTipoHabitacion_Id(habitacion.getTipoHabitacion().getId())
            .stream()
            .filter(t -> !t.getFechaInicio().isAfter(fechaActual) &&
                     (t.getFechaFin() == null || !t.getFechaFin().isBefore(fechaActual)))
            .findFirst();
    }
}
