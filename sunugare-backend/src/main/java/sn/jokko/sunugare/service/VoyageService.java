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
    private final AuditService auditService;
    private final AvisService avisService;

    public VoyageService(VoyageRepository voyageRepo, LigneRepository ligneRepo, VehiculeRepository vehiculeRepo, ChauffeurRepository chauffeurRepo, QuaiRepository quaiRepo, NotificationService notificationService, UserRepository userRepository, AuditService auditService, AvisService avisService) {
        this.voyageRepo = voyageRepo;
        this.ligneRepo = ligneRepo;
        this.vehiculeRepo = vehiculeRepo;
        this.chauffeurRepo = chauffeurRepo;
        this.quaiRepo = quaiRepo;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.conformiteService = new ConformiteService();
        this.auditService = auditService;
        this.avisService = avisService;

    }

    public Voyage creerVoyage(VoyageRequest req, String email) {
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
        v.setMultiplicateurPrix(req.getMultiplicateurPrix() != null ? req.getMultiplicateurPrix() : 1.0);

        // ✅ On sauvegarde d'abord pour générer l'ID
        Voyage voyageSauvegarde = voyageRepo.save(v);

        // ✅ On log l'action avec la variable correcte
        auditService.logAction(
                "CREATION_VOYAGE",
                "Voyage",
                voyageSauvegarde.getId(), // L'ID du voyage qui vient d'être créé
                email,
                "Voyage créé : " + ligne.getVilleDepart().getNom() + " -> " + ligne.getVilleArrivee().getNom()
        );

        return voyageSauvegarde;
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
        Voyage voyage = voyageRepo.findById(voyageId).orElseThrow();
        voyage.setStatut(nouveauStatut);
        Voyage voyageMaj = voyageRepo.save(voyage);

        // ✅ Si le bus est ARRIVÉ, on demande les avis
        if (nouveauStatut.equals("ARRIVE")) {
            avisService.demanderAvisPourVoyage(voyageId);
        }
        return voyageMaj;
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

    public List<Voyage> rechercherVoyages(String statut, java.time.LocalDate dateDebut, java.time.LocalDate dateFin) {
        java.time.LocalDateTime debut = dateDebut != null ? dateDebut.atStartOfDay() : null;
        java.time.LocalDateTime fin = dateFin != null ? dateFin.atTime(23, 59, 59) : null;
        return voyageRepo.rechercherVoyages(
                (statut != null && !statut.isEmpty()) ? statut : null,
                debut, fin
        );
    }

    public String exporterVoyagesCsv(List<Voyage> voyages) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID;Ligne;Date Depart;Quai;Bus;Chauffeur;Prix;Statut\n");

        for (Voyage v : voyages) {
            csv.append(v.getId()).append(";")
                    .append(v.getLigne().getVilleDepart().getNom()).append(" -> ").append(v.getLigne().getVilleArrivee().getNom()).append(";")
                    .append(v.getDateDepart()).append(";")
                    .append(v.getQuai().getNumero()).append(";")
                    .append(v.getVehicule().getImmatriculation()).append(";")
                    .append(v.getChauffeur().getPrenom()).append(";")
                    .append(v.getPrix()).append(";")
                    .append(v.getStatut()).append("\n");
        }
        return csv.toString();
    }

}