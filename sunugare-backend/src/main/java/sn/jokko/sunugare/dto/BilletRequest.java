package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BilletRequest {
    @NotNull
    private Long voyageId;

    @NotBlank
    private String nomPassager;

    private String telephonePassager;

    @NotNull
    private Integer numeroSiege;

    // Getters et Setters
    public Long getVoyageId() { return voyageId; }
    public void setVoyageId(Long voyageId) { this.voyageId = voyageId; }
    public String getNomPassager() { return nomPassager; }
    public void setNomPassager(String nomPassager) { this.nomPassager = nomPassager; }
    public String getTelephonePassager() { return telephonePassager; }
    public void setTelephonePassager(String telephonePassager) { this.telephonePassager = telephonePassager; }
    public Integer getNumeroSiege() { return numeroSiege; }
    public void setNumeroSiege(Integer numeroSiege) { this.numeroSiege = numeroSiege; }
}