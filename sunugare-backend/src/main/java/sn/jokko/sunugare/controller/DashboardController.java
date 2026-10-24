package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.PaiementRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final BilletRepository billetRepository;
    private final VoyageRepository voyageRepository;
    private final PaiementRepository paiementRepository;

    public DashboardController(BilletRepository billetRepository, VoyageRepository voyageRepository, PaiementRepository paiementRepository) {
        this.billetRepository = billetRepository;
        this.voyageRepository = voyageRepository;
        this.paiementRepository = paiementRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Stats de base
        stats.put("totalBillets", billetRepository.count());
        stats.put("voyagesPlanifies", voyageRepository.countByStatut("PLANIFIE"));

        // Recettes par méthode
        Double wave = paiementRepository.sumMontantByMethode("WAVE");
        Double om = paiementRepository.sumMontantByMethode("ORANGE_MONEY");
        Double especes = paiementRepository.sumMontantByMethode("ESPECES");

        stats.put("recettesWave", wave != null ? wave : 0.0);
        stats.put("recettesOm", om != null ? om : 0.0);
        stats.put("recettesEspeces", especes != null ? especes : 0.0);

        // Total
        double total = (wave != null ? wave : 0.0) + (om != null ? om : 0.0) + (especes != null ? especes : 0.0);
        stats.put("recettes", total);

        return ResponseEntity.ok(stats);
    }
}