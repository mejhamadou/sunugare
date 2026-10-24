package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.PaiementRequest;
import sn.jokko.sunugare.entity.Paiement;
import sn.jokko.sunugare.service.PaiementService;

import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {
    private final PaiementService service;

    public PaiementController(PaiementService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> payer(@Valid @RequestBody PaiementRequest request) {
        try {
            Paiement paiement = service.encaisser(request);
            return ResponseEntity.ok(paiement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}