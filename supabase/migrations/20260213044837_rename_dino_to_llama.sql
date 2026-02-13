-- Drop old constraint first (it only allows alpacas/dinos/pandas)
ALTER TABLE valentines DROP CONSTRAINT IF EXISTS valentines_character_type_check;

-- Migrate existing dino entries to llama
UPDATE valentines SET character_type = 'llamas' WHERE character_type = 'dinos';

-- Add new constraint with all 6 character types
ALTER TABLE valentines ADD CONSTRAINT valentines_character_type_check
  CHECK (character_type IN ('alpacas', 'llamas', 'pandas', 'otters', 'lobsters', 'penguins'));
