-- Temporarily disable foreign key constraint for created_by
ALTER TABLE proposals DROP CONSTRAINT proposals_created_by_fkey;

-- Add it back as optional later if needed
-- ALTER TABLE proposals ADD CONSTRAINT proposals_created_by_fkey 
-- FOREIGN KEY (created_by) REFERENCES users(id);