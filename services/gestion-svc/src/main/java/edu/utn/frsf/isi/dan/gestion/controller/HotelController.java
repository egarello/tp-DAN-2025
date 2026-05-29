package edu.utn.frsf.isi.dan.gestion.controller;

import edu.utn.frsf.isi.dan.shared.HotelDTO;
import edu.utn.frsf.isi.dan.gestion.model.Hotel;
import edu.utn.frsf.isi.dan.gestion.service.HotelService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import edu.utn.frsf.isi.dan.gestion.model.Amenity;

@RestController
@RequestMapping("/hoteles")
@Validated
public class HotelController {
    @Autowired
    private HotelService hotelService;

    @PostMapping
    public ResponseEntity<Hotel> create(@Valid @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.save(hotel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getById(@PathVariable Integer id) {
        return hotelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Hotel> getAll() {
        return hotelService.findAll();
    }

    @GetMapping("/amenities")
    public List<Amenity> getAvailableAmenities() {
        return hotelService.getAvailableAmenities();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> update(@PathVariable Integer id, @Valid @RequestBody Hotel hotel) {
        if (!hotelService.findById(id).isPresent()) return ResponseEntity.notFound().build();
        hotel.setId(id);
        return ResponseEntity.ok(hotelService.save(hotel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!hotelService.findById(id).isPresent()) return ResponseEntity.notFound().build();
        hotelService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cerrar")
    public ResponseEntity<Hotel> cerrarHotel(@PathVariable Integer id) {
        return hotelService.cerrarHotel(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/abrir")
    public ResponseEntity<Hotel> abrirHotel(@PathVariable Integer id) {
        return hotelService.abrirHotel(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/amenities/add")
    public ResponseEntity<Hotel> addAmenities(@PathVariable Integer id, @RequestBody List<Amenity> amenities) {
        return hotelService.addAmenities(id, amenities)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/amenities/remove")
    public ResponseEntity<Hotel> removeAmenity(@PathVariable Integer id, @RequestParam Amenity amenity) {
        if (!hotelService.findById(id).isPresent()) return ResponseEntity.notFound().build();
        return hotelService.removeAmenity(id, amenity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Hotel> search(
        @RequestParam(required = false) String nombre, 
        @RequestParam(required = false) String domicilio,
        @RequestParam(required = false) Double latitud,
        @RequestParam(required = false) Double longitud,
        @RequestParam(required = false) String telefono,
        @RequestParam(required = false) String correoContacto,
        @RequestParam(required = false) Integer categoria,
        @RequestParam(required = false) List<Amenity> amenities,
        @RequestParam(defaultValue = "nombre") String sortBy
        ) {
        HotelDTO hotelFiltro = HotelDTO.builder()
            .nombre(nombre)
            .domicilio(domicilio)
            .latitud(latitud)
            .longitud(longitud)
            .telefono(telefono)
            .correoContacto(correoContacto)
            .categoria(categoria)
            .build();
        return hotelService.findBy(hotelFiltro, amenities);
    }
}
