package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "billet_id", nullable = false)
    private Billet billet;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private String methode;

    @Column(nullable = false)
    private String statut = "REUSSI";

    private String referenceExterne;

    @Column(nullable = false, updatable = false)
    private LocalDateTime datePaiement = LocalDateTime.now();

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Billet getBillet() { return billet; }
    public void setBillet(Billet billet) { this.billet = billet; }
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    public String getMethode() { return methode; }
    public void setMethode(String methode) { this.methode = methode; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getReferenceExterne() { return referenceExterne; }
    public void setReferenceExterne(String referenceExterne) { this.referenceExterne = referenceExterne; }
    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }
}