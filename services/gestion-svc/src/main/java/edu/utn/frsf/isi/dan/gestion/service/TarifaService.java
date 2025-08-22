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

    public Tarifa getTarifaByHabitacion(Habitacion habitacion) {
        List<Tarifa> listaTarifas = tarifaRepository.findByTipoHabitacion_Id(habitacion.getTipoHabitacion().getId());
        LocalDate fechaActual = LocalDate.now();
        
        // Buscar tarifa vigente (fecha actual dentro del rango)
        for (Tarifa tarifa : listaTarifas) {
            boolean inicioOk = !tarifa.getFechaInicio().isAfter(fechaActual);
            boolean finOk = tarifa.getFechaFin() == null || !tarifa.getFechaFin().isBefore(fechaActual);
            if (inicioOk && finOk) {
                System.out.println("La tarifa es: "+ tarifa);
                return tarifa;
            }
        }
        
        // Si no hay tarifa vigente, se busca la más próxima futura
        Tarifa tarifaProxima = null;
        LocalDate fechaProxima = null;
        
        for (Tarifa tarifa : listaTarifas) {
            if (tarifa.getFechaInicio().isAfter(fechaActual)) {
                if (tarifaProxima == null || tarifa.getFechaInicio().isBefore(fechaProxima)) {
                    tarifaProxima = tarifa;
                    fechaProxima = tarifa.getFechaInicio();
                }
            }
        }
        
        return tarifaProxima; // Retorna null si no hay tarifas futuras
    }
}
