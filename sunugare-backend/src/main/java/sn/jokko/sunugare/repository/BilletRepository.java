package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.jokko.sunugare.entity.Billet;

public interface BilletRepository extends JpaRepository<Billet, Long> {
    boolean existsByVoyageIdAndNumeroSiege(Long voyageId, Integer numeroSiege);

    // Calcule la somme totale des billets vendus
    @Query("SELECT SUM(b.voyage.prix) FROM Billet b")
    Double sumTotalRecettes();

    java.util.Optional<Billet> findByNumeroBillet(String numeroBillet);
}