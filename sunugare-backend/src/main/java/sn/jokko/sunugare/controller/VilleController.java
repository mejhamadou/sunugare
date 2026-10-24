package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.VilleRequest;
import sn.jokko.sunugare.entity.Ville;
import sn.jokko.sunugare.service.VilleService;

import java.util.List;

@RestController
@RequestMapping("/api/villes")
public class VilleController {
    private final VilleService villeService;

    public VilleController(VilleService villeService) {
        this.villeService = villeService;
    }

    @PostMapping
    public ResponseEntity<Ville> creer(@Valid @RequestBody VilleRequest request) {
        return ResponseEntity.ok(villeService.creerVille(request));
    }

    @GetMapping
    public ResponseEntity<List<Ville>> getAll() {
        return ResponseEntity.ok(villeService.getAllVilles());
    }
}