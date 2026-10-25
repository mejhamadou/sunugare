package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.QuaiRequest;
import sn.jokko.sunugare.entity.Quai;
import sn.jokko.sunugare.entity.Terminal;
import sn.jokko.sunugare.repository.QuaiRepository;
import sn.jokko.sunugare.repository.TerminalRepository;

import java.util.List;

@Service
public class QuaiService {
    private final QuaiRepository QuaiRepository;
    private final TerminalRepository TerminalRepository;

    public QuaiService(QuaiRepository QuaiRepository, TerminalRepository terminalRepository) {
        this.QuaiRepository = QuaiRepository;
        this.TerminalRepository = terminalRepository;
    }

    public List<Quai> getAll() { return QuaiRepository.findAll(); }

    public Quai creerQuai(QuaiRequest request) {
        Terminal terminal = TerminalRepository.findById(request.getTerminalId())
                .orElseThrow(() -> new RuntimeException("Terminal introuvable"));
        Quai Quai = new Quai();
        Quai.setNumero(request.getNumero());
        Quai.setTerminal(terminal);
        return QuaiRepository.save(Quai);
    }

    public Quai updateQuai(Long id, QuaiRequest request) {
        Quai quai = QuaiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quai introuvable"));

        Terminal terminal = TerminalRepository.findById(request.getTerminalId())
                .orElseThrow(() -> new RuntimeException("Terminal introuvable"));

        quai.setNumero(request.getNumero());
        quai.setTerminal(terminal);

        return QuaiRepository.save(quai);
    }
}