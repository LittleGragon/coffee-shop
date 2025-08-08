import { executeQuery } from '@/lib/db';
import { Reservation } from '@/types/models';

export class ReservationService {
  /**
   * Get all reservations with optional filtering
   */
  async getAllReservations(options?: { status?: string; date?: string }): Promise<Reservation[]> {
    let query = 'SELECT * FROM reservations';
    const params: any[] = [];
    
    // Apply filters if provided
    if (options) {
      const conditions: string[] = [];
      
      if (options.status) {
        conditions.push('status = $1');
        params.push(options.status);
      }
      
      if (options.date) {
        const paramIndex = params.length + 1;
        conditions.push(`DATE(reservation_time) = $${paramIndex}`);
        params.push(options.date);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    query += ' ORDER BY reservation_time';
    
    return executeQuery<Reservation>(query, params);
  }
  
  /**
   * Get a reservation by ID
   */
  async getReservationById(id: string): Promise<Reservation | null> {
    const reservations = await executeQuery<Reservation>('SELECT * FROM reservations WHERE id = $1', [id]);
    return reservations.length > 0 ? reservations[0] : null;
  }
  
  /**
   * Create a new reservation
   */
  async createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> {
    const { user_id, customer_name, customer_phone, party_size, reservation_time, status } = reservation;
    
    const reservations = await executeQuery<Reservation>(
      `INSERT INTO reservations (user_id, customer_name, customer_phone, party_size, reservation_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id || null, customer_name, customer_phone, party_size, reservation_time, status || 'confirmed']
    );
    
    return reservations[0];
  }
  
  /**
   * Update a reservation
   */
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    // First check if the reservation exists
    const existingReservation = await this.getReservationById(id);
    if (!existingReservation) {
      return null;
    }
    
    // Build the update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;
    
    // Add each field that needs to be updated
    for (const [key, value] of Object.entries(updates)) {
      // Skip id and created_at as they shouldn't be updated
      if (['id', 'created_at'].includes(key)) {
        continue;
      }
      
      fields.push(`${key} = $${paramCounter}`);
      values.push(value);
      paramCounter++;
    }
    
    // Add the id as the last parameter for the WHERE clause
    values.push(id);
    
    const query = `
      UPDATE reservations 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;
    
    const reservations = await executeQuery<Reservation>(query, values);
    return reservations.length > 0 ? reservations[0] : null;
  }
  
  /**
   * Update reservation status
   */
  async updateReservationStatus(id: string, status: string): Promise<Reservation | null> {
    const reservations = await executeQuery<Reservation>(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return reservations.length > 0 ? reservations[0] : null;
  }
  
  /**
   * Delete a reservation
   */
  async deleteReservation(id: string): Promise<boolean> {
    const result = await executeQuery<{ id: string }>('DELETE FROM reservations WHERE id = $1 RETURNING id', [id]);
    return result.length > 0;
  }
  
  /**
   * Get reservations for a specific date
   */
  async getReservationsByDate(date: string): Promise<Reservation[]> {
    return executeQuery<Reservation>(
      'SELECT * FROM reservations WHERE DATE(reservation_time) = $1 ORDER BY reservation_time',
      [date]
    );
  }
  
  /**
   * Get reservations by status
   */
  async getReservationsByStatus(status: string): Promise<Reservation[]> {
    return executeQuery<Reservation>(
      'SELECT * FROM reservations WHERE status = $1 ORDER BY reservation_time',
      [status]
    );
  }
  
  /**
   * Check if a time slot is available
   */
  async isTimeSlotAvailable(time: Date, partySize: number): Promise<boolean> {
    // Get all confirmed reservations within 2 hours of the requested time
    const startTime = new Date(time);
    startTime.setHours(startTime.getHours() - 1);
    
    const endTime = new Date(time);
    endTime.setHours(endTime.getHours() + 1);
    
    const overlappingReservations = await executeQuery<{ total_party_size: number }>(
      `SELECT SUM(party_size) as total_party_size 
       FROM reservations 
       WHERE status = 'confirmed' 
       AND reservation_time BETWEEN $1 AND $2`,
      [startTime, endTime]
    );
    
    // Assuming the restaurant can accommodate 50 people at once
    const maxCapacity = 50;
    const currentBookings = overlappingReservations[0]?.total_party_size || 0;
    
    return currentBookings + partySize <= maxCapacity;
  }
}

export default new ReservationService();