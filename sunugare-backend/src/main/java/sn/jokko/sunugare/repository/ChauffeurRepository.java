package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Chauffeur;


public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
}