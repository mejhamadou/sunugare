package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.CompagnieRequest;
import sn.jokko.sunugare.entity.Compagnie;
import sn.jokko.sunugare.service.CompagnieService;

import java.util.List;

@RestController
@RequestMapping("/api/compagnies")
public class CompagnieController {
    private final CompagnieService compagnieService;

    public CompagnieController(CompagnieService compagnieService) {
        this.compagnieService = compagnieService;
    }

    @PostMapping
    public ResponseEntity<Compagnie> creer(@Valid @RequestBody CompagnieRequest request) {
        return ResponseEntity.ok(compagnieService.creerCompagnie(request));
    }

    @GetMapping
    public ResponseEntity<List<Compagnie>> getAll() {
        return ResponseEntity.ok(compagnieService.getAllCompagnies());
    }
}