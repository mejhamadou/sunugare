package sn.jokko.sunugare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chauffeurs")
public class Chauffeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @Column(name = "numero_permis", unique = true)
    private String numeroPermis; // ✅ Correction ici

    @ManyToOne
    @JoinColumn(name = "compagnie_id", nullable = false)
    private Compagnie compagnie;

    private String NumeroBadge;


    private java.time.LocalDate dateExpirationPermis;
    private Boolean conformiteValideeManuellement = false;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    // ✅ Correction ici aussi
    public String getNumeroPermis() { return numeroPermis; }
    public void setNumeroPermis(String numeroPermis) { this.numeroPermis = numeroPermis; }

    public Compagnie getCompagnie() { return compagnie; }
    public void setCompagnie(Compagnie compagnie) { this.compagnie = compagnie; }
    public java.time.LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(java.time.LocalDate dateExpirationPermis) { this.dateExpirationPermis = dateExpirationPermis; }

    public Boolean getConformiteValideeManuellement() { return conformiteValideeManuellement; }
    public void setConformiteValideeManuellement(Boolean conformiteValideeManuellement) { this.conformiteValideeManuellement = conformiteValideeManuellement; }

    public String getNumeroBadge() {return NumeroBadge;}
    public void setNumeroBadge(String NumeroBadge) { this.NumeroBadge = NumeroBadge; }
}