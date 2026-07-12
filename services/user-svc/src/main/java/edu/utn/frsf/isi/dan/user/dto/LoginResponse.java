package edu.utn.frsf.isi.dan.user.dto;

public record LoginResponse(
    String token,
    Integer id,
    String nombre,
    String email,
    String rol
) {}
