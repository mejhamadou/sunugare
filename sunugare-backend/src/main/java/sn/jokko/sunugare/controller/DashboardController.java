package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final BilletRepository billetRepository;
    private final VoyageRepository voyageRepository;

    public DashboardController(BilletRepository billetRepository, VoyageRepository voyageRepository) {
        this.billetRepository = billetRepository;
        this.voyageRepository = voyageRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalBillets = billetRepository.count();
        Double recettes = billetRepository.sumTotalRecettes();
        long voyagesPlanifies = voyageRepository.countByStatut("PLANIFIE");

        stats.put("totalBillets", totalBillets);
        stats.put("recettes", recettes != null ? recettes : 0.0);
        stats.put("voyagesPlanifies", voyagesPlanifies);

        return ResponseEntity.ok(stats);
    }
}