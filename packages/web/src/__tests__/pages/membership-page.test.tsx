import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { api } from '../../lib/api';
import { MembershipPage } from '../../pages/membership-page';

// Mock the API
jest.mock('../../lib/api');
const mockApi = api as jest.Mocked<typeof api>;

const mockMember = {
  id: 'member_123',
  name: 'John Doe',
  phone: '1234567890',
  balance: 150,
};

const mockOrders = [
  {
    id: 'order_1',
    memberId: 'member_123',
    total: 50,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    items: [{ menuItemId: '1', quantity: 2, price: 25, name: 'Americano' }],
  },
  {
    id: 'order_2',
    memberId: 'member_123',
    total: 35,
    status: 'completed',
    createdAt: '2024-01-14T14:20:00Z',
    items: [{ menuItemId: '2', quantity: 1, price: 35, name: 'Latte' }],
  },
];

describe('MembershipPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form initially', () => {
    render(<MembershipPage />);

    expect(screen.getByText('Member Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should login member successfully and show dashboard', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockApi.getMemberByPhone).toHaveBeenCalledWith('1234567890');
      expect(mockApi.getMemberOrders).toHaveBeenCalledWith('member_123');
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('¥150')).toBeInTheDocument();
    });
  });

  it('should handle member not found and show registration form', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockRejectedValue(new Error('Member not found'));

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');

    await user.type(phoneInput, '9999999999');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Member not found. Would you like to register?')).toBeInTheDocument();
      expect(screen.getByText('Register New Member')).toBeInTheDocument();
    });
  });

  it('should register new member successfully', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockRejectedValue(new Error('Member not found'));
    mockApi.createMember.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue([]);

    render(<MembershipPage />);

    // Try to login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Register New Member')).toBeInTheDocument();
    });

    // Fill registration form
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const registerButton = screen.getByText('Register');

    await user.type(nameInput, 'John Doe');
    await user.click(registerButton);

    await waitFor(() => {
      expect(mockApi.createMember).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '1234567890',
      });
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    });
  });

  it('should display order history', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Order History')).toBeInTheDocument();
      expect(screen.getByText('¥50')).toBeInTheDocument();
      expect(screen.getByText('¥35')).toBeInTheDocument();
      expect(screen.getByText('2x Americano')).toBeInTheDocument();
      expect(screen.getByText('1x Latte')).toBeInTheDocument();
    });
  });

  it('should show top-up functionality', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Top Up Balance')).toBeInTheDocument();
      expect(screen.getByText('¥50')).toBeInTheDocument();
      expect(screen.getByText('¥100')).toBeInTheDocument();
      expect(screen.getByText('¥200')).toBeInTheDocument();
    });
  });

  it('should process top-up successfully', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);
    mockApi.topUpMember.mockResolvedValue({
      success: true,
      newBalance: 250,
      transactionId: 'txn_123',
    });

    render(<MembershipPage />);

    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Top Up Balance')).toBeInTheDocument();
    });

    // Select top-up amount
    const topUp100Button = screen.getByText('¥100');
    await user.click(topUp100Button);

    // Confirm top-up
    const confirmButton = screen.getByText('Confirm Top Up');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockApi.topUpMember).toHaveBeenCalledWith('member_123', 100);
      expect(screen.getByText('Top-up successful!')).toBeInTheDocument();
      expect(screen.getByText('¥250')).toBeInTheDocument();
    });
  });

  it('should handle top-up error', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);
    mockApi.topUpMember.mockRejectedValue(new Error('Top-up failed'));

    render(<MembershipPage />);

    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Top Up Balance')).toBeInTheDocument();
    });

    // Select and confirm top-up
    const topUp50Button = screen.getByText('¥50');
    await user.click(topUp50Button);
    const confirmButton = screen.getByText('Confirm Top Up');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Top-up failed')).toBeInTheDocument();
    });
  });

  it('should show empty order history message', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue([]);

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });
  });

  it('should validate phone number input', async () => {
    const user = userEvent.setup();

    render(<MembershipPage />);

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);

    // Should not call API with empty phone number
    expect(mockApi.getMemberByPhone).not.toHaveBeenCalled();
  });

  it('should validate registration form', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockRejectedValue(new Error('Member not found'));

    render(<MembershipPage />);

    // Try to login first to get to registration form
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Register New Member')).toBeInTheDocument();
    });

    // Try to register without name
    const registerButton = screen.getByText('Register');
    await user.click(registerButton);

    // Should not call API without name
    expect(mockApi.createMember).not.toHaveBeenCalled();
  });

  it('should show loading states', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<MembershipPage />);

    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
  });

  it('should logout member', async () => {
    const user = userEvent.setup();
    mockApi.getMemberByPhone.mockResolvedValue(mockMember);
    mockApi.getMemberOrders.mockResolvedValue(mockOrders);

    render(<MembershipPage />);

    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const loginButton = screen.getByText('Login');
    await user.type(phoneInput, '1234567890');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    });

    // Logout
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(screen.getByText('Member Login')).toBeInTheDocument();
  });
});
