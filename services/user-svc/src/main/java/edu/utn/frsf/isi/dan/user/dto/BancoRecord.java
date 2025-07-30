package edu.utn.frsf.isi.dan.user.dto;

import edu.utn.frsf.isi.dan.user.model.Banco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BancoRecord(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    String nombre
) 
{
    public Banco toBanco(){
        Banco banco = new Banco();
        banco.setNombre(this.nombre);
        return banco;
    }

}