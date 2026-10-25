package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.LigneRequest;
import sn.jokko.sunugare.entity.Ligne;
import sn.jokko.sunugare.service.LigneService;

import java.util.List;

@RestController
@RequestMapping("/api/lignes")
public class LigneController {
    private final LigneService service;

    public LigneController(LigneService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Ligne>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Ligne> creer(@Valid @RequestBody LigneRequest request) {
        return ResponseEntity.ok(service.creerLigne(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ligne> modifier(@PathVariable Long id, @Valid @RequestBody LigneRequest request) {
        return ResponseEntity.ok(service.updateLigne(id, request));
    }
}