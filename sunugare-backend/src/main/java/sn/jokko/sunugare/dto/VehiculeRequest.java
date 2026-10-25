package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class VehiculeRequest {
    @NotBlank(message = "L'immatriculation est obligatoire")
    private String immatriculation;
    private String marque;
    @NotNull(message = "La capacité est obligatoire")
    private Integer capacite;
    @NotNull(message = "L'ID de la compagnie est obligatoire")
    private Long compagnieId;

    private java.time.LocalDate dateExpirationAssurance;
    private java.time.LocalDate dateExpirationCarteGrise;
    private Boolean conformiteValideeManuellement = false;

    // Getters et Setters...
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }
    public Long getCompagnieId() { return compagnieId; }
    public void setCompagnieId(Long compagnieId) { this.compagnieId = compagnieId; }
    public LocalDate getDateExpirationAssurance() {return dateExpirationAssurance;}
    public void setDateExpirationAssurance(LocalDate dateExpirationAssurance) {this.dateExpirationAssurance = dateExpirationAssurance;}
    public LocalDate getDateExpirationCarteGrise() {return dateExpirationCarteGrise;}
    public void setDateExpirationCarteGrise(LocalDate dateExpirationCarteGrise) {this.dateExpirationCarteGrise = dateExpirationCarteGrise;}


}