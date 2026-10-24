package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.GareRequest;
import sn.jokko.sunugare.entity.Gare;
import sn.jokko.sunugare.service.GareService;

import java.util.List;

@RestController
@RequestMapping("/api/gares")
public class GareController {
    private final GareService gareService;

    public GareController(GareService gareService) {
        this.gareService = gareService;
    }

    @PostMapping
    public ResponseEntity<Gare> creer(@Valid @RequestBody GareRequest request) {
        return ResponseEntity.ok(gareService.creerGare(request));
    }

    @GetMapping
    public ResponseEntity<List<Gare>> getAll() {
        return ResponseEntity.ok(gareService.getAllGares());
    }
}