package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.ColisRequest;
import sn.jokko.sunugare.entity.Colis;
import sn.jokko.sunugare.entity.Voyage;
import sn.jokko.sunugare.repository.ColisRepository;
import sn.jokko.sunugare.repository.VoyageRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ColisService {
    private final ColisRepository colisRepository;
    private final VoyageRepository voyageRepository;

    public ColisService(ColisRepository colisRepository, VoyageRepository voyageRepository) {
        this.colisRepository = colisRepository;
        this.voyageRepository = voyageRepository;
    }

    public Colis enregistrerColis(ColisRequest request) {
        Voyage voyage = voyageRepository.findById(request.getVoyageId())
                .orElseThrow(() -> new RuntimeException("Voyage introuvable"));

        Colis colis = new Colis();
        colis.setCodeSuivi("COL-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        colis.setVoyage(voyage);
        colis.setExpediteurNom(request.getExpediteurNom());
        colis.setExpediteurTel(request.getExpediteurTel());
        colis.setDestinataireNom(request.getDestinataireNom());
        colis.setDestinataireTel(request.getDestinataireTel());
        colis.setDescription(request.getDescription());
        colis.setPoidsKg(request.getPoidsKg());
        colis.setPrix(request.getPrix());
        colis.setStatut("EN_ATTENTE");

        return colisRepository.save(colis);
    }

    public List<Colis> getAll() {
        return colisRepository.findAll();
    }

    public Colis getByCodeSuivi(String codeSuivi) {
        return colisRepository.findByCodeSuivi(codeSuivi)
                .orElseThrow(() -> new RuntimeException("Aucun colis trouvé avec ce code."));
    }

    public Colis changerStatut(Long id, String nouveauStatut) {
        Colis colis = colisRepository.findById(id).orElseThrow();
        colis.setStatut(nouveauStatut);
        return colisRepository.save(colis);
    }

    public List<Colis> rechercher(String statut) {
        return colisRepository.rechercherColis((statut != null && !statut.isEmpty()) ? statut : null);
    }

    public String exporterCsv(List<Colis> colisList) {
        StringBuilder csv = new StringBuilder("Code;Expediteur;Destinataire;Description;Prix;Statut\n");
        for (Colis c : colisList) {
            csv.append(c.getCodeSuivi()).append(";")
                    .append(c.getExpediteurNom()).append(";")
                    .append(c.getDestinataireNom()).append(";")
                    .append(c.getDescription()).append(";")
                    .append(c.getPrix()).append(";")
                    .append(c.getStatut()).append("\n");
        }
        return csv.toString();
    }
}