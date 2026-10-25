package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Avis;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.repository.AvisRepository;
import sn.jokko.sunugare.repository.BilletRepository;

import java.util.List;

@Service
public class AvisService {
    private final AvisRepository avisRepository;
    private final BilletRepository billetRepository;

    public AvisService(AvisRepository avisRepository, BilletRepository billetRepository) {
        this.avisRepository = avisRepository;
        this.billetRepository = billetRepository;
    }

    // 1. Enregistrer un avis
    public Avis laisserAvis(Long billetId, Integer noteChauffeur, Integer noteVehicule, String commentaire) {
        Billet billet = billetRepository.findById(billetId)
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));

        // On vérifie si l'avis n'a pas déjà été laissé
        if (avisRepository.findByBilletId(billetId).isPresent()) {
            throw new RuntimeException("Vous avez déjà laissé un avis pour ce voyage.");
        }

        Avis avis = new Avis();
        avis.setBillet(billet);
        avis.setNoteChauffeur(noteChauffeur);
        avis.setNoteVehicule(noteVehicule);
        avis.setCommentaire(commentaire);

        return avisRepository.save(avis);
    }

    // 2. La méthode qui simule l'envoi WhatsApp quand le bus arrive
    public void demanderAvisPourVoyage(Long voyageId) {
        List<Billet> billets = billetRepository.findAll().stream()
                .filter(b -> b.getVoyage().getId().equals(voyageId))
                .toList();

        for (Billet billet : billets) {
            if (billet.getTelephonePassager() != null && !billet.getTelephonePassager().isEmpty()) {
                // 🛑 ICI on simule l'envoi WhatsApp
                String lien = "http://localhost:3020/avis/" + billet.getId();
                System.out.println("📱 [WHATSAPP SIMULATION] À " + billet.getTelephonePassager() +
                        " : Bonjour " + billet.getNomPassager() + ", votre voyage est terminé ! Donnez votre avis ici : " + lien);
            }
        }
    }
}