package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.entity.Quai;
import sn.jokko.sunugare.service.QuaiService;

import java.util.List;

@RestController
@RequestMapping("/api/quais")
public class QuaiController {
    private final QuaiService service;

    public QuaiController(QuaiService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Quai>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}