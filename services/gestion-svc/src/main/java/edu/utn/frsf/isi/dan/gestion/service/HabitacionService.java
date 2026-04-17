package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.HabitacionRepository;
import edu.utn.frsf.isi.dan.gestion.dao.HotelRepository;
import edu.utn.frsf.isi.dan.gestion.model.Habitacion;
import edu.utn.frsf.isi.dan.gestion.model.Hotel;
import edu.utn.frsf.isi.dan.gestion.service.TarifaService;
import edu.utn.frsf.isi.dan.shared.HabitacionDTO;
import edu.utn.frsf.isi.dan.shared.HabitacionEvent;
import edu.utn.frsf.isi.dan.shared.HotelDTO;
import edu.utn.frsf.isi.dan.shared.TipoEvento;
import lombok.extern.log4j.Log4j2;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

//import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.List;
import java.util.stream.Collectors;
//import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Log4j2
public class HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private TarifaService tarifaService;
    
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange:habitacion.exchange}")
    private String exchange;
    @Value("${rabbitmq.routingkey:habitacion.key}")
    private String routingKey;

    public Habitacion save(Habitacion habitacion) {
        log.info("Habltaicon {} ", habitacion);
        boolean isNew = Objects.isNull(habitacion.getId());
        Habitacion newHabitacion = habitacionRepository.save(habitacion);
        enviarHabitacionJms(newHabitacion, isNew);
        return newHabitacion;
    }

    public void deleteById(Integer id) {
        enviarHabitacionJms(id);
        habitacionRepository.deleteById(id);
    }

    public Optional<Habitacion> findById(Integer id) {
        return habitacionRepository.findById(id);
    }
    
    public Optional<Habitacion> findByIdWithTipoAndHotel(Integer id) {
        return habitacionRepository.findByIdWithTipoAndHotel(id);
    }

    public List<Habitacion> findAll() {
        return habitacionRepository.findAll();
    }

    public void enviarHabitacionJms(Habitacion habitacion,boolean isNew) {

        // Traer el hotel completo de la BD para obtener todos sus datos (latitud, longitud, etc.)
        Hotel hotelCompleto = habitacion.getHotel() != null ? 
            hotelRepository.findById(habitacion.getHotel().getId()).orElse(habitacion.getHotel()) : null;

        // Extraer amenities del hotel (convertir enum a String)
        List<String> amenitiesList = hotelCompleto != null && hotelCompleto.getAmenities() != null ? 
            hotelCompleto.getAmenities().stream()
                .map(amenityHotel -> amenityHotel.getAmenity().name())
                .collect(Collectors.toList()) : null;

        HabitacionDTO dto = HabitacionDTO.builder()
                .habitacionId(habitacion.getId().longValue())
                .numero(habitacion.getNumero())
                .tipoHabitacionId(habitacion.getTipoHabitacion().getId())
                .tipoHabitacion(habitacion.getTipoHabitacion().getDescripcion())
                .capacidad(habitacion.getTipoHabitacion().getCapacidad())
                .precioNoche(tarifaService.getTarifaByHabitacion(habitacion)
                    .orElseThrow(() -> new RuntimeException("No existe tarifa vigente para la habitación con id: " + habitacion.getId()))
                    .getPrecioNoche())
                .amenities(amenitiesList)
                .hotel(mapToHotelDTO(hotelCompleto))
                .build();
        // Construir evento de habitación con tipo de operación (crear o actualizar)
        HabitacionEvent msgEvent = HabitacionEvent.builder()
                .tipoEvento(isNew? TipoEvento.CREAR : TipoEvento.ACTUALIZAR_DATOS)
                .habitacion(dto)
                .build();
                
        // Serializar evento a JSON y enviarlo a RabbitMQ
        try {
            String msgToSend = objectMapper.writeValueAsString(msgEvent);
            log.debug("[RabbitMQ] Enviando mensaje: {}", msgToSend);    
            rabbitTemplate.convertAndSend(exchange, routingKey, msgToSend);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void enviarHabitacionJms(Integer id) {  
        HabitacionDTO dto = HabitacionDTO.builder()
                .habitacionId(id.longValue()).build();      
        HabitacionEvent msgEvent = HabitacionEvent.builder()
                .tipoEvento(TipoEvento.ELIMINAR)
                .habitacion(dto)
                .build();
        try {
            String msgToSend = objectMapper.writeValueAsString(msgEvent);
            log.debug("[RabbitMQ] Enviando mensaje: {}", msgToSend);     
            rabbitTemplate.convertAndSend(exchange, routingKey, msgToSend);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Habitacion> searchHabitaciones(Integer cantHuespedes, Integer tipoHabitacionId, Double precioMin, Double precioMax) throws Exception{
        List<Habitacion> habitacionesEncontradas = habitacionRepository.findByFiltros(cantHuespedes,tipoHabitacionId, precioMin,precioMax);
        if(habitacionesEncontradas.isEmpty()){
            throw new Exception("No se ha encontrado ninguna habitación con estas características.");
        }
        return habitacionesEncontradas; 
    }

    private HotelDTO mapToHotelDTO(Hotel hotel) {
        if (hotel == null) {
            return null;
        }
        return HotelDTO.builder()
                .id(hotel.getId())
                .nombre(hotel.getNombre())
                .domicilio(hotel.getDomicilio())
                .latitud(hotel.getLatitud())
                .longitud(hotel.getLongitud())
                .categoria(hotel.getCategoria())
                .build();
    }
}
