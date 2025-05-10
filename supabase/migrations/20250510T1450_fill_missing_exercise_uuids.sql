-- Asigna un UUID a todos los ejercicios que no tengan uno
-- Requiere la extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

UPDATE exercises
SET uuid = gen_random_uuid()
WHERE uuid IS NULL;
