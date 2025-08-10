-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Insert default categories if they don't exist
INSERT INTO categories (name, description, display_order) VALUES
    ('Hot Beverages', 'Coffee, tea, and other hot drinks', 1),
    ('Cold Beverages', 'Iced drinks, smoothies, and cold beverages', 2),
    ('Pastries', 'Fresh baked goods and pastries', 3),
    ('Sandwiches', 'Sandwiches and wraps', 4),
    ('Desserts', 'Sweet treats and desserts', 5)
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint to menu_items table (if it doesn't exist)
DO $$ 
BEGIN
    -- First, update existing menu items to use category names that exist in categories table
    UPDATE menu_items 
    SET category = 'Hot Beverages' 
    WHERE category NOT IN (SELECT name FROM categories) 
    AND (category ILIKE '%coffee%' OR category ILIKE '%hot%' OR category ILIKE '%tea%');
    
    UPDATE menu_items 
    SET category = 'Cold Beverages' 
    WHERE category NOT IN (SELECT name FROM categories) 
    AND (category ILIKE '%cold%' OR category ILIKE '%ice%' OR category ILIKE '%smoothie%');
    
    UPDATE menu_items 
    SET category = 'Pastries' 
    WHERE category NOT IN (SELECT name FROM categories) 
    AND (category ILIKE '%pastry%' OR category ILIKE '%pastries%' OR category ILIKE '%baked%');
    
    UPDATE menu_items 
    SET category = 'Sandwiches' 
    WHERE category NOT IN (SELECT name FROM categories) 
    AND (category ILIKE '%sandwich%' OR category ILIKE '%wrap%');
    
    UPDATE menu_items 
    SET category = 'Desserts' 
    WHERE category NOT IN (SELECT name FROM categories) 
    AND (category ILIKE '%dessert%' OR category ILIKE '%sweet%' OR category ILIKE '%cake%');
    
    -- Set any remaining uncategorized items to 'Hot Beverages' as default
    UPDATE menu_items 
    SET category = 'Hot Beverages' 
    WHERE category NOT IN (SELECT name FROM categories);
    
    -- Now add the foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_menu_items_category' 
        AND table_name = 'menu_items'
    ) THEN
        ALTER TABLE menu_items 
        ADD CONSTRAINT fk_menu_items_category 
        FOREIGN KEY (category) REFERENCES categories(name) 
        ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_categories_updated_at ON categories;
CREATE TRIGGER trigger_update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at();