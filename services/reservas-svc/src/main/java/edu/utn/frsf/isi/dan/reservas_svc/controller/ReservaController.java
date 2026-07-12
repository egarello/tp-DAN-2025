package edu.utn.frsf.isi.dan.reservas_svc.controller;

import edu.utn.frsf.isi.dan.reservas_svc.exception.AccessDeniedException;
import edu.utn.frsf.isi.dan.reservas_svc.model.Pago;
import edu.utn.frsf.isi.dan.reservas_svc.model.EstadoReserva;
import edu.utn.frsf.isi.dan.reservas_svc.model.Huesped;
import edu.utn.frsf.isi.dan.reservas_svc.model.Reserva;
import edu.utn.frsf.isi.dan.reservas_svc.model.Review;
import edu.utn.frsf.isi.dan.reservas_svc.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {
    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<Reserva> getAll(@RequestParam(required = false) List<Integer> hotelIds) {
        return reservaService.findByHotelIds(hotelIds);
    }

    // Debe declararse antes que GET /{id}: "mis-reservas" no debe interpretarse como un id.
    @GetMapping("/mis-reservas")
    public List<Reserva> getMisReservas(@RequestHeader("X-User-Id") String userId) {
        return reservaService.findByUsuarioId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getById(@PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        return reservaService.findById(id)
                .map(reserva -> {
                    verificarPropioOPropietario(reserva, userId, rol);
                    return ResponseEntity.ok(reserva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reserva create(@RequestBody Reserva reserva, @RequestHeader("X-User-Id") String userId) {
        // Se ignora cualquier idUsuario que venga en el body: un Huesped solo puede
        // crear reservas a su propio nombre, nunca a nombre de otro usuario.
        if (reserva.getHuesped() == null) {
            reserva.setHuesped(new Huesped());
        }
        reserva.getHuesped().setIdUsuario(userId);
        reserva.setEstadoReserva(EstadoReserva.RESERVADA);
        return reservaService.save(reserva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserva> update(@PathVariable String id, @RequestBody Reserva reserva,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        var existente = reservaService.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        verificarPropioOPropietario(existente.get(), userId, rol);
        reserva.set_id(id);
        return ResponseEntity.ok(reservaService.save(reserva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!reservaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        reservaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<Reserva> pagar(@PathVariable String id, @RequestBody Pago nuevoPago,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        verificarPropioOPropietario(reservaService.findById(id).orElseThrow(), userId, rol);
        reservaService.pagar(id, nuevoPago);
        return ResponseEntity.ok(reservaService.findById(id).get());
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Reserva> cancelar(@PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        verificarPropioOPropietario(reservaService.findById(id).orElseThrow(), userId, rol);
        reservaService.cancelar(id);
        return ResponseEntity.ok(reservaService.findById(id).get());
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<Reserva> finalizar(@PathVariable String id, @RequestBody Review hostReview) {
        Reserva reserva = reservaService.finalizar(id, hostReview);
        return ResponseEntity.ok(reserva);
    }

    /**
     * El gateway ya garantiza que quien llama es HUESPED o PROPIETARIO según la ruta;
     * acá se valida además que, si es HUESPED, la reserva sea la suya propia. Un
     * userId nulo (llamada interna sin pasar por el gateway) no se restringe.
     */
    private void verificarPropioOPropietario(Reserva reserva, String userId, String rol) {
        if (userId == null || "PROPIETARIO".equals(rol)) {
            return;
        }
        String idDueno = reserva.getHuesped() != null ? reserva.getHuesped().getIdUsuario() : null;
        if (!userId.equals(idDueno)) {
            throw new AccessDeniedException("No puede operar sobre una reserva de otro usuario");
        }
    }
}
