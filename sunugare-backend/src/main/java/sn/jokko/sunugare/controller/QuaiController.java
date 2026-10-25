package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.QuaiRequest;
import sn.jokko.sunugare.entity.Quai;
import sn.jokko.sunugare.service.QuaiService;

import java.util.List;

@RestController
@RequestMapping("/api/quais")
public class QuaiController {
    private final QuaiService service;
    public QuaiController(QuaiService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Quai>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping
    public ResponseEntity<Quai> creer(@Valid @RequestBody QuaiRequest request) {
        return ResponseEntity.ok(service.creerQuai(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quai> modifier(@PathVariable Long id, @Valid @RequestBody QuaiRequest request) {
        return ResponseEntity.ok(service.updateQuai(id, request));
    }
}