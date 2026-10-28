package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.VoyageRequest;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.service.VoyageService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voyages")
public class VoyageController {
    private final VoyageService service;

    public VoyageController(VoyageService service) {
        this.service = service;
    }

    @GetMapping("/public/disponibles")
    public ResponseEntity<List<Voyage>> getVoyagesPublics() {
        return ResponseEntity.ok(service.getVoyagesPourPublic());
    }

    @GetMapping("/live")
    public ResponseEntity<List<Voyage>> getVoyagesLive() {
        return ResponseEntity.ok(service.getVoyagesLive());
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<Voyage>> rechercher(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(service.rechercherVoyages(statut, dateDebut, dateFin));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterCsv() {
        List<Voyage> voyages = service.getAll(); // Ou filtrer si besoin
        String csvData = service.exporterVoyagesCsv(voyages);
        byte[] output = csvData.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=planning_voyages.csv")
                .body(output);
    }

    @PostMapping
    public ResponseEntity<Voyage> creer(@Valid @RequestBody VoyageRequest request, java.security.Principal principal) {
        // ✅ On passe principal.getName() (l'email) au service
        return ResponseEntity.ok(service.creerVoyage(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Voyage>> getAll(java.security.Principal principal) {
        // Le principal doit bien être récupéré
        return ResponseEntity.ok(service.getAllVoyagesPourUtilisateur(principal.getName()));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Voyage> changerStatut(@PathVariable Long id, @RequestParam String statut) {
        return ResponseEntity.ok(service.changerStatut(id, statut));
    }

    @PatchMapping("/{id}/retard")
    public ResponseEntity<Voyage> signalerRetard(@PathVariable Long id, @RequestParam Integer minutes) {
        return ResponseEntity.ok(service.signalerRetard(id, minutes));
    }

    @PostMapping("/scanner-badge")
    public ResponseEntity<?> scannerBadge(@RequestBody Map<String, String> request) {
        try {
            String badge = request.get("numeroBadge");
            String type = request.get("typeScan"); // "SORTIE" ou "ENTREE"

            Voyage voyage = service.scannerBadge(badge, type);
            return ResponseEntity.ok(voyage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}