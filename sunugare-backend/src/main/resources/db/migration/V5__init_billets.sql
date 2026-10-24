CREATE TABLE billets (
                         id BIGSERIAL PRIMARY KEY,
                         numero_billet VARCHAR(50) NOT NULL UNIQUE,
                         voyage_id BIGINT NOT NULL,
                         nom_passager VARCHAR(100) NOT NULL,
                         telephone_passager VARCHAR(20),
                         numero_siege INT NOT NULL,
                         statut VARCHAR(50) NOT NULL DEFAULT 'VALIDE',
                         date_emission TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (voyage_id) REFERENCES voyages(id)
);