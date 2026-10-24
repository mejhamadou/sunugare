package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TerminalRequest {
    @NotBlank(message = "Le nom du terminal est obligatoire")
    private String nom;

    @NotNull(message = "L'ID de la gare est obligatoire")
    private Long gareId;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Long getGareId() { return gareId; }
    public void setGareId(Long gareId) { this.gareId = gareId; }
}