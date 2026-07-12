package edu.utn.frsf.isi.dan.user.service;

import edu.utn.frsf.isi.dan.user.dao.UsuarioRepository;
import edu.utn.frsf.isi.dan.user.dto.LoginRequest;
import edu.utn.frsf.isi.dan.user.dto.LoginResponse;
import edu.utn.frsf.isi.dan.user.exception.CredencialesInvalidasException;
import edu.utn.frsf.isi.dan.user.model.Propietario;
import edu.utn.frsf.isi.dan.user.model.Usuario;
import edu.utn.frsf.isi.dan.user.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.email());
        if (usuario == null || usuario.getPassword() == null
                || !passwordEncoder.matches(loginRequest.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException("Email o contraseña inválidos");
        }

        // El discriminador JPA "tipo" ya resolvió la subclase concreta al traer el
        // usuario de la base; el rol es literalmente ese mismo valor (HUESPED/PROPIETARIO),
        // sin traducirlo a otro vocabulario.
        String rol = (usuario instanceof Propietario) ? "PROPIETARIO" : "HUESPED";

        String token = jwtUtil.generateToken(usuario, rol);

        return new LoginResponse(token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), rol);
    }
}
