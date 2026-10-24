package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.Terminal;


public interface TerminalRepository extends JpaRepository<Terminal, Long> {
}