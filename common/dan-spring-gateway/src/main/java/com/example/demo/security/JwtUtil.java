package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Único punto de verificación de JWT del sistema. Los microservicios downstream
 * (user-svc, gestion-svc, reservas-svc) no validan tokens: confían en los headers
 * X-User-* que este gateway agrega después de validar la firma y expiración acá.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    /**
     * Lanza io.jsonwebtoken.JwtException (o una subclase, ej. ExpiredJwtException,
     * SignatureException) si el token es inválido, está expirado o fue alterado.
     */
    public Claims parseAndValidate(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
