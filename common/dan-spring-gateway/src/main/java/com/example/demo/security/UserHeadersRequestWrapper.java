package com.example.demo.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Envuelve el request para agregar/REEMPLAZAR los headers X-User-* con los datos ya
 * validados del JWT. Es importante que reemplace (no solo agregue): si un llamador
 * mandara sus propios headers X-User-Id/X-User-Role tratando de suplantar a otro
 * usuario, acá se pisan siempre con los valores derivados del token verificado.
 */
public class UserHeadersRequestWrapper extends HttpServletRequestWrapper {

    private final Map<String, String> overrides = new LinkedHashMap<>();

    public UserHeadersRequestWrapper(HttpServletRequest request, Map<String, String> overrides) {
        super(request);
        overrides.forEach((k, v) -> this.overrides.put(k.toLowerCase(), v));
    }

    @Override
    public String getHeader(String name) {
        String override = overrides.get(name.toLowerCase());
        return override != null ? override : super.getHeader(name);
    }

    @Override
    public Enumeration<String> getHeaders(String name) {
        String override = overrides.get(name.toLowerCase());
        if (override != null) {
            return Collections.enumeration(Collections.singletonList(override));
        }
        return super.getHeaders(name);
    }

    @Override
    public Enumeration<String> getHeaderNames() {
        java.util.Set<String> names = new java.util.LinkedHashSet<>(overrides.keySet());
        Enumeration<String> original = super.getHeaderNames();
        while (original.hasMoreElements()) {
            names.add(original.nextElement());
        }
        return Collections.enumeration(names);
    }
}
