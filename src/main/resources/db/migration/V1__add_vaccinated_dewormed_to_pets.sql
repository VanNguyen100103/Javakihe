-- Add vaccinated and dewormed columns to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS vaccinated BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS dewormed BOOLEAN DEFAULT FALSE; 