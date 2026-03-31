package edu.utn.frsf.isi.dan.reservas_svc.service;

import edu.utn.frsf.isi.dan.reservas_svc.client.GestionServiceClient;
import edu.utn.frsf.isi.dan.reservas_svc.client.UserServiceClient;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HotelDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.UserDto;
import edu.utn.frsf.isi.dan.reservas_svc.model.EstadoReserva;
import edu.utn.frsf.isi.dan.reservas_svc.model.Habitacion;
import edu.utn.frsf.isi.dan.reservas_svc.model.Reserva;
import edu.utn.frsf.isi.dan.reservas_svc.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> findById(String id) {
        return reservaRepository.findById(id);
    }

    public Reserva save(Reserva reserva) {
        // Validate reservation before saving
        validateReservation(reserva);
        return reservaRepository.save(reserva);
    }
    
    private void validateReservation(Reserva reserva) {
        // Validate user exists using idUsuario from Huesped
        if (reserva.getHuesped() != null && reserva.getHuesped().getIdUsuario() != null) {
            try {
                Long userId = Long.parseLong(reserva.getHuesped().getIdUsuario());
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
        } catch (Exception e) {
            throw new RuntimeException("Error validando hotel: " + e.getMessage());
        }
        
        // Validate habitacion exists and belongs to hotel
        if (reserva.getIdHabitacion() == null) {
            throw new RuntimeException("ID de habitación no puede ser nulo");
        }
        try {
            HabitacionDto habitacion = gestionServiceClient.getHabitacion(Long.parseLong(reserva.getIdHabitacion()));
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
               estado == EstadoReserva.BLOQUEADA;
    }
}