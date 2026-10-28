package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.ChauffeurRequest;
import sn.jokko.sunugare.dto.VehiculeRequest;
import sn.jokko.sunugare.entity.Chauffeur;
import sn.jokko.sunugare.entity.Vehicule;
import sn.jokko.sunugare.service.ChauffeurService;

import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs") // ✅ Minuscule ici
public class ChauffeurController {
    private final ChauffeurService service;

    public ChauffeurController(ChauffeurService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Chauffeur> creer(@Valid @RequestBody ChauffeurRequest request) {
        return ResponseEntity.ok(service.creerChauffeur(request));
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<Chauffeur>> rechercher(@RequestParam(required = false) Long compagnieId) {
        return ResponseEntity.ok(service.rechercher(compagnieId));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterCsv() {
        List<Chauffeur> chauffeurs = service.getAll();
        String csvData = service.exporterCsv(chauffeurs);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=chauffeurs.csv")
                .body(csvData.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chauffeur> modifier(@PathVariable Long id, @Valid @RequestBody ChauffeurRequest request) {
        return ResponseEntity.ok(service.updateChauffeur(id, request));
    }

    @GetMapping
    public ResponseEntity<List<Chauffeur>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}