import { POST } from '../../../../app/api/members/topup/route';
import { query } from '../../../../lib/db';

// Mock the database query function
jest.mock('../../../../lib/db', () => ({
  query: jest.fn(),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('/api/members/topup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should process top-up successfully', async () => {
      // Mock BEGIN transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock getting current balance
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ balance: '45.50' }] 
      } as any);
      
      // Mock updating balance
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock recording transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock COMMIT transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const request = new Request('http://localhost:3001/api/members/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'test-member-id',
          amount: 25.00,
          description: 'Test top-up'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.newBalance).toBe(70.5);
      expect(data.message).toBe('Successfully added $25.00 to your account');
      
      // Verify transaction calls
      expect(mockQuery).toHaveBeenCalledWith('BEGIN');
      expect(mockQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('should return 400 for missing memberId', async () => {
      const request = new Request('http://localhost:3001/api/members/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 25.00
          // missing memberId
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Member ID and positive amount are required');
    });

    it('should return 400 for negative amount', async () => {
      const request = new Request('http://localhost:3001/api/members/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'test-member-id',
          amount: -10.00
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Member ID and positive amount are required');
    });

    it('should return 404 for non-existent member', async () => {
      // Mock BEGIN transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock member not found
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock ROLLBACK transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const request = new Request('http://localhost:3001/api/members/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'non-existent-id',
          amount: 25.00
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Member not found');
      expect(mockQuery).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should handle database errors and rollback', async () => {
      // Mock BEGIN transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock database error
      mockQuery.mockRejectedValueOnce(new Error('Database error'));
      
      // Mock ROLLBACK transaction
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const request = new Request('http://localhost:3001/api/members/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'test-member-id',
          amount: 25.00
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });
});