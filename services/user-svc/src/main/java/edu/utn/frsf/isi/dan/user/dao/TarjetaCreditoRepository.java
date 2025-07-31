package edu.utn.frsf.isi.dan.user.dao;

import edu.utn.frsf.isi.dan.user.model.TarjetaCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarjetaCreditoRepository extends JpaRepository<TarjetaCredito, Long> {
    TarjetaCredito findByNumero(String numeroCC);
    TarjetaCredito findByNumeroAndNombreTitularAndFechaVencimientoAndCvc(String numeroCC, String nombreTitular, String fechaVencimiento, String cvc);
}