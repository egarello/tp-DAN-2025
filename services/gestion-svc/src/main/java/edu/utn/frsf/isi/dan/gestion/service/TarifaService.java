package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.TarifaRepository;
import edu.utn.frsf.isi.dan.gestion.model.Habitacion;
import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import edu.utn.frsf.isi.dan.gestion.model.TipoHabitacion;
import edu.utn.frsf.isi.dan.gestion.dto.TarifaRecord;
import edu.utn.frsf.isi.dan.shared.HabitacionEvent;
import edu.utn.frsf.isi.dan.shared.TarifaDTO;
import edu.utn.frsf.isi.dan.shared.TipoEvento;
import lombok.extern.log4j.Log4j2;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Duration; 
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import edu.utn.frsf.isi.dan.shared.TarifaDTO;
import edu.utn.frsf.isi.dan.shared.HabitacionEvent;
import edu.utn.frsf.isi.dan.shared.TipoEvento;
import lombok.extern.log4j.Log4j2;


@Service
@Log4j2
public class TarifaService {
    @Autowired
    private TarifaRepository tarifaRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange:dan.exchange}")
    private String exchange;
    
    @Value("${rabbitmq.exchange.delayed:dan.exchange.delayed}")
    private String exchangeDelayed;

    @Value("${rabbitmq.routingkey:habitacion.key}")
    private String routingKey;

    @Value("${rabbitmq.routingkey.delayed:dan.tarifa.actualizar.precio}")
    private String routingKeyDelayed;


    public Tarifa save(TarifaRecord tarifaRecord) {

        TipoHabitacion tipo = new TipoHabitacion();
        tipo.setId(tarifaRecord.idTipoHabitacion());
        List<Tarifa> existentes = tarifaRepository.findByTipoHabitacion(tipo);

        Tarifa tarifa = new Tarifa();
        tarifa.setTipoHabitacion(tipo);
        tarifa.setPrecioNoche(tarifaRecord.precioNoche());

        if(existentes.isEmpty()) {
            // Si no hay tarifas existentes, la nueva es la única y vigente
            tarifa.setFechaInicio(LocalDate.now());
            tarifa.setFechaFin(null);
            return tarifaRepository.save(tarifa);
        }

        if(tarifaRecord.fechaInicio() == "" && tarifaRecord.fechaFin() == "") {
            Tarifa anterior = existentes.stream()
                    .filter(t -> t.getFechaFin() == null || t.getFechaFin().isAfter(LocalDate.now()))
                    .max((t1, t2) -> {
                        LocalDate fecha1 = t1.getFechaFin();
                        LocalDate fecha2 = t2.getFechaFin();

                        // Si ambas son null, son iguales
                        if (fecha1 == null && fecha2 == null) return 0;

                        // null es mayor que cualquier fecha
                        if (fecha1 == null) return 1;
                        if (fecha2 == null) return -1;

                        // Comparación normal si ambas tienen fecha
                        return fecha1.compareTo(fecha2);
                    })
                    .orElse(null);
            anterior.setFechaFin(LocalDate.now().minusDays(1));
            tarifa.setFechaInicio(LocalDate.now());
        }

        return tarifaRepository.save(tarifa);
    }

    public void deleteById(Integer id) {

        Optional<Tarifa> tarifaOpt = tarifaRepository.findById(id);
        if (tarifaOpt.isPresent()) {
            Tarifa tarifa = tarifaOpt.get();
            LocalDate hoy = LocalDate.now();
            boolean esVigente = (tarifa.getFechaInicio().isBefore(hoy) || tarifa.getFechaInicio().isEqual(hoy)) &&
                                (tarifa.getFechaFin() == null || tarifa.getFechaFin().isAfter(hoy) || tarifa.getFechaFin().isEqual(hoy));
            if (esVigente) {
                // Buscar la tarifa anterior (la de fecha fin inmediatamente anterior a la actual)
                List<Tarifa> anteriores = tarifaRepository.findByTipoHabitacion(tarifa.getTipoHabitacion());
                Tarifa anterior = anteriores.stream()
                    .filter(t -> t.getFechaFin() != null && t.getFechaFin().isBefore(tarifa.getFechaInicio()))
                    .max((t1, t2) -> t1.getFechaFin().compareTo(t2.getFechaFin()))
                    .orElse(null);
                if (anterior != null) {
                    anterior.setFechaFin(null);
                    // No se actualiza la fecha inicio
                    tarifaRepository.save(anterior);
                }
            }
        }
        tarifaRepository.deleteById(id);
    }

    public Optional<Tarifa> findById(Integer id) {
        return tarifaRepository.findById(id);
    }

    public List<Tarifa> findAll() {
        return tarifaRepository.findAll();
    }

    public List<Tarifa> crearTarifaPromocional(TarifaRecord tarifaPromocional, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Tarifa> tarifasCreadas = new ArrayList<>();

        TipoHabitacion tipo = new TipoHabitacion();
        tipo.setId(tarifaPromocional.idTipoHabitacion());

        Tarifa tarifa = new Tarifa();
        tarifa.setTipoHabitacion(tipo);
        tarifa.setPrecioNoche(tarifaPromocional.precioNoche());

        // Buscar la tarifa activa actual para el tipo de habitación
        List<Tarifa> tarifas = tarifaRepository.findByTipoHabitacion(tipo);
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
        tarifa.setFechaInicio(fechaInicio);
        tarifa.setFechaFin(fechaFin);
        tarifasCreadas.add(tarifaRepository.save(tarifa));

        // Crear tarifa siguiente
        Tarifa tarifaSiguiente = new Tarifa();
        tarifaSiguiente.setTipoHabitacion(tarifaActiva.getTipoHabitacion());
        tarifaSiguiente.setFechaInicio(fechaFin.plusDays(1));
        tarifaSiguiente.setFechaFin(null);
        tarifaSiguiente.setPrecioNoche(tarifaActiva.getPrecioNoche());
        tarifaSiguiente.setTipoHabitacion(tarifaActiva.getTipoHabitacion());
        tarifasCreadas.add(tarifaRepository.save(tarifaSiguiente));

        // Actualizar servicio reservas
        programarActualizacionTarifa(tarifa);

        return tarifasCreadas;
    }

    private void programarActualizacionTarifa(Tarifa tarifa) {
        LocalDate fechaInicio = tarifa.getFechaInicio();
        LocalDateTime fechaEjecucion = fechaInicio.atStartOfDay();
        
        // Crear TarifaDTO
        TarifaDTO tarifaDTO = TarifaDTO.builder()
                .tipoHabitacionId(tarifa.getTipoHabitacion().getId())
                .nuevoPrecio(tarifa.getPrecioNoche())
                .build();

        // Crear HabitacionEvent con TarifaDTO
        HabitacionEvent msgEvent = HabitacionEvent.builder()
                .tipoEvento(TipoEvento.ACTUALIZAR_PRECIO)
                .tarifa(tarifaDTO)
                .build();

        try {
            String msgToSend = objectMapper.writeValueAsString(msgEvent);
            
            // Solo programar si la fecha es futura
            if (fechaEjecucion.isAfter(LocalDateTime.now())) {
                long delayMs = Duration.between(LocalDateTime.now(), fechaEjecucion).toMillis();
                
                log.debug("[RabbitMQ] Programando tarifa para: {} (delay: {}ms)", fechaEjecucion, delayMs);
                
                // ENVIAR A EXCHANGE DELAYED
                rabbitTemplate.convertAndSend(
                    exchangeDelayed,                    // dan.exchange.delayed
                    routingKeyDelayed,                  // routing key
                    msgToSend,                          // mensaje JSON
                    message -> {
                        message.getMessageProperties().setHeader("x-delay", delayMs);
                        return message;
                    }
                );
            } else {
                // Si la fecha es hoy o pasada, enviar inmediatamente
                log.debug("[RabbitMQ] Enviando actualización inmediata para tarifa tipo: {}", tarifa.getTipoHabitacion());
                
                rabbitTemplate.convertAndSend(
                    exchange,                           // dan.exchange
                    routingKey,                         // routing key
                    msgToSend                           // mensaje JSON
                );
            }
            
        } catch (Exception e) {
            log.error("Error enviando mensaje de tarifa: {}", e.getMessage());
            e.printStackTrace();
        }
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
