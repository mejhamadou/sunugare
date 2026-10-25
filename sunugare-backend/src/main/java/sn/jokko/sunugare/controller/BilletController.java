package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.dto.BilletRequest;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.Paiement;
import sn.jokko.sunugare.repository.PaiementRepository;
import sn.jokko.sunugare.service.AbonnementService;
import sn.jokko.sunugare.service.BilletService;
import sn.jokko.sunugare.service.PdfService;
import sn.jokko.sunugare.service.QrCodeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billets")
public class BilletController {
    private final BilletService service;
    private final QrCodeService qrCodeService;
    private final PdfService pdfService;
    private final PaiementRepository paiementRepository;
    private final AbonnementService abonnementService;

    public BilletController(BilletService service, QrCodeService qrCodeService, PdfService pdfService, PaiementRepository paiementRepository, AbonnementService abonnementService) {
        this.service = service;
        this.qrCodeService = qrCodeService;
        this.pdfService = pdfService;
        this.paiementRepository = paiementRepository;
        this.abonnementService = abonnementService;
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
            String code = request.get("numeroBillet");
            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le code est requis"));
            }

            // ✅ Si c'est un abonnement
            if (code.startsWith("ABO-")) {
                var abonnement = abonnementService.validerAbonnement(code);
                // On crée un objet factice pour renvoyer les infos au frontend
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("nomPassager", abonnement.getNomPassager());
                response.put("numeroSiege", "Abonnement");
                response.put("numeroBillet", abonnement.getCodeAbonnement());
                response.put("voyage", Map.of("ligne", Map.of(
                        "villeDepart", Map.of("nom", abonnement.getLigne().getVilleDepart().getNom()),
                        "villeArrivee", Map.of("nom", abonnement.getLigne().getVilleArrivee().getNom())
                )));
                return ResponseEntity.ok(response);
            }

            // ✅ Sinon, c'est un billet normal
            Billet billet = service.validerBillet(code);
            return ResponseEntity.ok(billet);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getPdf(@PathVariable Long id) {
        try {
            Billet billet = service.getById(id);
            // On cherche le paiement associé (s'il existe)
            Paiement paiement = paiementRepository.findAll().stream()
                    .filter(p -> p.getBillet().getId().equals(id))
                    .findFirst().orElse(null);

            byte[] pdf = pdfService.genererBilletPdf(billet, paiement);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=billet_" + billet.getNumeroBillet() + ".pdf")
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<?> annuler(@PathVariable Long id, java.security.Principal principal) {
        try {
            Billet billet = service.annulerBillet(id, principal.getName());
            return ResponseEntity.ok(billet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/public/reserver")
    public ResponseEntity<?> reserverEnLigne(@Valid @RequestBody BilletRequest request) {
        try {
            Billet billet = service.vendreBillet(request);
            // On change le statut pour dire que c'est une réservation en ligne
            billet.setStatut("RESERVE_EN_LIGNE");
            // On sauvegarde (il faudra une méthode save dans le service)

            return ResponseEntity.ok(billet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}