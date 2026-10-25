package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AbonnementRequest {

    @NotBlank(message = "Le nom du passager est obligatoire")
    private String nomPassager;

    @NotBlank(message = "Le téléphone est obligatoire")
    private String telephone;

    @NotNull(message = "La ligne est obligatoire")
    private Long ligneId;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    // --- GETTERS ET SETTERS ---
    public String getNomPassager() { return nomPassager; }
    public void setNomPassager(String nomPassager) { this.nomPassager = nomPassager; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Long getLigneId() { return ligneId; }
    public void setLigneId(Long ligneId) { this.ligneId = ligneId; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
}