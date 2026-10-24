-- Terminaux et Quais (ton idée)
CREATE TABLE terminaux (
                           id BIGSERIAL PRIMARY KEY,
                           nom VARCHAR(100) NOT NULL,
                           gare_id BIGINT NOT NULL,
                           FOREIGN KEY (gare_id) REFERENCES gares(id)
);

CREATE TABLE quais (
                       id BIGSERIAL PRIMARY KEY,
                       numero VARCHAR(50) NOT NULL,
                       terminal_id BIGINT NOT NULL,
                       FOREIGN KEY (terminal_id) REFERENCES terminaux(id)
);

-- Lignes (Routes)
CREATE TABLE lignes (
                        id BIGSERIAL PRIMARY KEY,
                        ville_depart_id BIGINT NOT NULL,
                        ville_arrivee_id BIGINT NOT NULL,
                        distance_km INT,
                        FOREIGN KEY (ville_depart_id) REFERENCES villes(id),
                        FOREIGN KEY (ville_arrivee_id) REFERENCES villes(id)
);

-- Voyages (Trips)
CREATE TABLE voyages (
                         id BIGSERIAL PRIMARY KEY,
                         ligne_id BIGINT NOT NULL,
                         vehicule_id BIGINT NOT NULL,
                         chauffeur_id BIGINT NOT NULL,
                         quai_id BIGINT NOT NULL,
                         date_depart TIMESTAMP NOT NULL,
                         prix DECIMAL(10,2) NOT NULL,
                         statut VARCHAR(50) NOT NULL DEFAULT 'PLANIFIE',
                         FOREIGN KEY (ligne_id) REFERENCES lignes(id),
                         FOREIGN KEY (vehicule_id) REFERENCES vehicules(id),
                         FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id),
                         FOREIGN KEY (quai_id) REFERENCES quais(id)
);