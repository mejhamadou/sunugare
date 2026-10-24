package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.VilleRequest;
import sn.jokko.sunugare.entity.Ville;
import sn.jokko.sunugare.repository.VilleRepository;

import java.util.List;

@Service
public class VilleService {
    private final VilleRepository villeRepository;

    public VilleService(VilleRepository villeRepository) {
        this.villeRepository = villeRepository;
    }

    public Ville creerVille(VilleRequest request) {
        Ville ville = new Ville();
        ville.setNom(request.getNom());
        return villeRepository.save(ville);
    }

    public List<Ville> getAllVilles() {
        return villeRepository.findAll();
    }
}