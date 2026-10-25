package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "abonnements")
public class Abonnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codeAbonnement;

    @Column(nullable = false)
    private String nomPassager;

    @Column(nullable = false)
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private String statut = "ACTIF";

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodeAbonnement() { return codeAbonnement; }
    public void setCodeAbonnement(String codeAbonnement) { this.codeAbonnement = codeAbonnement; }
    public String getNomPassager() { return nomPassager; }
    public void setNomPassager(String nomPassager) { this.nomPassager = nomPassager; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public Ligne getLigne() { return ligne; }
    public void setLigne(Ligne ligne) { this.ligne = ligne; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}