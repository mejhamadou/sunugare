package sn.jokko.sunugare.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.PaiementRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.time.LocalDate;
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
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        Map<String, Object> stats = new HashMap<>();

        // Conversion des dates
        java.time.LocalDateTime debut = dateDebut != null ? dateDebut.atStartOfDay() : null;
        java.time.LocalDateTime fin = dateFin != null ? dateFin.atTime(23, 59, 59) : null;

        // Stats filtrées
        stats.put("totalBillets", billetRepository.countBilletsByDate(debut, fin));
        stats.put("voyagesPlanifies", voyageRepository.countByStatut("PLANIFIE")); // (On pourrait aussi le filtrer par date)

        Double wave = paiementRepository.sumMontantByMethodeAndDate("WAVE", debut, fin);
        Double om = paiementRepository.sumMontantByMethodeAndDate("ORANGE_MONEY", debut, fin);
        Double especes = paiementRepository.sumMontantByMethodeAndDate("ESPECES", debut, fin);

        stats.put("recettesWave", wave != null ? wave : 0.0);
        stats.put("recettesOm", om != null ? om : 0.0);
        stats.put("recettesEspeces", especes != null ? especes : 0.0);

        double total = (wave != null ? wave : 0.0) + (om != null ? om : 0.0) + (especes != null ? especes : 0.0);
        stats.put("recettes", total);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exporterRapportCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        java.time.LocalDateTime debut = dateDebut != null ? dateDebut.atStartOfDay() : null;
        java.time.LocalDateTime fin = dateFin != null ? dateFin.atTime(23, 59, 59) : null;

        // On récupère les stats
        long totalBillets = billetRepository.countBilletsByDate(debut, fin);
        Double wave = paiementRepository.sumMontantByMethodeAndDate("WAVE", debut, fin);
        Double om = paiementRepository.sumMontantByMethodeAndDate("ORANGE_MONEY", debut, fin);
        Double especes = paiementRepository.sumMontantByMethodeAndDate("ESPECES", debut, fin);

        double total = (wave != null ? wave : 0.0) + (om != null ? om : 0.0) + (especes != null ? especes : 0.0);

        // On génère le CSV
        StringBuilder csv = new StringBuilder();
        csv.append("RAPPORT D'ACTIVITE SUNUGARE\n");
        csv.append("Periode;").append(dateDebut != null ? dateDebut : "Début").append(";").append(dateFin != null ? dateFin : "Aujourd'hui").append("\n\n");

        csv.append("INDICATEUR;VALEUR\n");
        csv.append("Total Billets Vendus;").append(totalBillets).append("\n");
        csv.append("Recettes Especes;").append(especes != null ? especes : 0.0).append(" FCFA\n");
        csv.append("Recettes Wave;").append(wave != null ? wave : 0.0).append(" FCFA\n");
        csv.append("Recettes Orange Money;").append(om != null ? om : 0.0).append(" FCFA\n");
        csv.append("TOTAL RECETTES;").append(total).append(" FCFA\n");

        byte[] output = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=rapport_sunugare.csv")
                .body(output);
    }
}