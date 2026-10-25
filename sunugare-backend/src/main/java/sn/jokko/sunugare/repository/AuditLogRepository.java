package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.AuditLog;


public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
