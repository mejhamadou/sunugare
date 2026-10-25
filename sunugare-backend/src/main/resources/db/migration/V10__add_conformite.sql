-- Dates pour les véhicules
ALTER TABLE vehicules ADD COLUMN date_expiration_assurance DATE;
ALTER TABLE vehicules ADD COLUMN date_expiration_carte_grise DATE;
ALTER TABLE vehicules ADD COLUMN conformite_validee_manuellement BOOLEAN DEFAULT FALSE;

-- Dates pour les chauffeurs
ALTER TABLE chauffeurs ADD COLUMN date_expiration_permis DATE;
ALTER TABLE chauffeurs ADD COLUMN conformite_validee_manuellement BOOLEAN DEFAULT FALSE;