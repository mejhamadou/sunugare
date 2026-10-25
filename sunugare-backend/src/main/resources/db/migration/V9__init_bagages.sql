CREATE TABLE bagages (
                         id BIGSERIAL PRIMARY KEY,
                         billet_id BIGINT NOT NULL,
                         description VARCHAR(150) NOT NULL,
                         poids_kg DECIMAL(5,2),
                         tarif DECIMAL(10,2) NOT NULL DEFAULT 0,
                         FOREIGN KEY (billet_id) REFERENCES billets(id) ON DELETE CASCADE
);