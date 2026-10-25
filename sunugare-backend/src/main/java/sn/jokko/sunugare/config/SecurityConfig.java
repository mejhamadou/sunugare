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
                .cors(org.springframework.security.config.Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 1. ROUTES PUBLIQUES (Sans authentification)
                        .requestMatchers("/api/auth/**", "/api/health", "/actuator/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/voyages/public/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/billets/public/reserver").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/billets/*/qrcode", "/api/billets/*/pdf").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/colis/suivi/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/avis/billet/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/avis").permitAll()

                        // 2. ✅ LA ROUTE DE RECHERCHE (Priorité absolue)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/billets/recherche-filtres").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")

                        // 3. AUTRES ROUTES BILLETS (Export, GetAll, Valider, Annuler)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/billets", "/api/billets/export").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/billets", "/api/billets/valider", "/api/bagages/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/billets/*/annuler").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")

                        // 4. ROUTES ADMINISTRATION
                        .requestMatchers("/api/utilisateurs/**", "/api/vehicules/**", "/api/chauffeurs/**", "/api/terminaux/**", "/api/audit/**", "/api/abonnements/**", "/api/dashboard/export-csv").hasAnyAuthority("ROLE_ADMIN", "ROLE_RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/voyages", "/api/lignes/**", "/api/quais/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/voyages/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/voyages", "/api/planning").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT", "ROLE_RESPONSABLE")
                        .requestMatchers("/api/ia/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_RESPONSABLE")

                        // 5. TOUT LE RESTE
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