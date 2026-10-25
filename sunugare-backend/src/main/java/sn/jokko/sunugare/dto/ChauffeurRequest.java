package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ChauffeurRequest {
    @NotBlank(message = "Le prenom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String telephone;

    @NotBlank(message = "Le permis du chauffeur est obligatoire")
    private String numeroPermis;

    @NotNull(message = "L'ID de la compagnie est obligatoire")
    private Long compagnieId;

    private java.time.LocalDate dateExpirationPermis;
    private Boolean conformiteValideeManuellement = false;

    // Getters et Setters...
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getNumeroPermis() { return numeroPermis; }
    public void setNumeroPermis(String numeroPermis) { this.numeroPermis = numeroPermis; }
    public Long getCompagnieId() { return compagnieId; }
    public void setCompagnieId(Long compagnieId) { this.compagnieId = compagnieId; }
    public LocalDate getDateExpirationPermis() {return dateExpirationPermis;}
    public void setDateExpirationPermis(LocalDate dateExpirationPermis) {this.dateExpirationPermis = dateExpirationPermis;}
}