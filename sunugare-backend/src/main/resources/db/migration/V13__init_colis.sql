CREATE TABLE colis (
                       id BIGSERIAL PRIMARY KEY,
                       code_suivi VARCHAR(50) NOT NULL UNIQUE,
                       voyage_id BIGINT NOT NULL,
                       expediteur_nom VARCHAR(100) NOT NULL,
                       expediteur_tel VARCHAR(20) NOT NULL,
                       destinataire_nom VARCHAR(100) NOT NULL,
                       destinataire_tel VARCHAR(20) NOT NULL,
                       description VARCHAR(255) NOT NULL,
                       poids_kg DECIMAL(5,2),
                       prix DECIMAL(10,2) NOT NULL,
                       statut VARCHAR(50) NOT NULL DEFAULT 'EN_ATTENTE', -- EN_ATTENTE, EN_TRANSIT, ARRIVE, LIVRE
                       date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (voyage_id) REFERENCES voyages(id)
);