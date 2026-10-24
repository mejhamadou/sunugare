CREATE TABLE chauffeurs (
                            id BIGSERIAL PRIMARY KEY,
                            nom VARCHAR(100) NOT NULL,
                            prenom VARCHAR(100) NOT NULL,
                            telephone VARCHAR(20),
                            numero_permis VARCHAR(50) UNIQUE,
                            compagnie_id BIGINT NOT NULL,
                            FOREIGN KEY (compagnie_id) REFERENCES compagnies(id)
);

CREATE TABLE vehicules (
                           id BIGSERIAL PRIMARY KEY,
                           immatriculation VARCHAR(50) NOT NULL UNIQUE,
                           marque VARCHAR(100),
                           capacite INT NOT NULL,
                           compagnie_id BIGINT NOT NULL,
                           FOREIGN KEY (compagnie_id) REFERENCES compagnies(id)
);