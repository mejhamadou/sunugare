package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Ligne;


public interface LigneRepository extends JpaRepository<Ligne, Long> {
}