package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.GareRequest;
import sn.jokko.sunugare.entity.Gare;
import sn.jokko.sunugare.entity.Ville;
import sn.jokko.sunugare.repository.GareRepository;
import sn.jokko.sunugare.repository.VilleRepository;

import java.util.List;

@Service
public class GareService {
    private final GareRepository gareRepository;
    private final VilleRepository villeRepository;

    public GareService(GareRepository gareRepository, VilleRepository villeRepository) {
        this.gareRepository = gareRepository;
        this.villeRepository = villeRepository;
    }

    public Gare creerGare(GareRequest request) {
        Ville ville = villeRepository.findById(request.getVilleId())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        Gare gare = new Gare();
        gare.setNom(request.getNom());
        gare.setAdresse(request.getAdresse());
        gare.setVille(ville);
        return gareRepository.save(gare);
    }

    public List<Gare> getAllGares() {
        return gareRepository.findAll();
    }
}