package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.BagageRequest;
import sn.jokko.sunugare.entity.Bagage;
import sn.jokko.sunugare.service.BagageService;

import java.util.List;

@RestController
@RequestMapping("/api/bagages")
public class BagageController {
    private final BagageService service;

    public BagageController(BagageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Bagage> ajouter(@Valid @RequestBody BagageRequest request) {
        return ResponseEntity.ok(service.ajouterBagage(request));
    }

    @GetMapping("/billet/{billetId}")
    public ResponseEntity<List<Bagage>> getByBillet(@PathVariable Long billetId) {
        return ResponseEntity.ok(service.getBagagesByBillet(billetId));
    }
}