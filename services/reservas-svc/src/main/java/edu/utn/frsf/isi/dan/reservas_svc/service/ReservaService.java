package edu.utn.frsf.isi.dan.reservas_svc.service;

import edu.utn.frsf.isi.dan.reservas_svc.client.GestionServiceClient;
import edu.utn.frsf.isi.dan.reservas_svc.client.UserServiceClient;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HotelDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.UserDto;
import edu.utn.frsf.isi.dan.reservas_svc.model.EstadoReserva;
import edu.utn.frsf.isi.dan.reservas_svc.model.Habitacion;
import edu.utn.frsf.isi.dan.reservas_svc.model.Pago;
import edu.utn.frsf.isi.dan.reservas_svc.model.Reserva;
import edu.utn.frsf.isi.dan.reservas_svc.repository.ReservaRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private GestionServiceClient gestionServiceClient;
    
    @Autowired
    private HabitacionService habitacionService;

    @Autowired
    private PagoService pagoService;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> findById(String id) {
        return reservaRepository.findById(id);
    }

    public Reserva save(Reserva reserva) {
        // Validar reserva antes de guardar
        validateReservation(reserva);

        // Asignar precio noche segun el precio de la habitacion
        Habitacion habitacionReserva = habitacionService.findByHabitacionId(Long.parseLong(reserva.getIdHabitacion()))
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada con ID: " + reserva.getIdHabitacion()));
        reserva.setPrecioNoche(habitacionReserva.getPrecioNoche());

        // Calcular precio total de la reserva basado en el precio de la habitación y la duración de la estadía
        long noches = ChronoUnit.DAYS.between(reserva.getCheckIn(), reserva.getCheckOut());
        reserva.setPrecioTotal(noches * reserva.getPrecioNoche());

        // Establecer estado inicial de la reserva
        // Depende del pago, si tiene pago adjunto entonces se tiene ver si pasa a estado CONFIRMADA o a ADEUDADA
        // Por defecto se setea como RESERVADA si no posee ningun pago
        if (reserva.getPago() != null && !reserva.getPago().isEmpty()) {
            pagoService.validarPago(reserva.getPago().get(0));
            this.validarEstadoReserva(reserva, reserva.getPago().get(0));
        } else {
            reserva.setEstadoReserva(EstadoReserva.RESERVADA);
        }
        
        // Asignar reserva a la habitacion (en MongoDB) para facilitar la consulta de disponibilidad
        Habitacion.ReservaSimple reservaSimple = Habitacion.ReservaSimple.builder()
                ._id(reserva.get_id())
                .checkIn(reserva.getCheckIn())
                .checkOut(reserva.getCheckOut())
                .precioTotal(reserva.getPrecioTotal())
                .estadoReserva(reserva.getEstadoReserva())
                .build();
                
        habitacionService.addReservaToHabitacion(Long.parseLong(reserva.getIdHabitacion()), reservaSimple);

        return reservaRepository.save(reserva);
    }
    
    public Reserva pagar(String idReserva, Pago nuevoPago) {
        // validar que exista la reserva
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));
        
        // validar estado de la reserva (solo se puede pagar si esta en CONFIRMADA O ADEUDADA)
        if (!reserva.getEstadoReserva().puedeTransicionarA(EstadoReserva.ADEUDADA) || !reserva.getEstadoReserva().puedeTransicionarA(EstadoReserva.CONFIRMADA)) {
            throw new RuntimeException("No se puede pagar la reserva en su estado actual");
        }

        // validar pago
        try {
            pagoService.validarPago(nuevoPago);
        } catch (Exception e) {
            throw new RuntimeException("Pago inválido: " + e.getMessage());
        }

        // Agregar el nuevo pago a la reserva
        nuevoPago.setTransactionId(UUID.randomUUID().toString());
        reserva.getPago().add(nuevoPago);

        // Actualizar el estado de la reserva segun el monto total pagado vs precio total
        this.validarEstadoReserva(reserva, nuevoPago);

        return reservaRepository.save(reserva);
    }

    private void validateReservation(Reserva reserva) {
        // Validate user exists using idUsuario from Huesped
        if (reserva.getHuesped() != null && reserva.getHuesped().getIdUsuario() != null) {
            try {
                Integer userId = Integer.parseInt(reserva.getHuesped().getIdUsuario());
                UserDto user = userServiceClient.getHuesped(userId);
                if (user == null) {
                    throw new RuntimeException("Huésped no encontrado con ID: " + reserva.getHuesped().getIdUsuario());
                }
            } catch (NumberFormatException e) {
                throw new RuntimeException("ID de huésped inválido: " + reserva.getHuesped().getIdUsuario());
            } catch (Exception e) {
                throw new RuntimeException("Error validando huésped: " + e.getMessage());
            }
        }
        
        // Validate hotel exists
        if (reserva.getHotelId() == null) {
            throw new RuntimeException("ID de hotel no puede ser nulo");
        }
        try {
            HotelDto hotel = gestionServiceClient.getHotel(reserva.getHotelId());
            if (hotel == null) {
                throw new RuntimeException("Hotel no encontrado con ID: " + reserva.getHotelId());
            }
            if (Boolean.TRUE.equals(hotel.getCerrado())) {
                throw new RuntimeException("Hotel cerrado: no se pueden crear reservas");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error validando hotel: " + e.getMessage());
        }
        
        // Validate habitacion exists and belongs to hotel
        if (reserva.getIdHabitacion() == null) {
            throw new RuntimeException("ID de habitación no puede ser nulo");
        }
        try {
            HabitacionDto habitacion = gestionServiceClient.getHabitacion(Integer.parseInt(reserva.getIdHabitacion()));
            if (habitacion == null) {
                throw new RuntimeException("Habitación no encontrada con ID: " + reserva.getIdHabitacion());
            }
            
            // Verify habitacion belongs to the specified hotel
            if (habitacion.getHotel() == null || !habitacion.getHotel().getId().equals(reserva.getHotelId())) {
                throw new RuntimeException("Habitación con ID " + reserva.getIdHabitacion() + 
                    " no pertenece al hotel con ID " + reserva.getHotelId());
            }
            
            if (!reserva.getCheckIn().isBefore(reserva.getCheckOut())) {
                throw new IllegalArgumentException("CheckIn debe ser anterior a CheckOut");
            }
            // Check habitacion availability based on existing reservations
            if (!isHabitacionDisponible(habitacion.getHabitacionId(), reserva)) {
                throw new RuntimeException("Habitación no disponible para reserva: " + reserva.getIdHabitacion());
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("ID de habitación inválido: " + reserva.getIdHabitacion());
        } catch (Exception e) {
            throw new RuntimeException("Error validando habitación: " + e.getMessage());
        }
    }

    public void deleteById(String id) {
        reservaRepository.deleteById(id);
    }

    public void createClosedReservations(Integer hotelId, List<Integer> habitacionIds) {
        if (habitacionIds == null || habitacionIds.isEmpty()) {
            return;
        }

        Instant now = Instant.now();
        List<Reserva> reservas = habitacionIds.stream()
            .map(idHabitacion -> Reserva.builder()
                .idHabitacion(String.valueOf(idHabitacion))
                .hotelId(hotelId)
                .createdAt(now)
                .checkIn(now)
                .checkOut(null)
                .status("CERRADO")
                .estadoReserva(EstadoReserva.CERRADO)
                .build())
            .collect(Collectors.toList());

        reservaRepository.saveAll(reservas);
    }

    public void deleteClosedReservations(Integer hotelId) {
        reservaRepository.deleteByHotelIdAndEstadoReserva(hotelId, EstadoReserva.CERRADO);
    }

    private boolean isHabitacionDisponible(Long habitacionId, Reserva nuevaReserva) {
        // Get habitacion from local service (MongoDB)
        Optional<Habitacion> habitacionOpt = habitacionService.findByHabitacionId(habitacionId);
        
        if (habitacionOpt.isEmpty()) {
            throw new RuntimeException("Habitación no encontrada con ID: " + habitacionId);
            // o al menos loggear un warning
        }
        
        Habitacion habitacion = habitacionOpt.get();
        
        // Get existing reservations from the habitacion entity
        if (habitacion.getReservas() == null || habitacion.getReservas().isEmpty()) {
            return true;
        }
        
        // Check if any existing reservation overlaps with the new one
        for (Habitacion.ReservaSimple reservaExistente : habitacion.getReservas()) {
            if (reservaExistente.get_id().equals(nuevaReserva.get_id())) {
                continue;
            }

            // Only consider active reservations (not cancelled, not finished, not owing)
            if (reservaExistente.getEstadoReserva() == null || 
                !isEstadoActivo(reservaExistente.getEstadoReserva())) {
                continue;
            }

            if (reservaExistente.getCheckIn() == null || reservaExistente.getCheckOut() == null) {
                continue;
            }
            if (nuevaReserva.getCheckIn() == null || nuevaReserva.getCheckOut() == null) {
                throw new IllegalArgumentException("Las fechas de la nueva reserva no pueden ser null");
            }
            
            // Check for date overlap: checkIn1 < checkOut2 AND checkOut1 > checkIn2
            if (nuevaReserva.getCheckIn().isBefore(reservaExistente.getCheckOut()) && 
                nuevaReserva.getCheckOut().isAfter(reservaExistente.getCheckIn())) {
                return false; // Overlap found, not available
            }
        }
        
        return true; // No overlaps found, available
    }

    private boolean isEstadoActivo(EstadoReserva estado) {
        // Consider as active: CONFIRMADA, RESERVADA, BLOQUEADA
        // Not active: CANCELADA, FINALIZADA, ADEUDADA
        return estado == EstadoReserva.CONFIRMADA || 
               estado == EstadoReserva.RESERVADA || 
               estado == EstadoReserva.BLOQUEADA ||
               estado == EstadoReserva.CERRADO;
    }

    private void validarEstadoReserva(Reserva reserva, Pago pago) {
        double montoTotalPagado = reserva.getPago().stream()
                .mapToDouble(p -> p.getAmount().getPrecio())
                .sum();
        if (montoTotalPagado >= reserva.getPrecioTotal()) {
            reserva.setEstadoReserva(EstadoReserva.ADEUDADA);
        } else {
            reserva.setEstadoReserva(EstadoReserva.CONFIRMADA);
        }
    }

}