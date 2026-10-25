package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Paiement;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    // Calcule le total des recettes par méthode de paiement (ex: WAVE = 50000 FCFA)
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.methode = :methode AND p.statut = 'REUSSI'")
    Double sumMontantByMethode(String methode);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.methode = :methode AND p.statut = 'REUSSI' AND " +
            "(CAST(:dateDebut AS timestamp) IS NULL OR p.datePaiement >= :dateDebut) AND " +
            "(CAST(:dateFin AS timestamp) IS NULL OR p.datePaiement <= :dateFin)")
    Double sumMontantByMethodeAndDate(
            @Param("methode") String methode,
            @Param("dateDebut") java.time.LocalDateTime dateDebut,
            @Param("dateFin") java.time.LocalDateTime dateFin);
}