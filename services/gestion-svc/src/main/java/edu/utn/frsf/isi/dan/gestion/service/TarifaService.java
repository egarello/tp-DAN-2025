package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.TarifaRepository;
import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
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
        programarActualizacionTarifa(tarifaPromocional);

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

}
