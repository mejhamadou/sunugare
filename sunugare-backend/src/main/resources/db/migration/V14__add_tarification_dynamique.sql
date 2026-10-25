ALTER TABLE voyages ADD COLUMN multiplicateur_prix DECIMAL(3,2) DEFAULT 1.0;
-- Ex: 1.0 = prix normal, 1.2 = +20%, 0.8 = -20%