package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.LigneRequest;
import sn.jokko.sunugare.entity.Ligne;
import sn.jokko.sunugare.entity.Ville;
import sn.jokko.sunugare.repository.LigneRepository;
import sn.jokko.sunugare.repository.VilleRepository;

import java.util.List;

@Service
public class LigneService {
    private final LigneRepository ligneRepository;
    private final VilleRepository villeRepository;

    // ✅ C'est ici qu'il faut ajouter VilleRepository
    public LigneService(LigneRepository ligneRepository, VilleRepository villeRepository) {
        this.ligneRepository = ligneRepository;
        this.villeRepository = villeRepository;
    }

    public List<Ligne> getAll() {
        return ligneRepository.findAll();
    }

    public Ligne creerLigne(LigneRequest request) {
        Ville depart = villeRepository.findById(request.getVilleDepartId())
                .orElseThrow(() -> new RuntimeException("Ville de départ introuvable"));
        Ville arrivee = villeRepository.findById(request.getVilleArriveeId())
                .orElseThrow(() -> new RuntimeException("Ville d'arrivée introuvable"));

        Ligne ligne = new Ligne();
        ligne.setVilleDepart(depart);
        ligne.setVilleArrivee(arrivee);
        ligne.setDistanceKm(request.getDistanceKm());

        return ligneRepository.save(ligne);
    }
}