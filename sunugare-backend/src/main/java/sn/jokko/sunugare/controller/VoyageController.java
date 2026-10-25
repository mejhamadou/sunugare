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

    @GetMapping("/public/disponibles")
    public ResponseEntity<List<Voyage>> getVoyagesPublics() {
        return ResponseEntity.ok(service.getVoyagesPourPublic());
    }

    @PostMapping
    public ResponseEntity<Voyage> creer(@Valid @RequestBody VoyageRequest request, java.security.Principal principal) {
        // ✅ On passe principal.getName() (l'email) au service
        return ResponseEntity.ok(service.creerVoyage(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Voyage>> getAll(java.security.Principal principal) {
        // principal.getName() renvoie l'email de l'utilisateur connecté
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



}