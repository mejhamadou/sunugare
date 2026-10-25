package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.jokko.sunugare.entity.Billet;

import java.util.List;

public interface BilletRepository extends JpaRepository<Billet, Long> {
    boolean existsByVoyageIdAndNumeroSiege(Long voyageId, Integer numeroSiege);

    // Calcule la somme totale des billets vendus
    @Query("SELECT SUM(b.voyage.prix) FROM Billet b")
    Double sumTotalRecettes();

    java.util.Optional<Billet> findByNumeroBillet(String numeroBillet);

    @Query(value = "SELECT CAST(date_emission AS DATE), COUNT(*) FROM billets GROUP BY CAST(date_emission AS DATE) ORDER BY CAST(date_emission AS DATE) DESC LIMIT 7", nativeQuery = true)
    List<Object[]> countBilletsParJour();

    @Query("SELECT b FROM Billet b WHERE b.voyage.quai.terminal.gare.id = :gareId")
    List<Billet> findAllByGareId(Long gareId);
}