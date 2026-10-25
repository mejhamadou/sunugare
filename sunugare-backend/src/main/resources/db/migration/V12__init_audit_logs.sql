CREATE TABLE audit_logs (
                            id BIGSERIAL PRIMARY KEY,
                            action VARCHAR(100) NOT NULL, -- ex: "VENTE_BILLET", "ANNULATION", "MODIF_VEHICULE"
                            entite VARCHAR(50) NOT NULL,  -- ex: "Billet", "Vehicule"
                            entite_id BIGINT,             -- L'ID de l'élément modifié
                            utilisateur_email VARCHAR(150) NOT NULL,
                            details TEXT,                 -- Détails en texte (ex: "Siège 12, Voyage Dakar-Thiès")
                            date_action TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);