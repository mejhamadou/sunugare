package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Chauffeur;

import java.util.List;


public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    @Query("SELECT c FROM Chauffeur c WHERE (:compagnieId IS NULL OR c.compagnie.id = :compagnieId)")
    List<Chauffeur> rechercherChauffeurs(@Param("compagnieId") Long compagnieId);

}