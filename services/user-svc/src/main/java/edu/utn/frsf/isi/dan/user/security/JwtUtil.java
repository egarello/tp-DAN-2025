package edu.utn.frsf.isi.dan.user.security;

import edu.utn.frsf.isi.dan.user.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Emisión de JWT en user-svc. La validación (verificación de firma/expiración) vive
 * únicamente en el gateway (common/dan-spring-gateway) — este servicio solo firma.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // 8 horas
    private static final long EXPIRATION_MS = 8L * 60 * 60 * 1000;

    public String generateToken(Usuario usuario, String rol) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .claim("email", usuario.getEmail())
                .claim("nombre", usuario.getNombre())
                .claim("rol", rol)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }
}
