package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Gare;

public interface GareRepository extends JpaRepository<Gare, Long> {
}