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

@Service
public class BancoService {
    @Autowired
    private BancoRepository bancoRepository;

    public Page<Banco> buscarBancos(Pageable pageable){
        return bancoRepository.findAll(pageable);
    }
    public Banco crearBanco(BancoRecord bancoRecord){
        
        if(bancoRepository.existsByNombre(bancoRecord.nombre())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El banco ya existe");
        }
         
        Banco banco = bancoRecord.toBanco();
        return bancoRepository.save(banco);
    }
}
