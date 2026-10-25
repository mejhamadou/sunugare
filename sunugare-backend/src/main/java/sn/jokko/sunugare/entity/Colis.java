package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "colis")
public class Colis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_suivi", nullable = false, unique = true)
    private String codeSuivi;

    @ManyToOne
    @JoinColumn(name = "voyage_id", nullable = false)
    private Voyage voyage;

    @Column(name = "expediteur_nom", nullable = false)
    private String expediteurNom;

    @Column(name = "expediteur_tel", nullable = false)
    private String expediteurTel;

    @Column(name = "destinataire_nom", nullable = false)
    private String destinataireNom;

    @Column(name = "destinataire_tel", nullable = false)
    private String destinataireTel;

    @Column(nullable = false)
    private String description;

    @Column(name = "poids_kg")
    private Double poidsKg;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private String statut = "EN_ATTENTE"; // EN_ATTENTE, EN_TRANSIT, ARRIVE, LIVRE

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodeSuivi() { return codeSuivi; }
    public void setCodeSuivi(String codeSuivi) { this.codeSuivi = codeSuivi; }
    public Voyage getVoyage() { return voyage; }
    public void setVoyage(Voyage voyage) { this.voyage = voyage; }
    public String getExpediteurNom() { return expediteurNom; }
    public void setExpediteurNom(String expediteurNom) { this.expediteurNom = expediteurNom; }
    public String getExpediteurTel() { return expediteurTel; }
    public void setExpediteurTel(String expediteurTel) { this.expediteurTel = expediteurTel; }
    public String getDestinataireNom() { return destinataireNom; }
    public void setDestinataireNom(String destinataireNom) { this.destinataireNom = destinataireNom; }
    public String getDestinataireTel() { return destinataireTel; }
    public void setDestinataireTel(String destinataireTel) { this.destinataireTel = destinataireTel; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(Double poidsKg) { this.poidsKg = poidsKg; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}