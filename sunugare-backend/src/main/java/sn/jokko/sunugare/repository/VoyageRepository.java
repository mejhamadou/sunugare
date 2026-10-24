package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.jokko.sunugare.entity.Voyage;

import java.util.List;

public interface VoyageRepository extends JpaRepository<Voyage, Long> {
    // Compte le nombre de voyages planifiés
    long countByStatut(String statut);

    @Query(value = "SELECT CAST(date_depart AS DATE), COUNT(*) FROM voyages GROUP BY CAST(date_depart AS DATE) ORDER BY CAST(date_depart AS DATE) DESC LIMIT 7", nativeQuery = true)
    List<Object[]> countVoyagesParJour();
}