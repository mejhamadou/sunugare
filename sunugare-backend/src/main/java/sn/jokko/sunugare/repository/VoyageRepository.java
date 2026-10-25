package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Voyage;

import java.util.List;

public interface VoyageRepository extends JpaRepository<Voyage, Long> {
    // Compte le nombre de voyages planifiés
    long countByStatut(String statut);

    @Query(value = "SELECT CAST(date_depart AS DATE), COUNT(*) FROM voyages GROUP BY CAST(date_depart AS DATE) ORDER BY CAST(date_depart AS DATE) DESC LIMIT 7", nativeQuery = true)
    List<Object[]> countVoyagesParJour();

    // Récupérer les voyages d'une gare spécifique
    @Query("SELECT v FROM Voyage v WHERE v.quai.terminal.gare.id = :gareId")
    List<Voyage> findAllByGareId(Long gareId);

    @Query("SELECT v FROM Voyage v WHERE " +
            "(:statut IS NULL OR v.statut = :statut) AND " +
            "(CAST(:dateDebut AS timestamp) IS NULL OR v.dateDepart >= :dateDebut) AND " +
            "(CAST(:dateFin AS timestamp) IS NULL OR v.dateDepart <= :dateFin)")
    List<Voyage> rechercherVoyages(
            @Param("statut") String statut,
            @Param("dateDebut") java.time.LocalDateTime dateDebut,
            @Param("dateFin") java.time.LocalDateTime dateFin
    );

    @Query("SELECT v.quai.numero, COUNT(v) FROM Voyage v WHERE CAST(v.dateDepart AS date) = CURRENT_DATE GROUP BY v.quai.numero")
    List<Object[]> countVoyagesParQuaiAujourdhui();

}