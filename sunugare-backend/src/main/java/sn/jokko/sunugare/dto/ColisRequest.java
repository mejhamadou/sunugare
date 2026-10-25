package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ColisRequest {
    @NotNull
    private Long voyageId;

    @NotBlank
    private String expediteurNom;

    @NotBlank
    private String expediteurTel;

    @NotBlank
    private String destinataireNom;

    @NotBlank
    private String destinataireTel;

    @NotBlank
    private String description;

    private Double poidsKg;

    @NotNull
    private Double prix;

    // Getters et Setters
    public Long getVoyageId() { return voyageId; }
    public void setVoyageId(Long voyageId) { this.voyageId = voyageId; }
    public String getExpediteurNom() { return expediteurNom; }
    public void setExpediteurNom(String expediteurNom) { this.expediteurNom = expediteurNom; }
    public String getExpediteurTel() { return expediteurTel; }
    public void setExpediteurTel(String expediteurTel) { this.expediteurTel = expediteurTel; }
    public String getDestinataireNom() { return destinataireNom; }
    public void setDestinataireNom(String destinataireNom) { this.destinataireNom = destinataireNom; }
    public String getDestinataireTel() { return destinataireTel; }
    public void setDestinataireTel(String destinataireTel) { this.destinataireTel = destinataireTel; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(Double poidsKg) { this.poidsKg = poidsKg; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
}