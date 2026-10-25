package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Avis;

import java.util.Optional;

public interface AvisRepository extends JpaRepository<Avis, Long> {
    // ✅ Ajout de la méthode pour chercher un avis par l'ID du billet
    Optional<Avis> findByBilletId(Long billetId);
}