package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Billet;

import java.time.LocalDateTime;
import java.util.List;

public interface BilletRepository extends JpaRepository<Billet, Long> {
    boolean existsByVoyageIdAndNumeroSiege(Long voyageId, Integer numeroSiege);

    // Calcule la somme totale des billets vendus
    @Query("SELECT SUM(b.voyage.prix) FROM Billet b")
    Double sumTotalRecettes();

    java.util.Optional<Billet> findByNumeroBillet(String numeroBillet);
    long countByStatut(String statut);

    @Query(value = "SELECT CAST(date_emission AS DATE), COUNT(*) FROM billets GROUP BY CAST(date_emission AS DATE) ORDER BY CAST(date_emission AS DATE) DESC LIMIT 7", nativeQuery = true)
    List<Object[]> countBilletsParJour();

    @Query("SELECT b FROM Billet b WHERE b.voyage.quai.terminal.gare.id = :gareId")
    List<Billet> findAllByGareId(Long gareId);

    @Query("SELECT b FROM Billet b WHERE " +
            "(:nom IS NULL OR LOWER(b.nomPassager) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
            "(:statut IS NULL OR b.statut = :statut) AND " +
            "(CAST(:dateDebut AS timestamp) IS NULL OR b.dateEmission >= :dateDebut) AND " +
            "(CAST(:dateFin AS timestamp) IS NULL OR b.dateEmission <= :dateFin)")
    List<Billet> rechercherBillets(
            @Param("nom") String nom,
            @Param("statut") String statut,
            @Param("dateDebut") java.time.LocalDateTime dateDebut,
            @Param("dateFin") java.time.LocalDateTime dateFin
    );

    @Query("SELECT COUNT(b) FROM Billet b WHERE " +
            "(CAST(:dateDebut AS timestamp) IS NULL OR b.dateEmission >= :dateDebut) AND " +
            "(CAST(:dateFin AS timestamp) IS NULL OR b.dateEmission <= :dateFin)")
    long countBilletsByDate(@Param("dateDebut") java.time.LocalDateTime dateDebut, @Param("dateFin") java.time.LocalDateTime dateFin);

    // Compte les billets vendus par jour de la semaine (1 = Lundi, 7 = Dimanche)
    @Query(value = "SELECT EXTRACT(ISODOW FROM date_emission) as jour, COUNT(*) FROM billets GROUP BY jour ORDER BY COUNT(*) DESC", nativeQuery = true)
    List<Object[]> countBilletsParJourSemaine();
}