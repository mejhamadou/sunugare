package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Compagnie;

public interface CompagnieRepository extends JpaRepository<Compagnie, Long> {
}