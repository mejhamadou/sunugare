package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.TerminalRequest;
import sn.jokko.sunugare.entity.Terminal;
import sn.jokko.sunugare.service.TerminalService;

import java.util.List;

@RestController
@RequestMapping("/api/terminaux")
public class TerminalController {
    private final TerminalService service;
    public TerminalController(TerminalService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Terminal>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping
    public ResponseEntity<Terminal> creer(@Valid @RequestBody TerminalRequest request) {
        return ResponseEntity.ok(service.creerTerminal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Terminal> modifier(@PathVariable Long id, @Valid @RequestBody TerminalRequest request) {
        return ResponseEntity.ok(service.updateTerminal(id, request));
    }
}