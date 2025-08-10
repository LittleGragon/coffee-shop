-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT wishlist_user_check CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL) OR
    (user_id IS NULL AND guest_id IS NOT NULL)
  )
);

-- Create unique constraint to prevent duplicate wishlist entries
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_item_idx ON wishlist (menu_item_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_guest_item_idx ON wishlist (menu_item_id, guest_id) WHERE guest_id IS NOT NULL;

-- Create index for counting wishlist items
CREATE INDEX IF NOT EXISTS wishlist_menu_item_id_idx ON wishlist (menu_item_id);
