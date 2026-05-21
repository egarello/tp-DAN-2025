package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.TarifaRepository;
import edu.utn.frsf.isi.dan.gestion.dao.TipoHabitacionRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Log4j2
public class TarifaService {
    private static final LocalDate FECHA_FIN_ABIERTA = LocalDate.of(9999, 12, 31);

    @Autowired
    private TarifaRepository tarifaRepository;

    @Autowired
    private TipoHabitacionRepository tipoHabitacionRepository;

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

        // Recuperar TipoHabitacion de la BD en lugar de crear una instancia transient
        TipoHabitacion tipo = tipoHabitacionRepository.findById(tarifaRecord.idTipoHabitacion())
                .orElseThrow(() -> new IllegalArgumentException("TipoHabitacion no encontrado con id: " + tarifaRecord.idTipoHabitacion()));
        
        List<Tarifa> existentes = tarifaRepository.findByTipoHabitacion(tipo);
        //log.info("Tarifas existentes para tipo ID {}: {} elementos (isEmpty: {})", 
        //        tipo.getId(), existentes.size(), existentes.isEmpty());

        Tarifa tarifa = new Tarifa();
        tarifa.setTipoHabitacion(tipo);
        tarifa.setPrecioNoche(tarifaRecord.precioNoche());

        boolean hasFechaInicio = tarifaRecord.fechaInicio() != null && !tarifaRecord.fechaInicio().isBlank();
        boolean hasFechaFin = tarifaRecord.fechaFin() != null && !tarifaRecord.fechaFin().isBlank();


        if(existentes.isEmpty()) {
            // Si no hay tarifas previas, usar las fechas del body cuando se envían.
            if (hasFechaInicio && hasFechaFin) {
                tarifa.setFechaInicio(LocalDate.parse(tarifaRecord.fechaInicio()));
                tarifa.setFechaFin(LocalDate.parse(tarifaRecord.fechaFin()));
            } else if (!hasFechaInicio && !hasFechaFin) {
                tarifa.setFechaInicio(LocalDate.now());
                tarifa.setFechaFin(FECHA_FIN_ABIERTA);
            } else {
                throw new IllegalArgumentException("Debe enviar ambas fechas (fechaInicio y fechaFin) o ninguna");
            }
            return tarifaRepository.save(tarifa);
        }

        if(!hasFechaInicio && !hasFechaFin) {
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
            if (anterior != null) {
                anterior.setFechaFin(LocalDate.now().minusDays(1));
                tarifaRepository.save(anterior);
            }
            tarifa.setFechaInicio(LocalDate.now());
            tarifa.setFechaFin(FECHA_FIN_ABIERTA);
        } else if(hasFechaInicio && hasFechaFin) {
            // Si se proporcionan fechas específicas, setearlas en la tarifa
            tarifa.setFechaInicio(LocalDate.parse(tarifaRecord.fechaInicio()));
            tarifa.setFechaFin(LocalDate.parse(tarifaRecord.fechaFin()));
        } else {
            throw new IllegalArgumentException("Debe enviar ambas fechas (fechaInicio y fechaFin) o ninguna");
        }

        return tarifaRepository.save(tarifa);
    }

    public Tarifa update(Integer id, TarifaRecord tarifaRecord) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tarifa no encontrada con id: " + id));

        if (tarifaRecord.idTipoHabitacion() != null) {
            TipoHabitacion tipo = tipoHabitacionRepository.findById(tarifaRecord.idTipoHabitacion())
                    .orElseThrow(() -> new IllegalArgumentException("TipoHabitacion no encontrado con id: " + tarifaRecord.idTipoHabitacion()));
            tarifa.setTipoHabitacion(tipo);
        }

        tarifa.setPrecioNoche(tarifaRecord.precioNoche());

        if (tarifaRecord.fechaInicio() != null && !tarifaRecord.fechaInicio().isBlank()) {
            tarifa.setFechaInicio(LocalDate.parse(tarifaRecord.fechaInicio()));
        }

        if (tarifaRecord.fechaFin() != null && !tarifaRecord.fechaFin().isBlank()) {
            tarifa.setFechaFin(LocalDate.parse(tarifaRecord.fechaFin()));
        }

        Tarifa tarifaActualizada = tarifaRepository.save(tarifa);
        programarActualizacionTarifa(tarifaActualizada);
        return tarifaActualizada;
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

        // Recuperar TipoHabitacion de la BD en lugar de crear una instancia transient
        TipoHabitacion tipo = tipoHabitacionRepository.findById(tarifaPromocional.idTipoHabitacion())
                .orElseThrow(() -> new IllegalArgumentException("TipoHabitacion no encontrado con id: " + tarifaPromocional.idTipoHabitacion()));

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
