package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.BilletRequest;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.service.BilletService;
import sn.jokko.sunugare.service.QrCodeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billets")
public class BilletController {
    private final BilletService service;
    private final QrCodeService qrCodeService;

    public BilletController(BilletService service, QrCodeService qrCodeService) {
        this.service = service;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping
    public ResponseEntity<?> vendre(@Valid @RequestBody BilletRequest request) {
        try {
            Billet billet = service.vendreBillet(request);
            return ResponseEntity.ok(billet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Billet>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        try {
            Billet billet = service.getById(id); // On va l'ajouter dans BilletService
            byte[] image = qrCodeService.genererQrCode(billet.getNumeroBillet(), 250, 250);

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(image);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/valider")
    public ResponseEntity<?> validerBillet(@RequestBody Map<String, String> request) {
        try {
            String numeroBillet = request.get("numeroBillet");
            if (numeroBillet == null || numeroBillet.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le numéro de billet est requis"));
            }
            Billet billet = service.validerBillet(numeroBillet);
            return ResponseEntity.ok(billet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}