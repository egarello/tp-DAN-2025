package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.TarifaRepository;
import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

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

    public List<Tarifa> crearTarifaPromocional(Tarifa tarifaPromocional, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Tarifa> tarifasCreadas = new ArrayList<>();

        // Buscar la tarifa activa actual para el tipo de habitación
        List<Tarifa> tarifas = tarifaRepository.findByTipoHabitacion(tarifaPromocional.getTipoHabitacion());
        LocalDate hoy = LocalDate.now();
        Tarifa tarifaActiva = tarifas.stream()
            .filter(t -> (t.getFechaInicio().isEqual(hoy) || t.getFechaInicio().isBefore(hoy)) &&
                        (t.getFechaFin() == null || t.getFechaFin().isAfter(hoy) || t.getFechaFin().isEqual(hoy)))
            .findFirst()
            .orElse(null);

        // Actualizar fecha fin tarifa activa actual
        if (tarifaActiva != null) {
            tarifaActiva.setFechaFin(fechaInicio.minusDays(1));
            tarifasCreadas.add(tarifaRepository.save(tarifaActiva));
        }

        // Crear tarifa promocional
        tarifaPromocional.setFechaInicio(fechaInicio);
        tarifaPromocional.setFechaFin(fechaFin);
        tarifasCreadas.add(tarifaRepository.save(tarifaPromocional));

        // Crear tarifa siguiente
        Tarifa tarifaSiguiente = new Tarifa();
        tarifaSiguiente.setTipoHabitacion(tarifaActiva.getTipoHabitacion());
        tarifaSiguiente.setFechaInicio(fechaFin.plusDays(1));
        tarifaSiguiente.setFechaFin(null);
        tarifaSiguiente.setPrecioNoche(tarifaActiva.getPrecioNoche());
        tarifaSiguiente.setTipoHabitacion(tarifaActiva.getTipoHabitacion());
        tarifasCreadas.add(tarifaRepository.save(tarifaSiguiente));

        // Actualizar servicio reservas

        return tarifasCreadas;
    }


}
