package edu.utn.frsf.isi.dan.user.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utn.frsf.isi.dan.user.dto.BancoRecord;
import edu.utn.frsf.isi.dan.user.model.Banco;
import edu.utn.frsf.isi.dan.user.service.BancoService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Banco Controller", description = "Operaciones para la gestión de los bancos")
@RestController
@RequestMapping("/bancos")
public class BancoController {
    @Autowired
    private BancoService bancoService;
    
    @GetMapping
    public ResponseEntity<Page<Banco>> buscarBancos(Pageable pageable){
        Page<Banco> bancos = bancoService.buscarBancos(pageable);
        if (bancos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bancos);
    }
    @PostMapping
    public ResponseEntity<Banco> crearBanco(@RequestBody @Valid BancoRecord banco){
        return ResponseEntity.ok(bancoService.crearBanco(banco));
    }
}
