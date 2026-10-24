package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "billets")
public class Billet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_billet", nullable = false, unique = true)
    private String numeroBillet;

    @ManyToOne
    @JoinColumn(name = "voyage_id", nullable = false)
    private Voyage voyage;

    @Column(name = "nom_passager", nullable = false)
    private String nomPassager;

    @Column(name = "telephone_passager")
    private String telephonePassager;

    @Column(name = "numero_siege", nullable = false)
    private Integer numeroSiege;

    @Column(nullable = false)
    private String statut = "VALIDE";

    @Column(name = "date_emission", nullable = false, updatable = false)
    private LocalDateTime dateEmission = LocalDateTime.now();

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroBillet() { return numeroBillet; }
    public void setNumeroBillet(String numeroBillet) { this.numeroBillet = numeroBillet; }
    public Voyage getVoyage() { return voyage; }
    public void setVoyage(Voyage voyage) { this.voyage = voyage; }
    public String getNomPassager() { return nomPassager; }
    public void setNomPassager(String nomPassager) { this.nomPassager = nomPassager; }
    public String getTelephonePassager() { return telephonePassager; }
    public void setTelephonePassager(String telephonePassager) { this.telephonePassager = telephonePassager; }
    public Integer getNumeroSiege() { return numeroSiege; }
    public void setNumeroSiege(Integer numeroSiege) { this.numeroSiege = numeroSiege; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDateTime dateEmission) { this.dateEmission = dateEmission; }
}