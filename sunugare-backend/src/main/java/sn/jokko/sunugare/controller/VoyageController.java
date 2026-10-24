package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.VoyageRequest;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.service.VoyageService;

import java.util.List;

@RestController
@RequestMapping("/api/voyages")
public class VoyageController {
    private final VoyageService service;

    public VoyageController(VoyageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Voyage> creer(@Valid @RequestBody VoyageRequest request) {
        return ResponseEntity.ok(service.creerVoyage(request));
    }

    @GetMapping
    public ResponseEntity<List<Voyage>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Voyage> changerStatut(@PathVariable Long id, @RequestParam String statut) {
        return ResponseEntity.ok(service.changerStatut(id, statut));
    }
}