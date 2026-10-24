CREATE TABLE paiements (
                           id BIGSERIAL PRIMARY KEY,
                           billet_id BIGINT NOT NULL UNIQUE,
                           montant DECIMAL(10,2) NOT NULL,
                           methode VARCHAR(50) NOT NULL, -- 'ESPECES', 'WAVE', 'ORANGE_MONEY'
                           statut VARCHAR(50) NOT NULL DEFAULT 'REUSSI', -- 'EN_ATTENTE', 'REUSSI', 'ECHOUE'
                           reference_externe VARCHAR(100), -- Pour stocker l'ID de transaction Wave/OM
                           date_paiement TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (billet_id) REFERENCES billets(id)
);