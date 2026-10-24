package sn.jokko.sunugare.service;

import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Terminal;
import sn.jokko.sunugare.repository.TerminalRepository;

import java.util.List;

@Service
public class TerminalService {
    private final TerminalRepository TerminalRepository;

    public TerminalService(TerminalRepository TerminalRepository) {
        this.TerminalRepository = TerminalRepository;
    }

    public List<Terminal> getAll() {
        return TerminalRepository.findAll();
    }
}