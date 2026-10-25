package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Colis;

import java.util.Optional;

public interface ColisRepository extends JpaRepository<Colis, Long> {
    Optional<Colis> findByCodeSuivi(String codeSuivi);
}