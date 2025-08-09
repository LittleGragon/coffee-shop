import { query, executeQuery, testConnection } from '../../lib/db';

// Mock pg module
jest.mock('pg', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  
  const mockPool = {
    connect: jest.fn(() => Promise.resolve(mockClient)),
  };
  
  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('Database utilities', () => {
  let mockClient: any;
  let mockPool: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get references to mocked objects
    const { Pool } = require('pg');
    mockPool = new Pool();
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    mockPool.connect.mockResolvedValue(mockClient);
  });

  describe('query function', () => {
    it('should execute query successfully', async () => {
      const mockResult = { rows: [{ id: 1, name: 'test' }] };
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // SET search_path
      mockClient.query.mockResolvedValueOnce(mockResult); // actual query

      const result = await query('SELECT * FROM test', []);

      expect(mockClient.query).toHaveBeenCalledTimes(2);
      expect(mockClient.query).toHaveBeenCalledWith('SET search_path TO public');
      expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test', []);
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle query errors', async () => {
      const mockError = new Error('Database error');
      mockClient.query.mockRejectedValueOnce(mockError);

      await expect(query('SELECT * FROM test', [])).rejects.toThrow('Database error');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('executeQuery function', () => {
    it('should execute query and return rows', async () => {
      const mockRows = [{ id: 1, name: 'test' }];
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // SET search_path
      mockClient.query.mockResolvedValueOnce({ rows: mockRows }); // actual query

      const result = await executeQuery('SELECT * FROM test', []);

      expect(result).toEqual(mockRows);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('testConnection function', () => {
    it('should return true for successful connection', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // SET search_path
      mockClient.query.mockResolvedValueOnce({ rows: [{ now: new Date() }] }); // SELECT NOW()

      const result = await testConnection();

      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await testConnection();

      expect(result).toBe(false);
    });
  });
});