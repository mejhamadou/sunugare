package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.VehiculeRequest;
import sn.jokko.sunugare.entity.Vehicule;
import sn.jokko.sunugare.service.VehiculeService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
public class VehiculeController {
    private final VehiculeService service;

    public VehiculeController(VehiculeService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Vehicule> creer(@Valid @RequestBody VehiculeRequest request) {
        return ResponseEntity.ok(service.creerVehicule(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Vehicule> modifier(@PathVariable Long id, @Valid @RequestBody VehiculeRequest request) {
        return ResponseEntity.ok(service.updateVehicule(id, request));
    }

    @GetMapping
    public ResponseEntity<List<Vehicule>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/valider-manuellement")
    public ResponseEntity<Vehicule> validerManuellement(@PathVariable Long id, java.security.Principal principal) {
        return ResponseEntity.ok(service.validerManuellement(id, principal.getName()));
    }

}