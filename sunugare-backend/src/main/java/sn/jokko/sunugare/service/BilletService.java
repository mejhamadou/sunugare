package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.BilletRequest;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.List;
import java.util.UUID;

@Service
public class BilletService {
    private final BilletRepository billetRepository;
    private final VoyageRepository voyageRepository;

    public BilletService(BilletRepository billetRepository, VoyageRepository voyageRepository) {
        this.billetRepository = billetRepository;
        this.voyageRepository = voyageRepository;
    }

    public Billet vendreBillet(BilletRequest request) {
        Voyage voyage = voyageRepository.findById(request.getVoyageId())
                .orElseThrow(() -> new RuntimeException("Voyage introuvable"));

        // Vérifier si le siège est déjà pris pour ce voyage
        boolean siegePris = billetRepository.existsByVoyageIdAndNumeroSiege(request.getVoyageId(), request.getNumeroSiege());
        if (siegePris) {
            throw new RuntimeException("Le siège " + request.getNumeroSiege() + " est déjà occupé pour ce voyage.");
        }

        Billet billet = new Billet();
        billet.setVoyage(voyage);
        billet.setNomPassager(request.getNomPassager());
        billet.setTelephonePassager(request.getTelephonePassager());
        billet.setNumeroSiege(request.getNumeroSiege());
        // Génère un code unique comme "SUN-3F2A1B"
        billet.setNumeroBillet("SUN-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());

        return billetRepository.save(billet);
    }

    public List<Billet> getAll() {
        return billetRepository.findAll();
    }

    public Billet getById(Long id) {
        return billetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));
    }

    public Billet validerBillet(String numeroBillet) {
        Billet billet = billetRepository.findByNumeroBillet(numeroBillet)
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));

        if (!billet.getStatut().equals("VALIDE")) {
            throw new RuntimeException("Ce billet a déjà été utilisé ou annulé.");
        }

        billet.setStatut("UTILISE");
        return billetRepository.save(billet);
    }
}