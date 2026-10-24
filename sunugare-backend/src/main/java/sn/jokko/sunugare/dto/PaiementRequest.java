package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaiementRequest {
    @NotNull
    private Long billetId;

    @NotBlank
    private String methode; // ESPECES, WAVE, OM

    // Getters et Setters
    public Long getBilletId() { return billetId; }
    public void setBilletId(Long billetId) { this.billetId = billetId; }
    public String getMethode() { return methode; }
    public void setMethode(String methode) { this.methode = methode; }
}