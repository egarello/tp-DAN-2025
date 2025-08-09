package edu.utn.frsf.isi.dan.user.service;

import edu.utn.frsf.isi.dan.user.dao.BancoRepository;
import edu.utn.frsf.isi.dan.user.dao.CuentaBancariaRepository;
import edu.utn.frsf.isi.dan.user.dao.TarjetaCreditoRepository;
import edu.utn.frsf.isi.dan.user.dao.UsuarioRepository;
import edu.utn.frsf.isi.dan.user.dto.HuespedRecord;
import edu.utn.frsf.isi.dan.user.dto.PropietarioRecord;
import edu.utn.frsf.isi.dan.user.dto.TarjetaCreditoRecord;
import edu.utn.frsf.isi.dan.user.model.Banco;
import edu.utn.frsf.isi.dan.user.model.CuentaBancaria;
import edu.utn.frsf.isi.dan.user.model.Huesped;
import edu.utn.frsf.isi.dan.user.model.Propietario;
import edu.utn.frsf.isi.dan.user.model.TarjetaCredito;
import edu.utn.frsf.isi.dan.user.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private BancoRepository bancoRepository;

    @Autowired 
    private CuentaBancariaRepository cuentaBancariaRepository;

    @Autowired
    private TarjetaCreditoRepository tarjetaCreditoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Huesped crearUsuarioHuesped(HuespedRecord huespedRecord) {
        // Buscar el banco por ID
        Optional<Banco> bancoOptional = bancoRepository.findById(huespedRecord.idBanco());
        if (bancoOptional.isEmpty()) {
            throw new IllegalArgumentException("Banco no encontrado con ID: " + huespedRecord.idBanco());
        }

        Banco banco = bancoOptional.get();

        // Crear y guardar el usuario
        Huesped usuario = huespedRecord.toHuesped();
        usuarioRepository.save(usuario);

        // Crear y guardar la tarjeta de crédito
        TarjetaCredito tarjetaCredito = huespedRecord.toTarjetaCredito();
        tarjetaCredito.setHuesped(usuario);
        tarjetaCredito.setBanco(banco);
        TarjetaCredito tarjetaCreditoSaved =tarjetaCreditoRepository.save(tarjetaCredito);
        if (usuario.getTarjetaCredito() == null) {
            usuario.setTarjetaCredito(new ArrayList<>());
        }
        usuario.getTarjetaCredito().add(tarjetaCreditoSaved);
        return usuario;
    }

    public void agregarTarjetaHuesped(String dni, TarjetaCreditoRecord tarjetaCreditoRecord) {

        // Buscar el banco por ID
        Optional<Banco> bancoOptional = bancoRepository.findById(tarjetaCreditoRecord.idBanco());
        if (bancoOptional.isEmpty()) {
            throw new IllegalArgumentException("Banco no encontrado con ID: " + tarjetaCreditoRecord.idBanco());
        }

        // Buscar el usuario por DNI
        Usuario usuario = usuarioRepository.findByDni(dni);
        if (usuario == null || !(usuario instanceof Huesped)) {
            throw new IllegalArgumentException("Usuario no encontrado o no es un huesped con DNI: " + dni);
        }

        Banco banco = bancoOptional.get();

        //si es principal, desmarcar como principal la principal actual
        if (tarjetaCreditoRecord.esPrincipalCC()) {
            for (TarjetaCredito tarjeta : ((Huesped) usuario).getTarjetaCredito()) {
                if (tarjeta.getEsPrincipal()) {
                    tarjeta.setEsPrincipal(false);
                    tarjetaCreditoRepository.save(tarjeta);
                    break; // Solo desmarcar la primera tarjeta principal encontrada
                }
            }
        }

        // Crear y guardar la tarjeta de crédito
        TarjetaCredito tarjetaCredito = tarjetaCreditoRecord.toTarjetaCredito();
        tarjetaCredito.setHuesped((Huesped)usuario);
        tarjetaCredito.setBanco(banco);
        TarjetaCredito tarjetaCreditoSaved =tarjetaCreditoRepository.save(tarjetaCredito);
    }

    public void eliminarTarjetaHuesped(String dni, TarjetaCreditoRecord tarjetaCreditoRecord){

        // Buscar el usuario por DNI
        Usuario usuario = usuarioRepository.findByDni(dni);
        if (usuario == null || !(usuario instanceof Huesped)) {
            throw new IllegalArgumentException("Usuario no encontrado o no es un huesped con DNI: " + dni);
        }
        
        // Buscar la tarjeta de crédito por todos los datos del record
        TarjetaCredito tarjetaCredito = tarjetaCreditoRepository.findByNumeroAndNombreTitularAndFechaVencimientoAndCvc(
            tarjetaCreditoRecord.numeroCC(),
            tarjetaCreditoRecord.nombreTitular(),
            tarjetaCreditoRecord.fechaVencimientoCC(),
            tarjetaCreditoRecord.cvcCC()
        );
        if (tarjetaCredito == null) {
            throw new IllegalArgumentException("Tarjeta de crédito no encontrada con los datos proporcionados.");
        }

        // Verificar si el dni corresponde con el dueño de la tarjeta
        if (!((Huesped) usuario).getId().equals(tarjetaCredito.getHuesped().getId())) {
            throw new IllegalArgumentException("El DNI no corresponde con el dueño de la tarjeta.");
        }

        // Si la tarjeta es principal, lanzar excepción
        if (tarjetaCredito.getEsPrincipal()) {
            throw new IllegalArgumentException("No se puede eliminar la tarjeta principal.");
        }

        // Eliminar la tarjeta de crédito
        tarjetaCreditoRepository.delete(tarjetaCredito);

    }

    public void cambiarTarjetaPrincipalHuesped(String dni, TarjetaCreditoRecord tarjetaCreditoRecord) {

        // Buscar el usuario por DNI
        Usuario usuario = usuarioRepository.findByDni(dni);
        if (usuario == null || !(usuario instanceof Huesped)) {
            throw new IllegalArgumentException("Usuario no encontrado o no es un huesped con DNI: " + dni);
        }

        // Buscar la tarjeta de crédito por todos los datos del record
        TarjetaCredito tarjetaCredito = tarjetaCreditoRepository.findByNumeroAndNombreTitularAndFechaVencimientoAndCvc(
            tarjetaCreditoRecord.numeroCC(),
            tarjetaCreditoRecord.nombreTitular(),
            tarjetaCreditoRecord.fechaVencimientoCC(),
            tarjetaCreditoRecord.cvcCC()
        );
        if (tarjetaCredito == null) {
            throw new IllegalArgumentException("Tarjeta de crédito no encontrada con los datos proporcionados.");
        }

        // Verificar si el dni corresponde con el dueño de la tarjeta
        if (!((Huesped) usuario).getId().equals(tarjetaCredito.getHuesped().getId())) {
            throw new IllegalArgumentException("El DNI no corresponde con el dueño de la tarjeta.");
        }

        // Si la tarjeta es principal, lanzar excepción
        if (tarjetaCredito.getEsPrincipal()) {
            throw new IllegalArgumentException("La tarjeta de crédito proporcionada ya es la principal.");
        }

        //si es principal, desmarcar como principal la principal actual

        if(tarjetaCreditoRecord.esPrincipalCC() == null){
            throw new IllegalArgumentException("El campo 'esPrincipalCC' no puede ser nulo.");
        }

        if (tarjetaCreditoRecord.esPrincipalCC()) {
            for (TarjetaCredito tarjeta : ((Huesped) usuario).getTarjetaCredito()) {
                if (tarjeta.getEsPrincipal()) {
                    tarjeta.setEsPrincipal(false);
                    tarjetaCreditoRepository.save(tarjeta);
                    break; // Solo desmarcar la primera tarjeta principal encontrada
                }
            }
        } else {
            throw new IllegalArgumentException("La tarjeta de crédito proporcionada no es principal.");
        }

        // Crear y guardar la tarjeta de crédito
        tarjetaCredito.setEsPrincipal(true);
        TarjetaCredito tarjetaCreditoSaved = tarjetaCreditoRepository.save(tarjetaCredito);

    }

    public void crearUsuarioPropietario(PropietarioRecord propietarioRecord) {
        // Buscar el banco por ID
        Optional<Banco> bancoOptional = bancoRepository.findById(propietarioRecord.cuentaBancaria().idBanco());
        if (bancoOptional.isEmpty()) {
            throw new IllegalArgumentException("Banco no encontrado con ID: " + propietarioRecord.cuentaBancaria().idBanco());
        }

        Banco banco = bancoOptional.get();

        Propietario propietario = propietarioRecord.toPropietario();
        CuentaBancaria cuentaBancaria = propietarioRecord.cuentaBancaria().toCuentaBancaria();
        cuentaBancaria.setBanco(banco);
        propietario.setCuentaBancaria(cuentaBancariaRepository.save(cuentaBancaria));
        usuarioRepository.save(propietario);
    }
    
    public Page<Usuario> buscarPorNombre(String nombre, Pageable pageable) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre, pageable);
    }

    public Page<Usuario> buscarPorDni(String dni, Pageable pageable) {
        return usuarioRepository.findByDniContaining(dni, pageable);
    }

    public Usuario buscarPorDniExacto(String dni) {
        return usuarioRepository.findByDni(dni);
    }

    public boolean eliminarPorDni(String dni) {
        Usuario usuario = usuarioRepository.findByDni(dni);
        if (usuario != null) {
            usuarioRepository.delete(usuario);
            return true;
        }
        return false;
    }
}