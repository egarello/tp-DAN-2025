package edu.utn.frsf.isi.dan.gestion.dao;

import edu.utn.frsf.isi.dan.gestion.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN h.amenities a " +
           "WHERE (:nombre IS NULL OR h.nombre LIKE %:nombre%) " +
           "AND (:domicilio IS NULL OR h.domicilio LIKE %:domicilio%) " +
           "AND (:latitud IS NULL OR h.latitud = :latitud) " +
           "AND (:longitud IS NULL OR h.longitud = :longitud) " +
           "AND (:telefono IS NULL OR h.telefono LIKE %:telefono%) " +
           "AND (:correoContacto IS NULL OR h.correoContacto LIKE %:correoContacto%) " +
           "AND (:categoria IS NULL OR h.categoria = :categoria)")
    List<Hotel> findByFiltro(
        @Param("nombre") String nombre,
        @Param("domicilio") String domicilio,
        @Param("latitud") Double latitud,
        @Param("longitud") Double longitud,
        @Param("telefono") String telefono,
        @Param("correoContacto") String correoContacto,
        @Param("categoria") Integer categoria
    );
}
