package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.jokko.sunugare.entity.AuditLog;
import sn.jokko.sunugare.service.AuditService;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {
    private final AuditService service;

    public AuditController(AuditService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(service.getAllLogs());
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<AuditLog>> rechercher(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(service.rechercher(action, email));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterCsv() {
        List<AuditLog> logs = service.getAllLogs();
        String csvData = service.exporterCsv(logs);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=journal_audit.csv")
                .body(csvData.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}