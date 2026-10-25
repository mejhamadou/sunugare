package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.AbonnementRequest;
import sn.jokko.sunugare.entity.Abonnement;
import sn.jokko.sunugare.service.AbonnementService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/abonnements")
public class AbonnementController {
    private final AbonnementService abonnementService;

    public AbonnementController(AbonnementService abonnementService) {
        this.abonnementService = abonnementService;
    }

    @GetMapping
    public ResponseEntity<List<Abonnement>> getAll() {
        return ResponseEntity.ok(abonnementService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AbonnementRequest request) {
        try {
            Abonnement abonnement = abonnementService.creerAbonnement(request);
            return ResponseEntity.ok(abonnement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}