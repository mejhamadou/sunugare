package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.BagageRequest;
import sn.jokko.sunugare.entity.Bagage;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.repository.BagageRepository;
import sn.jokko.sunugare.repository.BilletRepository;

import java.util.List;

@Service
public class BagageService {
    private final BagageRepository bagageRepository;
    private final BilletRepository billetRepository;

    public BagageService(BagageRepository bagageRepository, BilletRepository billetRepository) {
        this.bagageRepository = bagageRepository;
        this.billetRepository = billetRepository;
    }

    public Bagage ajouterBagage(BagageRequest request) {
        Billet billet = billetRepository.findById(request.getBilletId())
                .orElseThrow(() -> new RuntimeException("Billet introuvable"));

        Bagage bagage = new Bagage();
        bagage.setBillet(billet);
        bagage.setDescription(request.getDescription());
        bagage.setPoidsKg(request.getPoidsKg());
        bagage.setTarif(request.getTarif() != null ? request.getTarif() : 0.0);

        return bagageRepository.save(bagage);
    }

    public List<Bagage> getBagagesByBillet(Long billetId) {
        return bagageRepository.findAll().stream()
                .filter(b -> b.getBillet().getId().equals(billetId))
                .toList();
    }
}