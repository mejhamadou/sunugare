package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.ChauffeurRequest;
import sn.jokko.sunugare.entity.Compagnie;
import sn.jokko.sunugare.entity.Chauffeur;
import sn.jokko.sunugare.repository.ChauffeurRepository;
import sn.jokko.sunugare.repository.CompagnieRepository;

import java.util.List;

@Service
public class ChauffeurService {
    private final ChauffeurRepository chauffeurRepository;
    private final CompagnieRepository compagnieRepository;

    // ✅ Correction : On ajoute CompagnieRepository dans les paramètres
    public ChauffeurService(ChauffeurRepository chauffeurRepository, CompagnieRepository compagnieRepository) {
        this.chauffeurRepository = chauffeurRepository;
        this.compagnieRepository = compagnieRepository;
    }

    public Chauffeur creerChauffeur(ChauffeurRequest request) {
        Compagnie compagnie = compagnieRepository.findById(request.getCompagnieId())
                .orElseThrow(() -> new RuntimeException("Compagnie introuvable"));

        Chauffeur v = new Chauffeur();
        v.setPrenom(request.getPrenom());
        v.setNom(request.getNom());
        v.setTelephone(request.getTelephone());
        v.setNumeroPermis(request.getNumeroPermis());
        v.setCompagnie(compagnie);
        return chauffeurRepository.save(v);
    }

    public Chauffeur updateChauffeur(Long id, ChauffeurRequest request) {
        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));

        Compagnie compagnie = compagnieRepository.findById(request.getCompagnieId())
                .orElseThrow(() -> new RuntimeException("Compagnie introuvable"));

        chauffeur.setPrenom(request.getPrenom());
        chauffeur.setNom(request.getNom());
        chauffeur.setTelephone(request.getTelephone());
        chauffeur.setNumeroPermis(request.getNumeroPermis());
        chauffeur.setCompagnie(compagnie);

        // ✅ On enregistre la date d'expiration du permis
        chauffeur.setDateExpirationPermis(request.getDateExpirationPermis());

        return chauffeurRepository.save(chauffeur);
    }

    public List<Chauffeur> getAll() {
        return chauffeurRepository.findAll();
    }
}