package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sn.jokko.sunugare.service.IntelligenceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
public class IntelligenceController {

    private final IntelligenceService intelligenceService;

    public IntelligenceController(IntelligenceService intelligenceService) {
        this.intelligenceService = intelligenceService;
    }
    // 1. Route pour l'optimisation des quais
    @GetMapping("/quais")
    public ResponseEntity<List<Map<String, Object>>> getOptimisationQuais() {
        return ResponseEntity.ok(intelligenceService.optimiserQuais());
    }

    // 2. Route pour l'analyse des tendances
    @GetMapping("/tendances")
    public ResponseEntity<List<Map<String, Object>>> getTendances() {
        return ResponseEntity.ok(intelligenceService.analyserTendances());
    }

    // 3. Route pour l'aide à la décision (recommandations)
    @GetMapping("/recommandations")
    public ResponseEntity<List<String>> getRecommandations() {
        return ResponseEntity.ok(intelligenceService.genererRecommandations());
    }
}