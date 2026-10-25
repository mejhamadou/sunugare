package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.BilletRequest;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.User;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.PaiementRepository;
import sn.jokko.sunugare.repository.UserRepository;
import sn.jokko.sunugare.repository.VoyageRepository;


import java.util.List;
import java.util.UUID;

@Service
public class BilletService {
    private final BilletRepository billetRepository;
    private final VoyageRepository voyageRepository;
    private final UserRepository userRepository;
    private final PaiementRepository paiementRepository;
    private final AuditService auditService;


    public BilletService(BilletRepository billetRepository, VoyageRepository voyageRepository, UserRepository userRepository, PaiementRepository paiementRepository, AuditService auditService) {
        this.billetRepository = billetRepository;
        this.voyageRepository = voyageRepository;
        this.userRepository = userRepository;
        this.paiementRepository = paiementRepository;
        this.auditService = auditService;
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

    public List<Billet> getBilletsPourUtilisateur(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return billetRepository.findAll();
        }
        if (user.getGare() != null) {
            return billetRepository.findAllByGareId(user.getGare().getId());
        }
        return List.of();
    }

   public Billet annulerBillet(Long billetId, String email) {
        Billet billet = billetRepository.findById(billetId)
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));

        if (billet.getStatut().equals("ANNULE")) {
            throw new RuntimeException("Ce billet est déjà annulé.");
        }
        if (billet.getStatut().equals("UTILISE")) {
            throw new RuntimeException("Impossible d'annuler un billet déjà utilisé.");
        }

        // 1. On change le statut du billet
        billet.setStatut("ANNULE");
        billetRepository.save(billet);

        // ✅ On enregistre l'action
       auditService.logAction(
               "ANNULATION_BILLET",
               "Billet",
               billetId,
               email,
               "Annulation du billet " + billet.getNumeroBillet() + " pour " + billet.getNomPassager()
       );

        // 2. On cherche le paiement associé pour le rembourser
        paiementRepository.findAll().stream()
                .filter(p -> p.getBillet().getId().equals(billetId))
                .findFirst()
                .ifPresent(paiement -> {
                    paiement.setStatut("REMBOURSE");
                    paiementRepository.save(paiement);
                });


        return billet;
    }
}