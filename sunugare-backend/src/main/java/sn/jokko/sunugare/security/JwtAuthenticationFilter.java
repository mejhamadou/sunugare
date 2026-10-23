package sn.jokko.sunugare.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Récupérer le header "Authorization"
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Si le header est vide ou ne commence pas par "Bearer ", on passe au filtre suivant
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraire le token (on enlève le mot "Bearer " qui fait 7 caractères)
        jwt = authHeader.substring(7);

        try {
            // 4. Extraire l'email depuis le token
            userEmail = jwtService.extractUsername(jwt);

            // 5. Si on a un email et que l'utilisateur n'est pas encore authentifié dans le contexte
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // On charge l'utilisateur depuis la BDD
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // On vérifie si le token est valide
                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    // On crée un objet d'authentification
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // On dit à Spring Security : "Cet utilisateur est authentifié"
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Si le token est invalide ou expiré, on ignore et on laisse passer (Spring Security bloquera si la route est protégée)
        }

        // 6. Passer à la suite
        filterChain.doFilter(request, response);
    }
}