package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "voyages")
public class Voyage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    @ManyToOne @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    @ManyToOne @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;

    @ManyToOne @JoinColumn(name = "quai_id", nullable = false)
    private Quai quai;

    @Column(nullable = false)
    private LocalDateTime dateDepart;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private String statut = "PLANIFIE";

    @Column(name = "retard_minutes")
    private Integer retardMinutes = 0;

    // Getters et Setters... (Génère-les avec IntelliJ, il y en a beaucoup !)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Ligne getLigne() { return ligne; }
    public void setLigne(Ligne ligne) { this.ligne = ligne; }
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    public Chauffeur getChauffeur() { return chauffeur; }
    public void setChauffeur(Chauffeur chauffeur) { this.chauffeur = chauffeur; }
    public Quai getQuai() { return quai; }
    public void setQuai(Quai quai) { this.quai = quai; }
    public LocalDateTime getDateDepart() { return dateDepart; }
    public void setDateDepart(LocalDateTime dateDepart) { this.dateDepart = dateDepart; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public Integer getRetardMinutes() { return retardMinutes; }
    public void setRetardMinutes(Integer retardMinutes) { this.retardMinutes = retardMinutes; }

    @Column(name = "multiplicateur_prix")
    private Double multiplicateurPrix = 1.0;

    public Double getMultiplicateurPrix() { return multiplicateurPrix; }
    public void setMultiplicateurPrix(Double multiplicateurPrix) { this.multiplicateurPrix = multiplicateurPrix; }

    // La méthode utilitaire :
    public Double getPrixFinal() {
        if (this.prix == null) return 0.0;
        if (this.multiplicateurPrix == null) return this.prix;
        return this.prix * this.multiplicateurPrix;
    }
    }