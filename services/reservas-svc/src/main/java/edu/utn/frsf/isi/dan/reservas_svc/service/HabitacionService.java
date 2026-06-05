package edu.utn.frsf.isi.dan.reservas_svc.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.geo.Circle;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionFiltroDto;
import edu.utn.frsf.isi.dan.reservas_svc.model.Habitacion;
import edu.utn.frsf.isi.dan.reservas_svc.model.Hotel;
import edu.utn.frsf.isi.dan.reservas_svc.repository.HabitacionRepository;
import edu.utn.frsf.isi.dan.shared.HabitacionDTO;
import edu.utn.frsf.isi.dan.shared.HabitacionEvent;
import edu.utn.frsf.isi.dan.shared.HotelDTO;
import edu.utn.frsf.isi.dan.shared.TarifaDTO;

@Service
public class HabitacionService {
    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Habitacion> findAll() {
        return habitacionRepository.findAll();
    }

    public Page<Habitacion> findByFiltros(
        HabitacionFiltroDto filtro,
        Pageable pageable
    ) {
        Criteria criteria = buildCriteria(filtro);

        if (filtro.tieneGeo()) {
            return buscarConGeo(filtro, criteria, pageable);
        }

        Query query = Query.query(criteria).with(pageable);
        List<Habitacion> resultados = mongoTemplate.find(query, Habitacion.class);
        long total = mongoTemplate.count(Query.query(criteria), Habitacion.class);

        return new PageImpl<>(resultados, pageable, total);
    }

    public Optional<Habitacion> findById(String id) {
        return habitacionRepository.findById(id);
    }

    public Habitacion save(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    public void deleteById(String id) {
        habitacionRepository.deleteById(id);
    }

    public void handleEvent(HabitacionEvent event) {
        switch (event.getTipoEvento()) {
            case CREAR:
                save(mapFromHabitacion(event.getHabitacion()));
                break;
            case ACTUALIZAR_DATOS:
                updateByHabitacionId(event.getHabitacion().getHabitacionId(),mapFromHabitacion(event.getHabitacion()));
                break;
            case ACTUALIZAR_PRECIO:
                // TODO implementar por el alumno
                // en este caso el atributo TarifaDTO tiene 
                // el ID de los tipos de habitaciones que van a tener un nuevo precio y el nuevo precio
                // event.getTarifa()
                actualizarPrecioPorTarifa(event.getTarifa());
                break;
            case ELIMINAR:
                deleteByHabitacionId(event.getHabitacion().getHabitacionId());
                break;
            default:
                throw new IllegalArgumentException("Tipo de evento desconocido: " + event.getTipoEvento());
        }
    }

    public Habitacion mapFromHabitacion(HabitacionDTO dto) {
        return Habitacion.builder()
                .habitacionId(dto.getHabitacionId())
                .numero(dto.getNumero())
                .precioNoche(dto.getPrecioNoche())
                .capacidad(dto.getCapacidad())
                .amenities(dto.getAmenities())
                .idTipoHabitacion(dto.getTipoHabitacionId())
                .tipoHabitacion(dto.getTipoHabitacion())
                .hotel(mapFromDto(dto.getHotel()))
                .build();
    }

    public Hotel mapFromDto(HotelDTO dto){
        if(dto == null) {
            return null;
        }
        return Hotel.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .domicilio(dto.getDomicilio())
                .categoria(dto.getCategoria())
                .ubicacion(dto.getLatitud() != null && dto.getLongitud() != null ? 
                    new GeoJsonPoint(dto.getLongitud(), dto.getLatitud()) : null)
                .cerrado(dto.getCerrado())
                .fechaCierre(dto.getFechaCierre() != null ? Instant.parse(dto.getFechaCierre()) : null)
                .build();
    }

    public Optional<Habitacion> findByHabitacionId(Long habitacionId) {
        Query query = new Query(Criteria.where("habitacionId").is(habitacionId));
        Habitacion habitacion = mongoTemplate.findOne(query, Habitacion.class);
        return Optional.ofNullable(habitacion);
    }

    public Habitacion updateByHabitacionId(Long habitacionId, Habitacion nuevaHabitacion) {
        Query query = new Query(Criteria.where("habitacionId").is(habitacionId));
        Update update = new Update()
                .set("precioNoche", nuevaHabitacion.getPrecioNoche())
                .set("capacidad", nuevaHabitacion.getCapacidad())
                .set("amenities", nuevaHabitacion.getAmenities());
        Habitacion actualizada = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                Habitacion.class
        );
        if (actualizada == null) {
            throw new IllegalArgumentException("No se encontró la habitación con habitacionId: " + habitacionId);
        }
        return actualizada;
    }

    public void deleteByHabitacionId(Long habitacionId) {
        Query query = new Query(Criteria.where("habitacionId").is(habitacionId));
        mongoTemplate.remove(query, Habitacion.class);
    }

    public void actualizarPrecioPorTarifa(TarifaDTO tarifaDTO) {
 
        // Buscar todas las habitaciones del tipo especificado
        Query query = new Query(Criteria.where("idTipoHabitacion").is(tarifaDTO.getTipoHabitacionId()));
        List<Habitacion> habitaciones = mongoTemplate.find(query, Habitacion.class);
                
        // Actualizar precio en cada habitación
        for (Habitacion habitacion : habitaciones) {
            habitacion.setPrecioNoche(tarifaDTO.getNuevoPrecio());
            mongoTemplate.save(habitacion);
        }
    }

    public void addReservaToHabitacion(Long habitacionId, Habitacion.ReservaSimple reservaSimple) {
        Query query = new Query(Criteria.where("habitacionId").is(habitacionId));
        Update update = new Update().push("reservas", reservaSimple);
        mongoTemplate.updateFirst(query, update, Habitacion.class);
    }

    public void upsertReservaEnHabitacion(Long habitacionId, Habitacion.ReservaSimple reservaSimple) {
        Habitacion habitacion = findByHabitacionId(habitacionId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la habitación con habitacionId: " + habitacionId));

        if (habitacion.getReservas() == null) {
            habitacion.setReservas(new ArrayList<>());
        }

        if (reservaSimple.get_id() != null) {
            habitacion.getReservas().removeIf(r -> reservaSimple.get_id().equals(r.get_id()));
        }

        habitacion.getReservas().add(reservaSimple);
        save(habitacion);
    }

    private Criteria buildCriteria(HabitacionFiltroDto filtro) {
        List<Criteria> lista = new ArrayList<>();

        // Disponibilidad: sin reservas solapadas
        lista.add(Criteria.where("reservas").not().elemMatch(
                Criteria.where("checkIn").lt(filtro.getCheckOut())
                        .and("checkOut").gt(filtro.getCheckIn())
        ));

        lista.add(Criteria.where("capacidad").gte(filtro.getCapacidad()));

        if (filtro.getPrecioMin() != null)
            lista.add(Criteria.where("precioNoche").gte(filtro.getPrecioMin()));

        if (filtro.getPrecioMax() != null)
            lista.add(Criteria.where("precioNoche").lte(filtro.getPrecioMax()));

        if (filtro.getCategoria() != null)
            lista.add(Criteria.where("hotel.categoria").is(filtro.getCategoria()));

        if (filtro.getAmenities() != null && !filtro.getAmenities().isEmpty())
            lista.add(Criteria.where("amenities").all(filtro.getAmenities()));

        return new Criteria().andOperator(lista.toArray(new Criteria[0]));
    }

    private Page<Habitacion> buscarConGeo(HabitacionFiltroDto filtro, Criteria criteria, Pageable pageable) {
        Point punto = new Point(filtro.getLongitud(), filtro.getLatitud());

        double maxDistanciaMetros = filtro.getMaxDistancia();
        String unidad = filtro.getUnidad() == null ? "" : filtro.getUnidad().trim().toLowerCase();
        if ("km".equals(unidad)) {
            maxDistanciaMetros = maxDistanciaMetros * 1000;
        }

        Distance distancia = new Distance(maxDistanciaMetros / 1000.0, Metrics.KILOMETERS);

        Criteria geoCriteria = new Criteria().andOperator(
            criteria,
            Criteria.where("hotel.ubicacion").withinSphere(new Circle(punto, distancia))
        );

        Query query = Query.query(geoCriteria).with(pageable);
        List<Habitacion> resultados = mongoTemplate.find(query, Habitacion.class);
        long total = mongoTemplate.count(Query.query(geoCriteria), Habitacion.class);

        return new PageImpl<>(resultados, pageable, total);
    }
}
