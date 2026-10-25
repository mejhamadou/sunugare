package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Chauffeur;
import sn.jokko.sunugare.entity.Vehicule;

import java.time.LocalDate;

@Service
public class ConformiteService {

    // Vérifie si un véhicule est en règle
    public void verifierConformiteVehicule(Vehicule v) {
        if (Boolean.TRUE.equals(v.getConformiteValideeManuellement())) return; // Si dérogation, on passe

        LocalDate aujourdhui = LocalDate.now();
        if (v.getDateExpirationAssurance() != null && v.getDateExpirationAssurance().isBefore(aujourdhui)) {
            throw new RuntimeException("Conformité refusée : L'assurance du véhicule " + v.getImmatriculation() + " est expirée.");
        }
        if (v.getDateExpirationCarteGrise() != null && v.getDateExpirationCarteGrise().isBefore(aujourdhui)) {
            throw new RuntimeException("Conformité refusée : La carte grise du véhicule " + v.getImmatriculation() + " est expirée.");
        }
    }

    // Vérifie si un chauffeur est en règle
    public void verifierConformiteChauffeur(Chauffeur c) {
        if (Boolean.TRUE.equals(c.getConformiteValideeManuellement())) return;

        LocalDate aujourdhui = LocalDate.now();
        if (c.getDateExpirationPermis() != null && c.getDateExpirationPermis().isBefore(aujourdhui)) {
            throw new RuntimeException("Conformité refusée : Le permis de " + c.getPrenom() + " " + c.getNom() + " est expiré.");
        }
    }
}