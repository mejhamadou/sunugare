package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GareRequest {
    @NotBlank(message = "Le nom de la gare est obligatoire")
    private String nom;
    private String adresse;

    @NotNull(message = "L'ID de la ville est obligatoire")
    private Long villeId;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public Long getVilleId() { return villeId; }
    public void setVilleId(Long villeId) { this.villeId = villeId; }
}