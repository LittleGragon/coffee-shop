import pool, { executeQuery, testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// Debug function to check database connection
export async function checkDatabaseConnection() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('Database connection successful');
    } else {
      console.error('Database connection failed');
    }
    return isConnected;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export interface WishlistItem {id: string;
  menu_item_id: string;
  user_id?: string;
  guest_id?: string;
 , created_at: Date;
}

export interface WishlistCount {menu_item_id: string;
 , count: number;
}

export const wishlistService = {
  // Add an item to wishlist
  async addToWishlist(menuItemId: string, userId?: string, guestId?: string): Promise<WishlistItem> {
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    try {
      const result = await executeQuery<WishlistItem>(
        `INSERT INTO wishlist (menu_item_id, user_id, guest_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [menuItemId, userId || null, guestId || null]
      );

      return result[0];
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  },

  // Remove an item from wishlist
  async removeFromWishlist(menuItemId: string, userId?: string, guestId?: string): Promise<boolean> {
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    try {
      const result = await executeQuery(
        `DELETE FROM wishlist
         WHERE menu_item_id = $1 AND (user_id = $2 OR guest_id = $3)
         RETURNING id`,
        [menuItemId, userId || null, guestId || null]
      );

      return result.length > 0;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  },

  // Check if an item is in a user's wishlist
  async isInWishlist(menuItemId: string, userId?: string, guestId?: string): Promise<boolean> {
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    try {
      const result = await executeQuery(
        `SELECT id FROM wishlist
         WHERE menu_item_id = $1 AND (user_id = $2 OR guest_id = $3)
         LIMIT 1`,
        [menuItemId, userId || null, guestId || null]
      );

      return result.length > 0;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      throw new Error('Failed to check wishlist status');
    }
  },

  // Get wishlist items for a user
  async getUserWishlist(userId?: string, guestId?: string): Promise<WishlistItem[]> {
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    try {
      const result = await executeQuery<WishlistItem>(
        `SELECT w.* FROM wishlist w
         WHERE w.user_id = $1 OR w.guest_id = $2
         ORDER BY w.created_at DESC`,
        [userId || null, guestId || null]
      );

      return result;
    } catch (error) {
      console.error('Error fetching user wishlist:', error);
      throw new Error('Failed to fetch user wishlist');
    }
  },

  // Get wishlist counts for menu items
  async getWishlistCounts(): Promise<WishlistCount[]> {
    try {
      const result = await executeQuery<{menu_item_id: string, count: string}>(
        `SELECT menu_item_id, COUNT(*) as count
         FROM wishlist
         GROUP BY menu_item_id
         ORDER BY count DESC`
      );

      return result.map(row => ({
        menu_item_id: row.menu_item_id,
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error fetching wishlist counts:', error);
      throw new Error('Failed to fetch wishlist counts');
    }
  },

  // Get top wishlist items with menu item details
  async getTopWishlistItems(limit: number =, 10): Promise<any[]> {
    try {
      const result = await executeQuery(
        `SELECT m.*, COUNT(w.id) as wishlist_count
         FROM menu_items m
         JOIN wishlist w ON m.id = w.menu_item_id
         GROUP BY m.id
         ORDER BY wishlist_count DESC
         LIMIT $1`,
        [limit]
      );

      return result;
    } catch (error) {
      console.error('Error fetching top wishlist items:', error);
      throw new Error('Failed to fetch top wishlist items');
    }
  }
};