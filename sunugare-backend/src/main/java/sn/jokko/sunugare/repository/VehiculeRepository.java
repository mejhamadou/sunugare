package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.jokko.sunugare.entity.Vehicule;

import java.util.List;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {

    @Query("SELECT v FROM Vehicule v WHERE (:compagnieId IS NULL OR v.compagnie.id = :compagnieId)")
    List<Vehicule> rechercherVehicules(@Param("compagnieId") Long compagnieId);

    
}