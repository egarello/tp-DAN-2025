package edu.utn.frsf.isi.dan.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    protected String nombre;
    protected String email;
    protected String telefono;
    protected String dni;

    // Hash BCrypt. @JsonIgnore es crítico: los controllers serializan las entidades directo, sin DTO de salida.
    @JsonIgnore
    protected String password;

    // Expone el discriminador "tipo" en el JSON (Jackson lo toma como el campo "tipo"
    // por convención de getter). El frontend lo usa para distinguir Huesped/Propietario
    // en listados genéricos de Usuario, donde antes no había forma de saberlo.
    public String getTipo() {
        return (this instanceof Propietario) ? "PROPIETARIO" : "HUESPED";
    }

}
