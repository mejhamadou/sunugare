package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.jokko.sunugare.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}