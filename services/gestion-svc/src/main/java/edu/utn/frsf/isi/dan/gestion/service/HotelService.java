package edu.utn.frsf.isi.dan.gestion.service;

import edu.utn.frsf.isi.dan.gestion.dao.HotelRepository;
import edu.utn.frsf.isi.dan.gestion.model.Hotel;
import edu.utn.frsf.isi.dan.shared.HotelDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Set;
import java.util.stream.Collectors;
import edu.utn.frsf.isi.dan.gestion.model.Amenity;
import edu.utn.frsf.isi.dan.gestion.model.AmenityHotel;

@Service
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    public Hotel save(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public void deleteById(Integer id) {
        hotelRepository.deleteById(id);
    }

    public Optional<Hotel> findById(Integer id) {
        return hotelRepository.findById(id);
    }

    public List<Hotel> findAll() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> addAmenities(Integer hotelId, List<Amenity> amenities) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);
        if (!optionalHotel.isPresent()) {
            return Optional.empty();
        }
        Hotel hotel = optionalHotel.get();
        if (hotel.getAmenities() == null) {
            hotel.setAmenities(new ArrayList<>());
        }
        Set<Amenity> existingAmenities = hotel.getAmenities().stream()
                .map(AmenityHotel::getAmenity)
                .collect(Collectors.toSet());
        for (Amenity amenity : amenities) {
            if (!existingAmenities.contains(amenity)) {
                AmenityHotel amenityHotel = AmenityHotel.builder()
                        .hotel(hotel)
                        .amenity(amenity)
                        .build();
                hotel.getAmenities().add(amenityHotel);
            }
        }
        Hotel saved = hotelRepository.save(hotel);
        return Optional.of(saved);
    }

    public Optional<Hotel> removeAmenity(Integer hotelId, Amenity amenity) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);
        if (!optionalHotel.isPresent()) {
            return Optional.empty();
        }
        Hotel hotel = optionalHotel.get();
        hotel.getAmenities().removeIf(amenityHotel -> amenityHotel.getAmenity().equals(amenity));
        return Optional.of(hotelRepository.save(hotel));
    }

    public List<Hotel> findBy(HotelDTO hotelFiltro) {
        return hotelRepository.findByFiltro(
            hotelFiltro.getNombre(),
            hotelFiltro.getDomicilio(),
            hotelFiltro.getLatitud(),
            hotelFiltro.getLongitud(),
            hotelFiltro.getTelefono(),
            hotelFiltro.getCorreoContacto(),
            hotelFiltro.getCategoria()
        );
    }
}
