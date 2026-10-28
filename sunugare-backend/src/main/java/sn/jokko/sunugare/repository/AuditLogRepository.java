package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.AuditLog;

import java.util.List;


public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
            "(:action IS NULL OR a.action = :action) AND " +
            "(:email IS NULL OR LOWER(a.utilisateurEmail) LIKE LOWER(CONCAT('%', :email, '%'))) " +
            "ORDER BY a.dateAction DESC")
    List<AuditLog> rechercherLogs(@Param("action") String action, @Param("email") String email);
}
