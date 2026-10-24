package sn.jokko.sunugare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "terminaux")
public class Terminal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;

    @ManyToOne @JoinColumn(name = "gare_id", nullable = false)
    private Gare gare;

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Gare getGare() { return gare; }
    public void setGare(Gare gare) { this.gare = gare; }
}