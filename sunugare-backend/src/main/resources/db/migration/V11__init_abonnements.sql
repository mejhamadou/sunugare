CREATE TABLE abonnements (
                             id BIGSERIAL PRIMARY KEY,
                             code_abonnement VARCHAR(50) NOT NULL UNIQUE,
                             nom_passager VARCHAR(100) NOT NULL,
                             telephone VARCHAR(20) NOT NULL,
                             ligne_id BIGINT NOT NULL,
                             date_debut DATE NOT NULL,
                             date_fin DATE NOT NULL,
                             statut VARCHAR(50) NOT NULL DEFAULT 'ACTIF',
                             FOREIGN KEY (ligne_id) REFERENCES lignes(id)
);