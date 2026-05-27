package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Amenity;
import edu.utn.frsf.isi.dan.gestion.model.AmenityHotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityHotelRepository extends JpaRepository<AmenityHotel, Long> {
    @Query("SELECT DISTINCT a.amenity FROM AmenityHotel a ORDER BY a.amenity")
    List<Amenity> findDistinctAmenities();
}
