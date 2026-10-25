package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.repository.BilletRepository;
import sn.jokko.sunugare.repository.PaiementRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IntelligenceService {

    private final VoyageRepository voyageRepo;
    private final BilletRepository billetRepo;
    private final PaiementRepository paiementRepo;

    public IntelligenceService(VoyageRepository voyageRepo, BilletRepository billetRepo, PaiementRepository paiementRepo) {
        this.voyageRepo = voyageRepo;
        this.billetRepo = billetRepo;
        this.paiementRepo = paiementRepo;
    }

    public List<Map<String, Object>> optimiserQuais() {
        List<Object[]> stats = voyageRepo.countVoyagesParQuaiAujourdhui();
        List<Map<String, Object>> recommandations = new ArrayList<>();

        for (Object[] row : stats) {
            String numeroQuai = (String) row[0];
            Long nbVoyages = ((Number) row[1]).longValue(); // ✅ Cast sécurisé

            if (nbVoyages > 3) {
                Map<String, Object> reco = new HashMap<>();
                reco.put("quai", numeroQuai);
                reco.put("statut", "SURCHARGE");
                reco.put("message", "Le quai " + numeroQuai + " gère " + nbVoyages + " voyages aujourd'hui. Il est recommandé de réaffecter les prochains départs vers des quais moins occupés.");
                recommandations.add(reco);
            }
        }
        return recommandations;
    }

    public List<Map<String, Object>> analyserTendances() {
        List<Object[]> stats = billetRepo.countBilletsParJourSemaine();
        String[] jours = {"", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};
        List<Map<String, Object>> tendances = new ArrayList<>();

        for (Object[] row : stats) {
            Integer jourNum = ((Number) row[0]).intValue();
            Long total = ((Number) row[1]).longValue();

            Map<String, Object> tendance = new HashMap<>();
            tendance.put("jour", jours[jourNum]);
            tendance.put("totalBillets", total);
            tendances.add(tendance);
        }
        return tendances;
    }

    public List<String> genererRecommandations() {
        List<String> conseils = new ArrayList<>();

        long total = billetRepo.count();
        long annules = billetRepo.countByStatut("ANNULE");

        if (total > 0) {
            double tauxAnnulation = ((double) annules / total) * 100;
            if (tauxAnnulation > 10) {
                conseils.add("⚠️ Alerte : Le taux d'annulation est de " + String.format("%.1f", tauxAnnulation) + "%. Il serait judicieux de revoir la politique de remboursement ou de vérifier les retards fréquents.");
            } else {
                conseils.add("✅ Le taux d'annulation est faible (" + String.format("%.1f", tauxAnnulation) + "%). La gestion des ventes est saine.");
            }
        }

        Double wave = paiementRepo.sumMontantByMethode("WAVE");
        Double om = paiementRepo.sumMontantByMethode("ORANGE_MONEY");
        Double especes = paiementRepo.sumMontantByMethode("ESPECES");

        double totalMobile = (wave != null ? wave : 0) + (om != null ? om : 0);
        double totalEspeces = especes != null ? especes : 0;

        if (totalMobile > totalEspeces) {
            conseils.add("📱 La majorité de vos encaissements se font via Mobile Money. Continuez à encourager ce mode de paiement pour réduire les risques liés aux espèces.");
        } else {
            conseils.add("💵 Les paiements en espèces dominent encore. Une campagne de promotion pour Wave et Orange Money pourrait fluidifier la caisse.");
        }

        return conseils;
    }

    public List<Map<String, Object>> suggererTarification() {
        List<Map<String, Object>> suggestions = new ArrayList<>();

        // Exemple de règle métier simple (en attendant un vrai modèle ML) :
        // Si plus de 80% des billets d'un voyage sont vendus, on suggère d'augmenter le prix du prochain

        List<Voyage> prochainsVoyages = voyageRepo.findAll().stream()
                .filter(v -> v.getStatut().equals("PLANIFIE"))
                .toList();

        for (Voyage v : prochainsVoyages) {
            long billetsVendus = billetRepo.findAll().stream().filter(b -> b.getVoyage().getId().equals(v.getId())).count();
            int capacite = v.getVehicule().getCapacite();

            if (billetsVendus >= capacite * 0.8) {
                Map<String, Object> reco = new HashMap<>();
                reco.put("voyage", v.getLigne().getVilleDepart().getNom() + " -> " + v.getLigne().getVilleArrivee().getNom());
                reco.put("message", "Ce voyage est rempli à " + (billetsVendus * 100 / capacite) + "%. Augmentez le prix de 20% pour maximiser les recettes.");
                suggestions.add(reco);
            }
        }
        return suggestions;
    }

}