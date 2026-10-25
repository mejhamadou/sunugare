package sn.jokko.sunugare.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
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

    // ✅ 1. ROUTES SPÉCIFIQUES (À METTRE EN PREMIER)

    @GetMapping("/recherche-filtres")
    public ResponseEntity<List<Billet>> rechercher(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            java.security.Principal principal) {

        if ((nom == null || nom.isEmpty()) && (statut == null || statut.isEmpty()) && dateDebut == null && dateFin == null) {
            return ResponseEntity.ok(service.getBilletsPourUtilisateur(principal.getName()));
        }
        return ResponseEntity.ok(service.rechercher(nom, statut, dateDebut, dateFin));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterCsv(java.security.Principal principal) {
        List<Billet> billets = service.getBilletsPourUtilisateur(principal.getName());
        String csvData = service.exporterCsv(billets);
        byte[] output = csvData.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=billets_sunugare.csv")
                .body(output);
    }

    // ✅ 2. AUTRES ROUTES

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

    @PostMapping("/valider")
    public ResponseEntity<?> validerBillet(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("numeroBillet");
            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le code est requis"));
            }

            if (code.startsWith("ABO-")) {
                var abonnement = abonnementService.validerAbonnement(code);
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

            Billet billet = service.validerBillet(code);
            return ResponseEntity.ok(billet);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/public/reserver")
    public ResponseEntity<?> reserverEnLigne(@Valid @RequestBody BilletRequest request) {
        try {
            Billet billet = service.vendreBillet(request);
            billet.setStatut("RESERVE_EN_LIGNE");
            return ResponseEntity.ok(billet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ 3. ROUTES DYNAMIQUES AVEC {id} (À METTRE EN DERNIER)

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        try {
            Billet billet = service.getById(id);
            byte[] image = qrCodeService.genererQrCode(billet.getNumeroBillet(), 250, 250);

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(image);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getPdf(@PathVariable Long id) {
        try {
            Billet billet = service.getById(id);
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
}