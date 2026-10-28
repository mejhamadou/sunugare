package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.AuditLog;
import sn.jokko.sunugare.repository.AuditLogRepository;

import java.util.List;

@Service
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String action, String entite, Long entiteId, String email, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntite(entite);
        log.setEntiteId(entiteId);
        log.setUtilisateurEmail(email);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> rechercher(String action, String email) {
        return auditLogRepository.rechercherLogs(
                (action != null && !action.isEmpty()) ? action : null,
                (email != null && !email.isEmpty()) ? email : null
        );
    }

    public String exporterCsv(List<AuditLog> logs) {
        StringBuilder csv = new StringBuilder("Date;Utilisateur;Action;Entite;Details\n");
        for (AuditLog log : logs) {
            csv.append(log.getDateAction()).append(";")
                    .append(log.getUtilisateurEmail()).append(";")
                    .append(log.getAction()).append(";")
                    .append(log.getEntite()).append(";")
                    .append(log.getDetails() != null ? log.getDetails().replace("\n", " ") : "").append("\n");
        }
        return csv.toString();
    }
}