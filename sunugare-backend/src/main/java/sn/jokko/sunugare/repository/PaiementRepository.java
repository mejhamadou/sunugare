package sn.jokko.sunugare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.jokko.sunugare.entity.Paiement;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    // Calcule le total des recettes par méthode de paiement (ex: WAVE = 50000 FCFA)
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.methode = :methode AND p.statut = 'REUSSI'")
    Double sumMontantByMethode(String methode);
}