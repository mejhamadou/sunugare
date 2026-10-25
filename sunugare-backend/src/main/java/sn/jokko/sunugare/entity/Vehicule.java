package sn.jokko.sunugare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicules")
public class Vehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String immatriculation;

    private String marque;

    @Column(nullable = false)
    private Integer capacite;

    @ManyToOne
    @JoinColumn(name = "compagnie_id", nullable = false)
    private Compagnie compagnie;

    private java.time.LocalDate dateExpirationAssurance;
    private java.time.LocalDate dateExpirationCarteGrise;
    private Boolean conformiteValideeManuellement = false;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }
    public Compagnie getCompagnie() { return compagnie; }
    public void setCompagnie(Compagnie compagnie) { this.compagnie = compagnie; }
    public java.time.LocalDate getDateExpirationAssurance() { return dateExpirationAssurance; }
    public void setDateExpirationAssurance(java.time.LocalDate dateExpirationAssurance) { this.dateExpirationAssurance = dateExpirationAssurance; }

    public java.time.LocalDate getDateExpirationCarteGrise() { return dateExpirationCarteGrise; }
    public void setDateExpirationCarteGrise(java.time.LocalDate dateExpirationCarteGrise) { this.dateExpirationCarteGrise = dateExpirationCarteGrise; }

    public Boolean getConformiteValideeManuellement() { return conformiteValideeManuellement; }
    public void setConformiteValideeManuellement(Boolean conformiteValideeManuellement) { this.conformiteValideeManuellement = conformiteValideeManuellement; }
}