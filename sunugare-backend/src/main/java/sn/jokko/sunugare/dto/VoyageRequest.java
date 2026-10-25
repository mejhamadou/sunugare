package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class VoyageRequest {
    @NotNull private Long ligneId;
    @NotNull private Long vehiculeId;
    @NotNull private Long chauffeurId;
    @NotNull private Long quaiId;
    @NotNull private LocalDateTime dateDepart;
    @NotNull private Double prix;
    private Double multiplicateurPrix;

    // Getters et Setters...
    public Long getLigneId() { return ligneId; }
    public void setLigneId(Long ligneId) { this.ligneId = ligneId; }
    public Long getVehiculeId() { return vehiculeId; }
    public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }
    public Long getChauffeurId() { return chauffeurId; }
    public void setChauffeurId(Long chauffeurId) { this.chauffeurId = chauffeurId; }
    public Long getQuaiId() { return quaiId; }
    public void setQuaiId(Long quaiId) { this.quaiId = quaiId; }
    public LocalDateTime getDateDepart() { return dateDepart; }
    public void setDateDepart(LocalDateTime dateDepart) { this.dateDepart = dateDepart; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public Double getMultiplicateurPrix() { return multiplicateurPrix; }
    public void setMultiplicateurPrix(Double multiplicateurPrix) {this.multiplicateurPrix = multiplicateurPrix;}
}