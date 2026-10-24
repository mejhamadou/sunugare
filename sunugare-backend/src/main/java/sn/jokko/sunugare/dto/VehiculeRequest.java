package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehiculeRequest {
    @NotBlank(message = "L'immatriculation est obligatoire")
    private String immatriculation;
    private String marque;
    @NotNull(message = "La capacité est obligatoire")
    private Integer capacite;
    @NotNull(message = "L'ID de la compagnie est obligatoire")
    private Long compagnieId;

    // Getters et Setters...
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }
    public Long getCompagnieId() { return compagnieId; }
    public void setCompagnieId(Long compagnieId) { this.compagnieId = compagnieId; }
}