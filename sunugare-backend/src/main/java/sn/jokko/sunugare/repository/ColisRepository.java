package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Colis;

import java.util.List;
import java.util.Optional;

public interface ColisRepository extends JpaRepository<Colis, Long> {
    Optional<Colis> findByCodeSuivi(String codeSuivi);

    @Query("SELECT c FROM Colis c WHERE (:statut IS NULL OR c.statut = :statut) ORDER BY c.dateCreation DESC")
    List<Colis> rechercherColis(@Param("statut") String statut);
}