package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.VoyageRequest;
import sn.jokko.sunugare.entity.*;
import sn.jokko.sunugare.repository.*;

import java.util.List;

@Service
public class VoyageService {
    private final VoyageRepository voyageRepo;
    private final LigneRepository ligneRepo;
    private final VehiculeRepository vehiculeRepo;
    private final ChauffeurRepository chauffeurRepo;
    private final QuaiRepository quaiRepo;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ConformiteService conformiteService;

    public VoyageService(VoyageRepository voyageRepo, LigneRepository ligneRepo, VehiculeRepository vehiculeRepo, ChauffeurRepository chauffeurRepo, QuaiRepository quaiRepo, NotificationService notificationService, UserRepository userRepository) {
        this.voyageRepo = voyageRepo;
        this.ligneRepo = ligneRepo;
        this.vehiculeRepo = vehiculeRepo;
        this.chauffeurRepo = chauffeurRepo;
        this.quaiRepo = quaiRepo;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.conformiteService = new ConformiteService();

    }

    public Voyage creerVoyage(VoyageRequest req) {
        Ligne ligne = ligneRepo.findById(req.getLigneId()).orElseThrow(() -> new RuntimeException("Ligne introuvable"));
        Vehicule vehicule = vehiculeRepo.findById(req.getVehiculeId()).orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
        Chauffeur chauffeur = chauffeurRepo.findById(req.getChauffeurId()).orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));
        Quai quai;
        if (req.getQuaiId() != null) {
            quai = quaiRepo.findById(req.getQuaiId()).orElseThrow();
        } else {
            // ✅ Algorithme d'assignation automatique
            quai = trouverQuaiDisponible(req.getDateDepart());
        }

        // ✅ C'EST ICI QU'ON BLOQUE SI CE N'EST PAS CONFORME
        conformiteService.verifierConformiteVehicule(vehicule);
        conformiteService.verifierConformiteChauffeur(chauffeur);

        Voyage v = new Voyage();
        v.setLigne(ligne);
        v.setVehicule(vehicule);
        v.setChauffeur(chauffeur);
        v.setQuai(quai);
        v.setDateDepart(req.getDateDepart());
        v.setPrix(req.getPrix());
        v.setStatut("PLANIFIE");

        return voyageRepo.save(v);
    }

    private Quai trouverQuaiDisponible(java.time.LocalDateTime dateDepart) {
        List<Quai> tousLesQuais = quaiRepo.findAll();
        List<Voyage> voyagesCeJour = voyageRepo.findAll().stream()
                .filter(v -> v.getDateDepart().toLocalDate().equals(dateDepart.toLocalDate()))
                .toList();

        for (Quai quai : tousLesQuais) {
            boolean estOccupe = voyagesCeJour.stream().anyMatch(v -> {
                if (!v.getQuai().getId().equals(quai.getId())) return false;
                // On considère qu'un quai est occupé 2h avant et après le départ
                long diffEnMinutes = Math.abs(java.time.Duration.between(v.getDateDepart(), dateDepart).toMinutes());
                return diffEnMinutes < 120;
            });

            if (!estOccupe) {
                return quai;
            }
        }
        throw new RuntimeException("Aucun quai disponible sur ce créneau horaire.");
    }

    public List<Voyage> getAll() {
        return voyageRepo.findAll();
    }

    public Voyage changerStatut(Long voyageId, String nouveauStatut) {
        Voyage voyage = voyageRepo.findById(voyageId)
                .orElseThrow(() -> new RuntimeException("Voyage introuvable"));

        // On vérifie que le statut est valide
        List<String> statutsValides = List.of("PLANIFIE", "EMBARQUEMENT", "DEPART", "ARRIVE", "ANNULE");
        if (!statutsValides.contains(nouveauStatut)) {
            throw new RuntimeException("Statut invalide");
        }

        voyage.setStatut(nouveauStatut);
        return voyageRepo.save(voyage);
    }

    public Voyage signalerRetard(Long voyageId, Integer minutes) {
        Voyage voyage = voyageRepo.findById(voyageId)
                .orElseThrow(() -> new RuntimeException("Voyage introuvable"));

        voyage.setRetardMinutes(minutes);
        Voyage voyageMisAJour = voyageRepo.save(voyage);

        // ✅ On déclenche la notification
        if (minutes > 0) {
            notificationService.envoyerSmsRetard(voyageMisAJour, minutes);
        }

        return voyageMisAJour;
    }

    public List<Voyage> getAllVoyagesPourUtilisateur(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        // Si c'est un ADMIN, il voit tout
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return voyageRepo.findAll();
        }

        // Si l'utilisateur a une gare, il ne voit que les voyages de sa gare
        if (user.getGare() != null) {
            return voyageRepo.findAllByGareId(user.getGare().getId());
        }

        // Pas de gare = ne voit rien
        return List.of();
    }

    public List<Voyage> getVoyagesPourPublic() {
        // On renvoie tous les voyages qui ne sont ni terminés, ni annulés
        return voyageRepo.findAll().stream()
                .filter(v -> v.getStatut().equals("PLANIFIE") || v.getStatut().equals("EMBARQUEMENT"))
                .toList();
    }

}