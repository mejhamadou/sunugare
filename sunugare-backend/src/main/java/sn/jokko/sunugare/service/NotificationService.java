package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.repository.BilletRepository;

import java.util.List;

@Service
public class NotificationService {

    private final BilletRepository billetRepository;

    public NotificationService(BilletRepository billetRepository) {
        this.billetRepository = billetRepository;
    }

    public void envoyerSmsRetard(Voyage voyage, int minutes) {
        // 1. On récupère tous les billets pour ce voyage
        List<Billet> billets = billetRepository.findAll().stream()
                .filter(b -> b.getVoyage().getId().equals(voyage.getId()))
                .toList();

        if (billets.isEmpty()) return;

        // 2. On simule l'envoi d'un SMS à chaque passager
        String message = "SUNUGARE : Votre voyage " + voyage.getLigne().getVilleDepart().getNom() +
                " -> " + voyage.getLigne().getVilleArrivee().getNom() +
                " a un retard de " + minutes + " minutes. Merci de votre compréhension.";

        for (Billet billet : billets) {
            if (billet.getTelephonePassager() != null && !billet.getTelephonePassager().isEmpty()) {
                // 🛑 C'EST ICI QU'ON METTRA L'API DE SMS PLUS TARD
                System.out.println("📱 [SIMULATION SMS] Envoi à " + billet.getTelephonePassager() + " : " + message);
            }
        }
    }
}