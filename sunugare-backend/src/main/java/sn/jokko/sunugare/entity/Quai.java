package sn.jokko.sunugare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quais")
public class Quai {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numero;

    @ManyToOne @JoinColumn(name = "terminal_id", nullable = false)
    private Terminal terminal;

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public Terminal getTerminal() { return terminal; }
    public void setTerminal(Terminal terminal) { this.terminal = terminal; }
}