package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.CompagnieRequest;
import sn.jokko.sunugare.entity.Compagnie;
import sn.jokko.sunugare.repository.CompagnieRepository;

import java.util.List;

@Service
public class CompagnieService {
    private final CompagnieRepository compagnieRepository;

    public CompagnieService(CompagnieRepository compagnieRepository) {
        this.compagnieRepository = compagnieRepository;
    }

    public Compagnie creerCompagnie(CompagnieRequest request) {
        Compagnie compagnie = new Compagnie();
        compagnie.setNom(request.getNom());
        compagnie.setTelephone(request.getTelephone());
        compagnie.setEmail(request.getEmail());
        return compagnieRepository.save(compagnie);
    }

    public List<Compagnie> getAllCompagnies() {
        return compagnieRepository.findAll();
    }
}