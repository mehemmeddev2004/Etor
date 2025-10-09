-- Migration: Add brand column to product table
-- This fixes the error: column ProductEntity.brand does not exist

-- Add brand column to product table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'brand'
    ) THEN
        ALTER TABLE product ADD COLUMN brand VARCHAR;
        COMMENT ON COLUMN product.brand IS 'Product brand name';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'product' 
AND column_name = 'brand';
