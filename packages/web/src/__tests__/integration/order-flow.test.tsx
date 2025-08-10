import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { api } from '../../lib/api';
import { CheckoutPage } from '../../pages/checkout-page';
import { MenuPage } from '../../pages/menu-page';
import { useCartStore } from '../../stores/cart-store';

// Mock the API
jest.mock('../../lib/api');
const mockApi = api as jest.Mocked<typeof api>;

// Mock router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMenuItems = [
  {
    id: '1',
    name: 'Americano',
    price: 25,
    category: 'Coffee',
    description: 'Rich espresso with hot water',
    image: '/images/americano.jpg',
    available: true,
  },
  {
    id: '2',
    name: 'Latte',
    price: 35,
    category: 'Coffee',
    description: 'Espresso with steamed milk',
    image: '/images/latte.jpg',
    available: true,
  },
];

const mockMember = {
  id: 'member_123',
  name: 'John Doe',
  phone: '1234567890',
  balance: 100,
};

describe('Order Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset cart store
    useCartStore.getState().clearCart();
    mockApi.getMenuItems.mockResolvedValue(mockMenuItems);
  });

  it('should complete full order flow from menu to checkout', async () => {
    const user = userEvent.setup();

    // Mock API responses
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.createOrder.mockResolvedValue({
      id: 'order_123',
      memberId: 'member_123',
      items: [{ menuItemId: '1', quantity: 2, price: 25 }],
      total: 50,
      status: 'completed',
    });

    // Step 1: Render menu page and add items to cart
    const { rerender } = render(<MenuPage />);

    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument();
    });

    // Add Americano to cart twice
    const addButtons = screen.getAllByText('Add to Cart');
    await user.click(addButtons[0]); // Add first Americano
    await user.click(addButtons[0]); // Add second Americano

    // Verify cart state
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(useCartStore.getState().total).toBe(50);

    // Step 2: Navigate to checkout
    rerender(<CheckoutPage />);

    // Verify cart items are displayed
    expect(screen.getByText('Americano')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    expect(screen.getByText('¥50')).toBeInTheDocument();

    // Step 3: Login as member
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('Balance: ¥100')).toBeInTheDocument();
    });

    // Step 4: Place order
    const placeOrderButton = screen.getByText('Place Order');
    await user.click(placeOrderButton);

    await waitFor(() => {
      expect(mockApi.createOrder).toHaveBeenCalledWith({
        memberId: 'member_123',
        items: [{ menuItemId: '1', quantity: 2, price: 25 }],
        total: 50,
      });
      expect(screen.getByText('Order placed successfully!')).toBeInTheDocument();
    });

    // Verify cart is cleared after successful order
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().total).toBe(0);
  });

  it('should handle insufficient balance scenario', async () => {
    const user = userEvent.setup();

    // Member with insufficient balance
    const memberWithLowBalance = { ...mockMember, balance: 30 };
    mockApi.getMemberByPhone.mockResolvedValue(memberWithLowBalance);

    // Add expensive items to cart
    useCartStore.getState().addItem(mockMenuItems[0]); // 25
    useCartStore.getState().addItem(mockMenuItems[1]); // 35
    // Total: 60, but member only has 30

    render(<CheckoutPage />);

    // Login
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
      expect(screen.getByText('Top Up')).toBeInTheDocument();
    });

    // Place order button should be disabled
    const placeOrderButton = screen.getByText('Place Order');
    expect(placeOrderButton).toBeDisabled();
  });

  it('should handle order creation failure gracefully', async () => {
    const user = userEvent.setup();

    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.createOrder.mockRejectedValue(new Error('Order creation failed'));

    // Add item to cart
    useCartStore.getState().addItem(mockMenuItems[0]);

    render(<CheckoutPage />);

    // Login
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    });

    // Try to place order
    const placeOrderButton = screen.getByText('Place Order');
    await user.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to place order')).toBeInTheDocument();
    });

    // Cart should not be cleared on failed order
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('should maintain cart state across page navigation', async () => {
    const user = userEvent.setup();

    // Step 1: Add items on menu page
    const { rerender } = render(<MenuPage />);

    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add to Cart');
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    // Verify cart state
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().total).toBe(60);

    // Step 2: Navigate to checkout and verify cart persists
    rerender(<CheckoutPage />);

    expect(screen.getByText('Americano')).toBeInTheDocument();
    expect(screen.getByText('Latte')).toBeInTheDocument();
    expect(screen.getByText('¥60')).toBeInTheDocument();
  });

  it('should handle member registration during checkout', async () => {
    const user = userEvent.setup();

    // Mock member not found, then successful registration
    mockApi.getMemberByPhone.mockRejectedValue(new Error('Member not found'));
    mockApi.createMember.mockResolvedValue(mockMember);
    mockApi.createOrder.mockResolvedValue({
      id: 'order_123',
      memberId: 'member_123',
      items: [{ menuItemId: '1', quantity: 1, price: 25 }],
      total: 25,
      status: 'completed',
    });

    // Add item to cart
    useCartStore.getState().addItem(mockMenuItems[0]);

    render(<CheckoutPage />);

    // Try to login with non-existent member
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '9999999999');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Member not found')).toBeInTheDocument();
    });

    // Should show registration option
    expect(screen.getByText('Register as new member')).toBeInTheDocument();

    // Register new member
    const registerButton = screen.getByText('Register as new member');
    await user.click(registerButton);

    // Fill registration form
    const nameInput = screen.getByPlaceholderText('Enter your name');
    await user.type(nameInput, 'John Doe');

    const confirmRegisterButton = screen.getByText('Register');
    await user.click(confirmRegisterButton);

    await waitFor(() => {
      expect(mockApi.createMember).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '9999999999',
      });
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    });
  });
});
