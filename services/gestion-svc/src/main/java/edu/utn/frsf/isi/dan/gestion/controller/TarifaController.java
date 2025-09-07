package edu.utn.frsf.isi.dan.gestion.controller;

import edu.utn.frsf.isi.dan.gestion.dto.TarifaRecord;
import edu.utn.frsf.isi.dan.gestion.model.Tarifa;
import edu.utn.frsf.isi.dan.gestion.service.TarifaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tarifas")
public class TarifaController {
    @Autowired
    private TarifaService tarifaService;

    @Operation(summary = "Crear tarifa", 
            description = "Crea una tarifa",
            responses = {
                @ApiResponse(responseCode = "200", description = "Tarifa creada exitosamente"),
                @ApiResponse(responseCode = "400", description = "Error en los datos de la solicitud"),
                @ApiResponse(responseCode = "404", description = "Habitación no encontrada")
            })
    @PostMapping
    public ResponseEntity<Tarifa> create(@RequestBody TarifaRecord tarifaRecord) {
        return ResponseEntity.ok(tarifaService.save(tarifaRecord));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarifa> getById(@PathVariable Integer id) {
        return tarifaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Tarifa> getAll() {
        return tarifaService.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarifa> update(@PathVariable Integer id, @RequestBody TarifaRecord tarifaRecord) {
        if (!tarifaService.findById(id).isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(tarifaService.save(tarifaRecord));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!tarifaService.findById(id).isPresent()) return ResponseEntity.notFound().build();
        tarifaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Crear tarifa promocional", 
               description = "Crea una tarifa promocional con fechas específicas y controla automáticamente la continuidad de tarifas",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Tarifa promocional creada exitosamente"),
                   @ApiResponse(responseCode = "400", description = "Error en los datos de la solicitud"),
                   @ApiResponse(responseCode = "404", description = "Habitación no encontrada")
               })
    @PostMapping("/promocional")
    //se devuelven las multiples tarifas afectadas por el proceso, la actual modificada, la promocional y la que sigue a la promocional
    public ResponseEntity<List<Tarifa>> crearTarifaPromocional(
        @RequestBody @Valid TarifaRecord tarifaPromocional,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
    
        List<Tarifa> tarifasCreadas = tarifaService.crearTarifaPromocional(tarifaPromocional, fechaInicio, fechaFin);
        return ResponseEntity.ok(tarifasCreadas);
    }


}
