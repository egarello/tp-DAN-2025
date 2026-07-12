package com.example.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Único punto de autenticación/autorización del sistema. Se ejecuta ANTES que el
 * ruteo de Spring Cloud Gateway. Valida el JWT (Authorization: Bearer ...) contra la
 * tabla de reglas de abajo (idéntica a la tabla "endpoint -> rol" del Paso 1 del plan)
 * y, si es válido, reemplaza los headers X-User-* con los datos del token antes de
 * reenviar la petición al microservicio correspondiente. Los microservicios no
 * validan JWT: confían en estos headers porque solo el gateway puede llegar a ellos.
 */
@Component
public class JwtAuthFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    private final AntPathMatcher matcher = new AntPathMatcher();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Set<String> HUESPED = Set.of("HUESPED");
    private static final Set<String> PROPIETARIO = Set.of("PROPIETARIO");
    private static final Set<String> CUALQUIERA = Set.of("HUESPED", "PROPIETARIO");
    private static final Set<String> PUBLICO = Set.of();

    // Orden importa: gana la primera regla que matchea método + patrón.
    // Las rutas específicas van antes que sus comodines "/**" equivalentes.
    private static final List<RouteRule> RULES = List.of(
            // ── user-svc ──────────────────────────────────────────────
            new RouteRule("POST", "/users/huesped", PUBLICO),
            new RouteRule("POST", "/users/auth/login", PUBLICO),
            new RouteRule("GET", "/users/bancos/**", PUBLICO),
            new RouteRule("POST", "/users/propietario", PROPIETARIO),
            new RouteRule("POST", "/users/bancos/**", PROPIETARIO),
            new RouteRule("PUT", "/users/bancos/**", PROPIETARIO),
            new RouteRule("DELETE", "/users/bancos/**", PROPIETARIO),
            new RouteRule("POST", "/users/huesped/*/tarjeta", HUESPED),
            new RouteRule("DELETE", "/users/huesped/*/eliminar-tarjeta", HUESPED),
            new RouteRule("PUT", "/users/huesped/*/cambiar-tarjeta-principal", HUESPED),
            new RouteRule("GET", "/users/huesped/*", CUALQUIERA),
            new RouteRule("DELETE", "/users/huesped/eliminar/*", PROPIETARIO),
            new RouteRule("GET", "/users", PROPIETARIO),
            new RouteRule("GET", "/users/dni/*", PROPIETARIO),
            new RouteRule("GET", "/users/buscar-dni", PROPIETARIO),
            new RouteRule("GET", "/users/*", PROPIETARIO),

            // ── gestion-svc (rutas específicas antes que el comodín GET público) ──
            // El listado plano de hoteles es público (igual que /buscar, /{id} y /amenities):
            // lo usa el Huesped para poblar el selector de hotel al crear una reserva.
            new RouteRule("GET", "/gestion/hoteles", PUBLICO),
            new RouteRule("GET", "/gestion/hoteles/**", PUBLICO),
            new RouteRule("GET", "/gestion/habitaciones", PROPIETARIO),
            new RouteRule("GET", "/gestion/habitaciones/**", PUBLICO),
            new RouteRule("GET", "/gestion/tipos-habitacion/**", PUBLICO),
            new RouteRule("GET", "/gestion/tarifas/**", PUBLICO),
            new RouteRule("POST", "/gestion/**", PROPIETARIO),
            new RouteRule("PUT", "/gestion/**", PROPIETARIO),
            new RouteRule("DELETE", "/gestion/**", PROPIETARIO),

            // ── reservas-svc ──────────────────────────────────────────
            new RouteRule("GET", "/reservas/habitaciones", PUBLICO),
            new RouteRule("GET", "/reservas/habitaciones/**", PUBLICO),
            new RouteRule("POST", "/reservas/reservas", HUESPED),
            new RouteRule("GET", "/reservas/reservas/mis-reservas", HUESPED),
            new RouteRule("POST", "/reservas/reservas/*/pagar", HUESPED),
            new RouteRule("POST", "/reservas/reservas/*/cancelar", HUESPED),
            new RouteRule("POST", "/reservas/reservas/*/finalizar", PROPIETARIO),
            new RouteRule("PUT", "/reservas/reservas/*", HUESPED),
            new RouteRule("DELETE", "/reservas/reservas/*", PROPIETARIO),
            new RouteRule("GET", "/reservas/reservas/*", CUALQUIERA),
            new RouteRule("GET", "/reservas/reservas", PROPIETARIO)
    );

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // Deja pasar siempre el preflight de CORS; si no, el navegador nunca llega
        // a ver la respuesta real (CorsConfig responde el preflight, no este filtro).
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        RouteRule rule = findRule(request.getMethod(), request.getRequestURI());

        // Sin regla definida = no es una ruta de negocio conocida (ej. /actuator/**
        // del propio gateway); se deja pasar sin exigir JWT.
        if (rule == null || rule.isPublic()) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Falta el token de autenticación", request);
            return;
        }

        Claims claims;
        try {
            claims = jwtUtil.parseAndValidate(authHeader.substring(7));
        } catch (JwtException | IllegalArgumentException e) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado", request);
            return;
        }

        String rol = claims.get("rol", String.class);
        if (rol == null || !rule.roles().contains(rol)) {
            writeError(response, HttpServletResponse.SC_FORBIDDEN, "No tiene permisos para acceder a este recurso", request);
            return;
        }

        HttpServletRequest wrapped = new UserHeadersRequestWrapper(request, Map.of(
                "X-User-Id", claims.getSubject(),
                "X-User-Email", String.valueOf(claims.get("email", String.class)),
                "X-User-Nombre", String.valueOf(claims.get("nombre", String.class)),
                "X-User-Role", rol
        ));

        chain.doFilter(wrapped, response);
    }

    private RouteRule findRule(String method, String path) {
        for (RouteRule rule : RULES) {
            if (rule.method().equalsIgnoreCase(method) && matcher.match(rule.pattern(), path)) {
                return rule;
            }
        }
        return null;
    }

    private void writeError(HttpServletResponse response, int status, String message, HttpServletRequest request)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> body = Map.of(
                "message", message,
                "path", request.getRequestURI(),
                "timestamp", Instant.now().toString(),
                "status", status
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
