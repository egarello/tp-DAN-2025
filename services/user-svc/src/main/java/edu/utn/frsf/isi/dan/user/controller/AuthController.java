package edu.utn.frsf.isi.dan.user.controller;

import edu.utn.frsf.isi.dan.user.dto.LoginRequest;
import edu.utn.frsf.isi.dan.user.dto.LoginResponse;
import edu.utn.frsf.isi.dan.user.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth Controller", description = "Login")
@RestController
@RequestMapping({"/auth", "/users/auth"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Login", description = "Autentica un usuario (Huesped o Propietario) por email y contraseña, devuelve un JWT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
