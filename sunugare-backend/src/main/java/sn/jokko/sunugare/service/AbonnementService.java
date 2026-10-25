package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.AbonnementRequest;
import sn.jokko.sunugare.entity.Abonnement;
import sn.jokko.sunugare.entity.Ligne;
import sn.jokko.sunugare.repository.AbonnementRepository;
import sn.jokko.sunugare.repository.LigneRepository;

import java.util.List;
import java.util.UUID;

@Service
public class AbonnementService {
    private final AbonnementRepository abonnementRepository;
    private final LigneRepository ligneRepository;

    public AbonnementService(AbonnementRepository abonnementRepository, LigneRepository ligneRepository) {
        this.abonnementRepository = abonnementRepository;
        this.ligneRepository = ligneRepository;
    }

    public Abonnement creerAbonnement(AbonnementRequest request) {
        Ligne ligne = ligneRepository.findById(request.getLigneId())
                .orElseThrow(() -> new RuntimeException("Ligne introuvable"));

        Abonnement abo = new Abonnement();
        abo.setCodeAbonnement("ABO-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        abo.setNomPassager(request.getNomPassager());
        abo.setTelephone(request.getTelephone());
        abo.setLigne(ligne);
        abo.setDateDebut(request.getDateDebut());
        abo.setDateFin(request.getDateFin());
        abo.setStatut("ACTIF");

        return abonnementRepository.save(abo);
    }

    public List<Abonnement> getAll() {
        return abonnementRepository.findAll();
    }
}