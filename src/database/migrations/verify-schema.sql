-- Verify product table schema
-- Run this to check if the brand column exists

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'product' 
ORDER BY ordinal_position;

-- Check if brand column specifically exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'product' 
            AND column_name = 'brand'
        ) 
        THEN 'Brand column EXISTS' 
        ELSE 'Brand column MISSING - needs migration' 
    END as brand_column_status;
