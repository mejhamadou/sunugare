package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final BilletRepository billetRepository;
    private final VoyageRepository voyageRepository;

    public PredictionController(BilletRepository billetRepository, VoyageRepository voyageRepository) {
        this.billetRepository = billetRepository;
        this.voyageRepository = voyageRepository;
    }

    @GetMapping("/affluence")
    public ResponseEntity<Map<String, Object>> predireAffluence() {
        List<Object[]> billetsParJour = billetRepository.countBilletsParJour();

        // Algorithme basique : Moyenne des billets vendus sur les 7 derniers jours
        double totalBillets = 0;
        int joursActifs = 0;

        for (Object[] row : billetsParJour) {
            totalBillets += ((Number) row[1]).doubleValue();
            joursActifs++;
        }

        double moyenne = joursActifs > 0 ? (totalBillets / joursActifs) : 0;

        // On prédit pour demain
        Map<String, Object> result = new HashMap<>();
        result.put("predictionBilletsDemain", Math.round(moyenne));
        result.put("tendance", joursActifs > 0 ? "Stable (basé sur " + joursActifs + " jours)" : "Pas assez de données");

        return ResponseEntity.ok(result);
    }
}