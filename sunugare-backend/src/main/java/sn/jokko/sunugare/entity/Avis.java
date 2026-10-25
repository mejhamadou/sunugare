package sn.jokko.sunugare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avis")
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "billet_id", nullable = false)
    private Billet billet;

    @Column(nullable = false)
    private Integer noteChauffeur;

    @Column(nullable = false)
    private Integer noteVehicule;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "date_avis", nullable = false, updatable = false)
    private LocalDateTime dateAvis = LocalDateTime.now();

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Billet getBillet() { return billet; }
    public void setBillet(Billet billet) { this.billet = billet; }
    public Integer getNoteChauffeur() { return noteChauffeur; }
    public void setNoteChauffeur(Integer noteChauffeur) { this.noteChauffeur = noteChauffeur; }
    public Integer getNoteVehicule() { return noteVehicule; }
    public void setNoteVehicule(Integer noteVehicule) { this.noteVehicule = noteVehicule; }
    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
    public LocalDateTime getDateAvis() { return dateAvis; }
    public void setDateAvis(LocalDateTime dateAvis) { this.dateAvis = dateAvis; }
}