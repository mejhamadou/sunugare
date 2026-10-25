package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.service.AvisService;
import sn.jokko.sunugare.service.BilletService;

import java.util.Map;


@RestController
@RequestMapping("/api/avis")
public class AvisController {
    private final AvisService avisService;
    private final BilletService billetService;

    public AvisController(AvisService avisService, BilletService billetService) {
        this.avisService = avisService;
        this.billetService = billetService;
    }

        @GetMapping("/billet/{billetId}")
        public ResponseEntity<?> getAvisInfo(@PathVariable Long billetId) {
            Billet billet = billetService.getById(billetId);
            return ResponseEntity.ok(billet);
        }

        @PostMapping
        public ResponseEntity<?> laisserAvis(@RequestBody Map<String, Object> request) {
            try {
                Long billetId = Long.valueOf(request.get("billetId").toString());
                Integer noteChauffeur = Integer.valueOf(request.get("noteChauffeur").toString());
                Integer noteVehicule = Integer.valueOf(request.get("noteVehicule").toString());
                String commentaire = request.get("commentaire") != null ? request.get("commentaire").toString() : "";

                avisService.laisserAvis(billetId, noteChauffeur, noteVehicule, commentaire);
                return ResponseEntity.ok(Map.of("message", "Merci pour votre avis !"));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
    }

