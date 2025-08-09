package edu.utn.frsf.isi.dan.user.service;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utn.frsf.isi.dan.user.dao.BancoRepository;
import edu.utn.frsf.isi.dan.user.dto.BancoRecord;
import edu.utn.frsf.isi.dan.user.model.Banco;
import jakarta.persistence.EntityNotFoundException;

@Service
public class BancoService {
    @Autowired
    private BancoRepository bancoRepository;

    public Page<Banco> buscarBancos(Pageable pageable){
        return bancoRepository.findAll(pageable);
    }
    public Banco buscarBancoById(Integer bancoId){
        return bancoRepository.findById(bancoId)
            .orElseThrow(() -> new EntityNotFoundException("Banco no encontrado con ID: " + bancoId));
    }
    public Banco crearBanco(BancoRecord bancoRecord){
        
        if(bancoRepository.existsByNombre(bancoRecord.nombre())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El banco ya existe");
        }
         
        Banco banco = bancoRecord.toBanco();
        return bancoRepository.save(banco);
    }

    public boolean eliminarBancoById(Integer bancoId){
        Banco banco= bancoRepository.findById(bancoId)
            .orElseThrow(() -> new EntityNotFoundException("Banco no encontrado con ID: " + bancoId));
        bancoRepository.delete(banco);
        return true;
    }

    public boolean modificarBanco(BancoRecord bancoRecord, Integer bancoId){
        Banco bancoAModificar = bancoRepository.findById(bancoId)
            .orElseThrow(() -> new EntityNotFoundException("Banco no encontrado con ID: "+ bancoId));
        bancoAModificar.setNombre(bancoRecord.nombre());
        bancoRepository.save(bancoAModificar);
        return true;
    }
}
