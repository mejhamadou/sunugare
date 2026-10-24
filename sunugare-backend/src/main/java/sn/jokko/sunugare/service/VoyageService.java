package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.VoyageRequest;
import sn.jokko.sunugare.entity.*;
import sn.jokko.sunugare.repository.*;

import java.util.List;

@Service
public class VoyageService {
    private final VoyageRepository voyageRepo;
    private final LigneRepository ligneRepo;
    private final VehiculeRepository vehiculeRepo;
    private final ChauffeurRepository chauffeurRepo;
    private final QuaiRepository quaiRepo;

    public VoyageService(VoyageRepository voyageRepo, LigneRepository ligneRepo, VehiculeRepository vehiculeRepo, ChauffeurRepository chauffeurRepo, QuaiRepository quaiRepo) {
        this.voyageRepo = voyageRepo;
        this.ligneRepo = ligneRepo;
        this.vehiculeRepo = vehiculeRepo;
        this.chauffeurRepo = chauffeurRepo;
        this.quaiRepo = quaiRepo;
    }

    public Voyage creerVoyage(VoyageRequest req) {
        Ligne ligne = ligneRepo.findById(req.getLigneId()).orElseThrow(() -> new RuntimeException("Ligne introuvable"));
        Vehicule vehicule = vehiculeRepo.findById(req.getVehiculeId()).orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
        Chauffeur chauffeur = chauffeurRepo.findById(req.getChauffeurId()).orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));
        Quai quai = quaiRepo.findById(req.getQuaiId()).orElseThrow(() -> new RuntimeException("Quai introuvable"));

        Voyage v = new Voyage();
        v.setLigne(ligne);
        v.setVehicule(vehicule);
        v.setChauffeur(chauffeur);
        v.setQuai(quai);
        v.setDateDepart(req.getDateDepart());
        v.setPrix(req.getPrix());
        v.setStatut("PLANIFIE");

        return voyageRepo.save(v);
    }

    public List<Voyage> getAll() {
        return voyageRepo.findAll();
    }

    public Voyage changerStatut(Long voyageId, String nouveauStatut) {
        Voyage voyage = voyageRepo.findById(voyageId)
                .orElseThrow(() -> new RuntimeException("Voyage introuvable"));

        // On vérifie que le statut est valide
        List<String> statutsValides = List.of("PLANIFIE", "EMBARQUEMENT", "DEPART", "ARRIVE", "ANNULE");
        if (!statutsValides.contains(nouveauStatut)) {
            throw new RuntimeException("Statut invalide");
        }

        voyage.setStatut(nouveauStatut);
        return voyageRepo.save(voyage);
    }
}