package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Voyage;

public interface VoyageRepository extends JpaRepository<Voyage, Long> {
    // Compte le nombre de voyages planifiés
    long countByStatut(String statut);
}