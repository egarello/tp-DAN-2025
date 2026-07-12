package com.example.demo.security;

import java.util.Set;

/**
 * Una regla de la tabla método+ruta -> roles permitidos (Paso 1 del plan de login).
 * roles vacío = ruta pública, no requiere JWT. La lista de reglas se recorre en orden
 * y gana la primera que matchea (por eso las rutas más específicas van antes que los
 * comodines "/**").
 */
public record RouteRule(String method, String pattern, Set<String> roles) {
    public boolean isPublic() {
        return roles.isEmpty();
    }
}
