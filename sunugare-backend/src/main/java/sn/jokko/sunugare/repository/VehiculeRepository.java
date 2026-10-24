package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Vehicule;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
}