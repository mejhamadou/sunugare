package sn.jokko.sunugare.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.UserRequest;
import sn.jokko.sunugare.entity.Role;
import sn.jokko.sunugare.entity.User;
import sn.jokko.sunugare.repository.GareRepository;
import sn.jokko.sunugare.repository.RoleRepository;
import sn.jokko.sunugare.repository.UserRepository;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final GareRepository gareRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, GareRepository gareRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.gareRepository = gareRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Le mot de passe est obligatoire.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Rôle introuvable"));
        user.setRoles(Set.of(role));

        // ✅ LA LIGNE MAGIQUE :
        if (request.getGareId() != null) {
            user.setGare(gareRepository.findById(request.getGareId()).orElse(null));
        }

        return userRepository.save(user);
    }

    public User toggleStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // On inverse le statut (actif -> inactif, inactif -> actif)
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Mise à jour des infos de base
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // Si on a fourni un nouveau mot de passe, on le met à jour
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Mise à jour du rôle
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Rôle introuvable"));
        user.setRoles(Set.of(role));

        if (request.getGareId() != null) {
            user.setGare(gareRepository.findById(request.getGareId()).orElse(null));
        } else {
            user.setGare(null);
        }

        return userRepository.save(user);
    }
}