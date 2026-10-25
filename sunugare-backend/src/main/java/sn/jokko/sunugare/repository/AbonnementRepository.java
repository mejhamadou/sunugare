package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Abonnement;


public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
}