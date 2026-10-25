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

    @PutMapping("/{id}")
    public ResponseEntity<Chauffeur> modifier(@PathVariable Long id, @Valid @RequestBody ChauffeurRequest request) {
        return ResponseEntity.ok(service.updateChauffeur(id, request));
    }

    @GetMapping
    public ResponseEntity<List<Chauffeur>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}