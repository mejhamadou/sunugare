package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.PaiementRequest;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.Paiement;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.PaiementRepository;

@Service
public class PaiementService {
    private final PaiementRepository paiementRepository;
    private final BilletRepository billetRepository;

    public PaiementService(PaiementRepository paiementRepository, BilletRepository billetRepository) {
        this.paiementRepository = paiementRepository;
        this.billetRepository = billetRepository;
    }

    public Paiement encaisser(PaiementRequest request) {
        Billet billet = billetRepository.findById(request.getBilletId())
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));

        // Simulation de l'appel à Wave ou Orange Money
        String reference = "REF-" + System.currentTimeMillis();
        if (request.getMethode().equals("WAVE")) {
            reference = "WAVE-" + reference;
        } else if (request.getMethode().equals("ORANGE_MONEY")) {
            reference = "OM-" + reference;
        }

        Paiement paiement = new Paiement();
        paiement.setBillet(billet);
        paiement.setMontant(billet.getVoyage().getPrix());
        paiement.setMethode(request.getMethode());
        paiement.setStatut("REUSSI");
        paiement.setReferenceExterne(reference);

        return paiementRepository.save(paiement);
    }
}