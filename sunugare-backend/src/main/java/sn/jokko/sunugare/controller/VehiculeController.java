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

    @GetMapping("/recherche")
    public ResponseEntity<List<Vehicule>> rechercher(@RequestParam(required = false) Long compagnieId) {
        return ResponseEntity.ok(service.rechercher(compagnieId));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterCsv() {
        List<Vehicule> vehicules = service.getAll(); // ou la recherche
        String csvData = service.exporterCsv(vehicules);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=vehicules.csv")
                .body(csvData.getBytes(java.nio.charset.StandardCharsets.UTF_8));
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