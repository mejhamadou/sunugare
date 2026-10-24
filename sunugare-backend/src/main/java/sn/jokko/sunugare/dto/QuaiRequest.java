package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuaiRequest {
    @NotBlank(message = "Le numéro du quai est obligatoire")
    private String numero;

    @NotNull(message = "L'ID du terminal est obligatoire")
    private Long terminalId;

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public Long getTerminalId() { return terminalId; }
    public void setTerminalId(Long terminalId) { this.terminalId = terminalId; }
}