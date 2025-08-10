// Mock API for testing
export const api = {
  checkWishlist: jest.fn().mockResolvedValue(false),
  addToWishlist: jest.fn().mockResolvedValue({ success: true }),
  removeFromWishlist: jest.fn().mockResolvedValue({ success: true }),
  getMenuItems: jest.fn().mockResolvedValue([]),
  getCategories: jest.fn().mockResolvedValue([]),
  getMemberByPhone: jest.fn(),
  createMember: jest.fn(),
  createOrder: jest.fn(),
  placeOrder: jest.fn(),
  submitCakeOrder: jest.fn(),
};
