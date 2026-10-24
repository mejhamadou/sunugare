package sn.jokko.sunugare.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sn.jokko.sunugare.entity.*;
import sn.jokko.sunugare.repository.*;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(TerminalRepository terminalRepo, QuaiRepository quaiRepo, GareRepository gareRepo) {
        return args -> {
            if (quaiRepo.count() == 0) {
                Gare gare = gareRepo.findAll().stream().findFirst().orElse(null);
                if (gare != null) {
                    Terminal terminal = new Terminal();
                    terminal.setNom("Terminal Principal");
                    terminal.setGare(gare);
                    terminalRepo.save(terminal);

                    Quai q1 = new Quai();
                    q1.setNumero("Quai A1");
                    q1.setTerminal(terminal);
                    quaiRepo.save(q1);

                    Quai q2 = new Quai();
                    q2.setNumero("Quai B1");
                    q2.setTerminal(terminal);
                    quaiRepo.save(q2);

                    System.out.println("✅ Données de test (Terminal/Quais) créées !");
                }
            }
        };
    }
}