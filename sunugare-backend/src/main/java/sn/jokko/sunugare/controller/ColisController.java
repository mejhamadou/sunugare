package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.ColisRequest;
import sn.jokko.sunugare.entity.Colis;
import sn.jokko.sunugare.service.ColisService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colis")
public class ColisController {
    private final ColisService service;

    public ColisController(ColisService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Colis> enregistrer(@Valid @RequestBody ColisRequest request) {
        return ResponseEntity.ok(service.enregistrerColis(request));
    }

    @GetMapping
    public ResponseEntity<List<Colis>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Route publique pour le suivi par le client
    @GetMapping("/suivi/{code}")
    public ResponseEntity<?> suivre(@PathVariable String code) {
        try {
            return ResponseEntity.ok(service.getByCodeSuivi(code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Colis> changerStatut(@PathVariable Long id, @RequestParam String statut) {
        return ResponseEntity.ok(service.changerStatut(id, statut));
    }
}