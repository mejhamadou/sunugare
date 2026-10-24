package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Ville;

public interface VilleRepository extends JpaRepository<Ville, Long> {
}