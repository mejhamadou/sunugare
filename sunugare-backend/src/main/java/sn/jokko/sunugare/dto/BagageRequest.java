package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BagageRequest {
    @NotNull
    private Long billetId;
    @NotBlank
    private String description;
    private Double poidsKg;
    private Double tarif;


    // --- GETTERS ET SETTERS ---
    public Long getBilletId() { return billetId; }
    public void setBilletId(Long billetId) { this.billetId = billetId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(Double poidsKg) { this.poidsKg = poidsKg; }

    public Double getTarif() { return tarif; }
    public void setTarif(Double tarif) { this.tarif = tarif; }
}
