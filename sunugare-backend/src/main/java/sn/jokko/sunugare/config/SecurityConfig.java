package sn.jokko.sunugare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import sn.jokko.sunugare.security.CustomUserDetailsService;
import sn.jokko.sunugare.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Routes publiques
                        .requestMatchers("/api/auth/**", "/api/health", "/actuator/**", "/api/billets/*/qrcode", "/api/billets/*/pdf").permitAll()

                        // ✅ Routes publiques pour la réservation en ligne
                        .requestMatchers(HttpMethod.GET, "/api/voyages/public/**", "/api/gares/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/billets/public/reserver").permitAll()

                        // Routes accessibles à tous les utilisateurs connectés
                        .requestMatchers(HttpMethod.GET, "/api/voyages/**", "/api/billets/**", "/api/gares/**", "/api/planning/**", "/api/bagages/**", "/api/abonnements/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")
                        .requestMatchers(HttpMethod.POST, "/api/billets", "/api/billets/valider").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")

                        // ✅ Routes réservées aux Admins et Responsables (Création de voyages, gares, véhicules, utilisateurs...)
                        .requestMatchers("/api/voyages/**", "/api/utilisateurs/**", "/api/vehicules/**", "/api/chauffeurs/**", "/api/terminaux/**", "/api/quais/**", "/api/lignes/**", "/api/abonnements/**" ).hasAnyAuthority("ROLE_ADMIN", "ROLE_RESPONSABLE")

                        // Tout le reste nécessite au moins d'être connecté
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // On utilise notre classe
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}