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
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import edu.utn.frsf.isi.dan.shared.TarifaDTO;
import edu.utn.frsf.isi.dan.shared.HabitacionEvent;
import edu.utn.frsf.isi.dan.shared.TipoEvento;
import lombok.extern.log4j.Log4j2;

import jakarta.annotation.PostConstruct;

@Service
@Log4j2
@EnableScheduling
public class TarifaService {
    @Autowired
    private TarifaRepository tarifaRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange:habitacion.exchange}")
    private String exchange;

    @Value("${rabbitmq.routingkey:habitacion.key}")
    private String routingKey;

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

        if((tarifaRecord.fechaInicio() == "" && tarifaRecord.fechaFin() == "") || (tarifaRecord.fechaInicio() == null && tarifaRecord.fechaFin() == null)) {
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
            tarifa.setFechaFin(null);
        }
        else{
            // TODO
            return tarifa;
        }

        enviarTarifaJms(tarifa);
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
        checkTarifaActiva(tarifa.getTipoHabitacion());

        return tarifasCreadas;
    }
    
    public Optional<Tarifa> getTarifaByHabitacion(Habitacion habitacion) {
        LocalDate fechaActual = LocalDate.now();
        return tarifaRepository.findByTipoHabitacion_Id(habitacion.getTipoHabitacion().getId())
            .stream()
            .filter(t -> !t.getFechaInicio().isAfter(fechaActual) &&
                     (t.getFechaFin() == null || !t.getFechaFin().isBefore(fechaActual)))
            .findFirst();
    }

    public void enviarTarifaJms(Tarifa tarifa){
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
            log.debug("[RabbitMQ] Enviando mensaje: {}", msgToSend);    
            rabbitTemplate.convertAndSend(exchange, routingKey, msgToSend);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /*
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
    */

    @Scheduled(cron ="0 0 12 * * ?") // Todos los dias a las 12:00:00
    private void checkTarifaActiva(){

        //buscar tarifa vigente en fecha actual y tarifa dia previo a la fecha actual
        List<Tarifa> tarifas = tarifaRepository.findAll();
        
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);
        
        //obtener tarifa vigente y tarifa dia previo por cada tipo habitacion
        Map<TipoHabitacion, Tarifa> tarifasVigentes = new HashMap<>();
        Map<TipoHabitacion, Tarifa> tarifasDiaPrevio = new HashMap<>();

        for(Tarifa t : tarifas){
            if((t.getFechaInicio().isEqual(hoy) || t.getFechaInicio().isBefore(hoy)) &&
               (t.getFechaFin() == null || t.getFechaFin().isAfter(hoy) || t.getFechaFin().isEqual(hoy))){
                tarifasVigentes.put(t.getTipoHabitacion(), t);
            }
            if((t.getFechaInicio().isEqual(ayer) || t.getFechaInicio().isBefore(ayer)) &&
               (t.getFechaFin() == null || t.getFechaFin().isAfter(ayer) || t.getFechaFin().isEqual(ayer))){
                tarifasDiaPrevio.put(t.getTipoHabitacion(), t);
            }
        }

        for(TipoHabitacion tipo : tarifasVigentes.keySet()){
            Tarifa tarifaVigente = tarifasVigentes.get(tipo);
            Tarifa tarifaDiaPrevio = tarifasDiaPrevio.get(tipo);
            if(tarifaDiaPrevio != null && tarifaVigente.getPrecioNoche() != tarifaDiaPrevio.getPrecioNoche()){
                enviarTarifaJms(tarifaVigente);
            }
        }
        
        return;
    }

    private void checkTarifaActiva(TipoHabitacion tipoHabitacion){

        //buscar tarifa vigente en fecha actual y tarifa dia previo a la fecha actual del TipoHabitacion indicado
        List<Tarifa> tarifas = tarifaRepository.findByTipoHabitacion(tipoHabitacion);
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);
        Tarifa tarifaVigente = tarifas.stream()
            .filter(t -> (t.getFechaInicio().isEqual(hoy) || t.getFechaInicio().isBefore(hoy)) &&
                        (t.getFechaFin() == null || t.getFechaFin().isAfter(hoy) || t.getFechaFin().isEqual(hoy)))
            .findFirst()
            .orElse(null);
        Tarifa tarifaDiaPrevio = tarifas.stream()
            .filter(t -> (t.getFechaInicio().isEqual(ayer) || t.getFechaInicio().isBefore(ayer)) &&
                        (t.getFechaFin() == null || t.getFechaFin().isAfter(ayer) || t.getFechaFin().isEqual(ayer)))
            .findFirst()
            .orElse(null);
            
        if(tarifaVigente == null){
            //TODO
        }
        if(tarifaVigente.getPrecioNoche() != tarifaDiaPrevio.getPrecioNoche()){
            enviarTarifaJms(tarifaVigente);
        }
        
        return;
    }

    //cada vez que se inicia el servicio, chequea si hay nuevas tarifas vigentes y las envia a reservas
    @PostConstruct
    public void onStartup() {
        checkTarifaActiva();
    }

}
