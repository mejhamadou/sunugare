package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;

public class VilleRequest {
    @NotBlank(message = "Le nom de la ville est obligatoire")
    private String nom;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
}