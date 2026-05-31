package edu.utn.frsf.isi.dan.reservas_svc.repository;

import edu.utn.frsf.isi.dan.reservas_svc.model.EstadoReserva;
import edu.utn.frsf.isi.dan.reservas_svc.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReservaRepository extends MongoRepository<Reserva, String> {
	void deleteByHotelIdAndEstadoReserva(Integer hotelId, EstadoReserva estadoReserva);

	List<Reserva> findByHotelIdIn(List<Integer> hotelIds);
}
