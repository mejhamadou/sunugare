package sn.jokko.sunugare.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.AuthResponse;
import sn.jokko.sunugare.dto.LoginRequest;
import sn.jokko.sunugare.dto.RegisterRequest;
import sn.jokko.sunugare.entity.Role;
import sn.jokko.sunugare.entity.User;
import sn.jokko.sunugare.repository.RoleRepository;
import sn.jokko.sunugare.repository.UserRepository;
import sn.jokko.sunugare.security.JwtService;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // --- INSCRIPTION ---
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé !");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        Role defaultRole = roleRepository.findByName("ROLE_AGENT")
                .orElseThrow(() -> new RuntimeException("Erreur : Le rôle par défaut n'existe pas."));

        user.setRoles(Set.of(defaultRole));
        userRepository.save(user);
    }

    // --- CONNEXION ---
    public AuthResponse login(LoginRequest request) {
        // 1. Vérifier l'email et le mot de passe via Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Si on arrive ici, c'est que les identifiants sont bons.
        // On récupère l'utilisateur et on génère le token
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String jwtToken = jwtService.generateToken(user.getEmail());

        // 3. On récupère le premier rôle de l'utilisateur
        String userRole = user.getRoles().iterator().next().getName();
        return new AuthResponse(jwtToken, user.getEmail(), userRole);
    }
}