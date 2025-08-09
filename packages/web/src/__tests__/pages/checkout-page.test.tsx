import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutPage } from '../../pages/checkout-page'
import { useCartStore } from '../../stores/cart-store'
import { api } from '../../lib/api'

// Mock the API
jest.mock('../../lib/api')
const mockApi = api as jest.Mocked<typeof api>

// Mock the cart store
jest.mock('../../stores/cart-store')
const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>

// Mock router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('CheckoutPage', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Americano',
      price: 25,
      category: 'Coffee',
      description: 'Rich espresso with hot water',
      image: '/images/americano.jpg',
      available: true,
      quantity: 2
    },
    {
      id: '2',
      name: 'Latte',
      price: 35,
      category: 'Coffee',
      description: 'Espresso with steamed milk',
      image: '/images/latte.jpg',
      available: true,
      quantity: 1
    }
  ]

  const mockClearCart = jest.fn()
  const mockCartStore = {
    items: mockCartItems,
    total: 85, // 25*2 + 35*1
    itemCount: 3,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: mockClearCart
  }

  const mockMember = {
    id: 'member_123',
    name: 'John Doe',
    phone: '1234567890',
    balance: 100
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCartStore.mockReturnValue(mockCartStore)
  })

  it('should render empty cart message when cart is empty', () => {
    mockUseCartStore.mockReturnValue({
      ...mockCartStore,
      items: [],
      total: 0,
      itemCount: 0
    })

    render(<CheckoutPage />)
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('should render cart items and total', () => {
    render(<CheckoutPage />)
    
    expect(screen.getByText('Americano')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
    expect(screen.getByText('¥85')).toBeInTheDocument()
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument()
    expect(screen.getByText('Quantity: 1')).toBeInTheDocument()
  })

  it('should show member login form initially', () => {
    render(<CheckoutPage />)
    
    expect(screen.getByText('Member Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('should login member successfully', async () => {
    const user = userEvent.setup()
    mockApi.getMemberByPhone.mockResolvedValue(mockMember)

    render(<CheckoutPage />)
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')

    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      expect(mockApi.getMemberByPhone).toHaveBeenCalledWith('1234567890')
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument()
      expect(screen.getByText('Balance: ¥100')).toBeInTheDocument()
    })
  })

  it('should handle member not found', async () => {
    const user = userEvent.setup()
    mockApi.getMemberByPhone.mockRejectedValue(new Error('Member not found'))

    render(<CheckoutPage />)
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')

    await user.type(phoneInput, '9999999999')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Member not found')).toBeInTheDocument()
    })
  })

  it('should show insufficient balance warning', async () => {
    const user = userEvent.setup()
    const memberWithLowBalance = { ...mockMember, balance: 50 }
    mockApi.getMemberByPhone.mockResolvedValue(memberWithLowBalance)

    render(<CheckoutPage />)
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')

    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Insufficient balance')).toBeInTheDocument()
      expect(screen.getByText('Top Up')).toBeInTheDocument()
    })
  })

  it('should process order successfully', async () => {
    const user = userEvent.setup()
    mockApi.getMemberByPhone.mockResolvedValue(mockMember)
    mockApi.createOrder.mockResolvedValue({
      id: 'order_123',
      memberId: 'member_123',
      items: mockCartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: 85,
      status: 'completed'
    })

    render(<CheckoutPage />)
    
    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')
    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument()
    })

    // Process order
    const placeOrderButton = screen.getByText('Place Order')
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(mockApi.createOrder).toHaveBeenCalledWith({
        memberId: 'member_123',
        items: [
          { menuItemId: '1', quantity: 2, price: 25 },
          { menuItemId: '2', quantity: 1, price: 35 }
        ],
        total: 85
      })
      expect(mockClearCart).toHaveBeenCalled()
      expect(screen.getByText('Order placed successfully!')).toBeInTheDocument()
    })
  })

  it('should handle order creation error', async () => {
    const user = userEvent.setup()
    mockApi.getMemberByPhone.mockResolvedValue(mockMember)
    mockApi.createOrder.mockRejectedValue(new Error('Order failed'))

    render(<CheckoutPage />)
    
    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')
    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument()
    })

    // Try to place order
    const placeOrderButton = screen.getByText('Place Order')
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to place order')).toBeInTheDocument()
    })
  })

  it('should show loading state during order processing', async () => {
    const user = userEvent.setup()
    mockApi.getMemberByPhone.mockResolvedValue(mockMember)
    mockApi.createOrder.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    render(<CheckoutPage />)
    
    // Login first
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')
    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument()
    })

    // Start order processing
    const placeOrderButton = screen.getByText('Place Order')
    await user.click(placeOrderButton)

    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('should validate phone number input', async () => {
    const user = userEvent.setup()

    render(<CheckoutPage />)
    
    const loginButton = screen.getByText('Login')
    await user.click(loginButton)

    // Should not call API with empty phone number
    expect(mockApi.getMemberByPhone).not.toHaveBeenCalled()
  })

  it('should disable place order button when insufficient balance', async () => {
    const user = userEvent.setup()
    const memberWithLowBalance = { ...mockMember, balance: 50 }
    mockApi.getMemberByPhone.mockResolvedValue(memberWithLowBalance)

    render(<CheckoutPage />)
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const loginButton = screen.getByText('Login')
    await user.type(phoneInput, '1234567890')
    await user.click(loginButton)

    await waitFor(() => {
      const placeOrderButton = screen.getByText('Place Order')
      expect(placeOrderButton).toBeDisabled()
    })
  })
})