const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = {
  connect: jest.fn().mockResolvedValue(mockClient),
  query: jest.fn(),
  end: jest.fn(),
};

const Pool = jest.fn(() => mockPool);

module.exports = {
  Pool,
  __mockClient: mockClient,
  __mockPool: mockPool,
};