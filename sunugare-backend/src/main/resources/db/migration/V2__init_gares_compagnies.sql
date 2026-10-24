CREATE TABLE villes (
                        id BIGSERIAL PRIMARY KEY,
                        nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE compagnies (
                            id BIGSERIAL PRIMARY KEY,
                            nom VARCHAR(100) NOT NULL UNIQUE,
                            telephone VARCHAR(20),
                            email VARCHAR(150)
);

CREATE TABLE gares (
                       id BIGSERIAL PRIMARY KEY,
                       nom VARCHAR(100) NOT NULL,
                       adresse VARCHAR(255),
                       ville_id BIGINT NOT NULL,
                       FOREIGN KEY (ville_id) REFERENCES villes(id)
);