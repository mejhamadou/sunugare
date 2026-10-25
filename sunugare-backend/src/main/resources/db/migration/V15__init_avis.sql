CREATE TABLE avis (
                      id BIGSERIAL PRIMARY KEY,
                      billet_id BIGINT NOT NULL UNIQUE, -- Un seul avis par billet
                      note_chauffeur INT NOT NULL,      -- 1 à 5
                      note_vehicule INT NOT NULL,       -- 1 à 5
                      commentaire TEXT,
                      date_avis TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (billet_id) REFERENCES billets(id) ON DELETE CASCADE
);