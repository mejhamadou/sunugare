package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.VehiculeRequest;
import sn.jokko.sunugare.entity.Compagnie;
import sn.jokko.sunugare.entity.Vehicule;
import sn.jokko.sunugare.repository.CompagnieRepository;
import sn.jokko.sunugare.repository.VehiculeRepository;

import java.util.List;

@Service
public class VehiculeService {
    private final VehiculeRepository vehiculeRepository;
    private final CompagnieRepository compagnieRepository;

    public VehiculeService(VehiculeRepository vehiculeRepository, CompagnieRepository compagnieRepository) {
        this.vehiculeRepository = vehiculeRepository;
        this.compagnieRepository = compagnieRepository;
    }

    public Vehicule creerVehicule(VehiculeRequest request) {
        Compagnie compagnie = compagnieRepository.findById(request.getCompagnieId())
                .orElseThrow(() -> new RuntimeException("Compagnie introuvable"));

        Vehicule v = new Vehicule();
        v.setImmatriculation(request.getImmatriculation());
        v.setMarque(request.getMarque());
        v.setCapacite(request.getCapacite());
        v.setCompagnie(compagnie);
        v.setDateExpirationAssurance(request.getDateExpirationAssurance());
        v.setDateExpirationCarteGrise(request.getDateExpirationCarteGrise());

        return vehiculeRepository.save(v);
    }

    public Vehicule updateVehicule(Long id, VehiculeRequest request) {
        Vehicule v = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

        Compagnie compagnie = compagnieRepository.findById(request.getCompagnieId())
                .orElseThrow(() -> new RuntimeException("Compagnie introuvable"));

        v.setImmatriculation(request.getImmatriculation());
        v.setMarque(request.getMarque());
        v.setCapacite(request.getCapacite());
        v.setCompagnie(compagnie);

        // ✅ Sauvegarde des dates
        v.setDateExpirationAssurance(request.getDateExpirationAssurance());
        v.setDateExpirationCarteGrise(request.getDateExpirationCarteGrise());

        return vehiculeRepository.save(v);
    }

    public List<Vehicule> getAll() {
        return vehiculeRepository.findAll();
    }

    public Vehicule validerManuellement(Long id) {
        Vehicule v = vehiculeRepository.findById(id).orElseThrow();
        v.setConformiteValideeManuellement(true);
        return vehiculeRepository.save(v);
    }
}