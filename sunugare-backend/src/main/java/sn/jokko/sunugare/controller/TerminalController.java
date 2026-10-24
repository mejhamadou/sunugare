package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.entity.Terminal;
import sn.jokko.sunugare.service.TerminalService;

import java.util.List;

@RestController
@RequestMapping("/api/Terminals")
public class TerminalController {
    private final TerminalService service;

    public TerminalController(TerminalService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Terminal>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}