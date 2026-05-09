package edu.utn.frsf.isi.dan.user.controller;

import edu.utn.frsf.isi.dan.user.dto.HuespedRecord;
import edu.utn.frsf.isi.dan.user.dto.PropietarioRecord;
import edu.utn.frsf.isi.dan.user.dto.TarjetaCreditoRecord;
import edu.utn.frsf.isi.dan.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utn.frsf.isi.dan.user.model.TarjetaCredito;
import edu.utn.frsf.isi.dan.user.model.Usuario;
import edu.utn.frsf.isi.dan.user.model.Huesped;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "User Controller", description = "Operaciones para la gestión de usuarios")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Crear usuario huesped", 
                description = "Crea un nuevo usuario de tipo huesped",
                responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Usuario huesped creado exitosamente"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Error en la solicitud"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")}
    )
    @PostMapping("/huesped")
    public ResponseEntity<Huesped> crearUsuarioHuesped(@RequestBody HuespedRecord huespedRecord) {
        Huesped huesped = userService.crearUsuarioHuesped(huespedRecord);
        return new ResponseEntity<>(huesped, HttpStatus.CREATED);
    }

    @Operation(summary = "Crear usuario propietario", description = "Crea un nuevo usuario de tipo propietario")
    @PostMapping("/propietario")
    public ResponseEntity<Void> crearUsuarioPropietario(@RequestBody @Valid PropietarioRecord propietarioRecord) {
        userService.crearUsuarioPropietario(propietarioRecord);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // ETAPA 01, TARJETA DE CRÉDITO
    @Operation(summary = "Agregar tarjeta de crédito a un huesped", description = "Asocia una tarjeta de crédito a un usuario de tipo huesped")
    @PostMapping("/huesped/{dni}/tarjeta")
    public ResponseEntity<Void> agregarTarjetaHuesped(@PathVariable String dni, @RequestBody @Valid TarjetaCreditoRecord tarjetaCreditoRecord) {
        userService.agregarTarjetaHuesped(dni, tarjetaCreditoRecord);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Eliminar tarjeta de crédito", description = "Elimina una tarjeta de crédito de un usuario huesped")
    @DeleteMapping("/huesped/{dni}/eliminar-tarjeta")
    public ResponseEntity<Void> eliminarTarjetaHuesped(@PathVariable String dni, @RequestBody @Valid TarjetaCreditoRecord tarjetaCreditoRecord) {
        userService.eliminarTarjetaHuesped(dni, tarjetaCreditoRecord);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Cambiar la tarjeta de crédito principal de un huesped", description = "Actualiza la tarjeta de crédito principal de un usuario de tipo huesped")
    @PutMapping("/huesped/{dni}/cambiar-tarjeta-principal")
    public ResponseEntity<Void> cambiarTarjetaPrincipalHuesped(@PathVariable String dni, @RequestBody @Valid TarjetaCreditoRecord tarjetaCreditoRecord) {
        userService.cambiarTarjetaPrincipalHuesped(dni, tarjetaCreditoRecord);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    // FIN ETAPA 01, TARJETA DE CRÉDITO

    @DeleteMapping("/huesped/eliminar/{dni}")
    public ResponseEntity<Void> eliminarUsuarioHuesped(@RequestParam String dni) {
        userService.eliminarPorDni(dni);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public Page<Usuario> buscarUsuariosPorNombre(@RequestParam(required = false) String nombre, Pageable pageable) {
        if (nombre == null || nombre.isEmpty()) {
            return userService.buscarPorNombre("", pageable);
        }
        return userService.buscarPorNombre(nombre, pageable);
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Usuario> buscarUsuarioPorDni(@PathVariable String dni) {
        Usuario usuario = userService.buscarPorDniExacto(dni);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/buscar-dni")
    public Page<Usuario> buscarUsuariosPorDni(@RequestParam String dni, Pageable pageable) {
        return userService.buscarPorDni(dni, pageable);
    }

    @GetMapping("/huesped/{id}")
    public ResponseEntity<Huesped> buscarHuespedPorId(@PathVariable Integer id) {
        Huesped huesped = userService.buscarHuespedPorId(id);
        if (huesped == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(huesped);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Integer id) {
        Usuario usuario = userService.buscarPorId(id);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(usuario);
    }
}