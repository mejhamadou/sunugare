package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.dto.TerminalRequest;
import sn.jokko.sunugare.entity.Gare;
import sn.jokko.sunugare.entity.Terminal;
import sn.jokko.sunugare.repository.GareRepository;
import sn.jokko.sunugare.repository.TerminalRepository;

import java.util.List;

@Service
public class TerminalService {
    private final TerminalRepository terminalRepository;
    private final GareRepository gareRepository;

    public TerminalService(TerminalRepository terminalRepository, GareRepository gareRepository) {
        this.terminalRepository = terminalRepository;
        this.gareRepository = gareRepository;
    }

    public List<Terminal> getAll() { return terminalRepository.findAll(); }

    public Terminal creerTerminal(TerminalRequest request) {
        Gare gare = gareRepository.findById(request.getGareId())
                .orElseThrow(() -> new RuntimeException("Gare introuvable"));
        Terminal terminal = new Terminal();
        terminal.setNom(request.getNom());
        terminal.setGare(gare);
        return terminalRepository.save(terminal);
    }

    public Terminal updateTerminal(Long id, TerminalRequest request) {
        Terminal terminal = terminalRepository.findById(id).orElseThrow(() -> new RuntimeException("Terminal introuvable"));
        Gare gare = gareRepository.findById(request.getGareId()).orElseThrow(() -> new RuntimeException("Gare introuvable"));
        terminal.setNom(request.getNom());
        terminal.setGare(gare);
        return terminalRepository.save(terminal);
    }
}