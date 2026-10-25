package sn.jokko.sunugare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bagages")
public class Bagage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "billet_id", nullable = false)
    private Billet billet;

    @Column(nullable = false)
    private String description; // ex: "Valise noire", "Sac de riz"

    private Double poidsKg;

    @Column(nullable = false)
    private Double tarif = 0.0; // Frais supplémentaires pour le bagage

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Billet getBillet() { return billet; }
    public void setBillet(Billet billet) { this.billet = billet; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(Double poidsKg) { this.poidsKg = poidsKg; }
    public Double getTarif() { return tarif; }
    public void setTarif(Double tarif) { this.tarif = tarif; }
}