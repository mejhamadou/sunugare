package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Quai;
import sn.jokko.sunugare.repository.QuaiRepository;

import java.util.List;

@Service
public class QuaiService {
    private final QuaiRepository quaiRepository;

    public QuaiService(QuaiRepository quaiRepository) {
        this.quaiRepository = quaiRepository;
    }

    public List<Quai> getAll() {
        return quaiRepository.findAll();
    }
}