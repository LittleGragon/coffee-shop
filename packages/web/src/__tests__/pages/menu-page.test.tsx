import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MenuPage } from '../../pages/menu-page'
import { useCartStore } from '../../stores/cart-store'
import { api } from '../../lib/api'

// Mock the API
jest.mock('../../lib/api')
const mockApi = api as jest.Mocked<typeof api>

// Mock the cart store
jest.mock('../../stores/cart-store')
const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>

// Mock menu items data
const mockMenuItems = [
  {
    id: '1',
    name: 'Americano',
    price: 25,
    category: 'Coffee',
    description: 'Rich espresso with hot water',
    image: '/images/americano.jpg',
    available: true
  },
  {
    id: '2',
    name: 'Latte',
    price: 35,
    category: 'Coffee',
    description: 'Espresso with steamed milk',
    image: '/images/latte.jpg',
    available: true
  },
  {
    id: '3',
    name: 'Cappuccino',
    price: 30,
    category: 'Coffee',
    description: 'Espresso with steamed milk foam',
    image: '/images/cappuccino.jpg',
    available: false
  },
  {
    id: '4',
    name: 'Croissant',
    price: 15,
    category: 'Pastry',
    description: 'Buttery flaky pastry',
    image: '/images/croissant.jpg',
    available: true
  }
]

describe('MenuPage', () => {
  const mockAddItem = jest.fn()
  const mockCartStore = {
    items: [],
    addItem: mockAddItem,
    total: 0,
    itemCount: 0,
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCartStore.mockReturnValue(mockCartStore)
    mockApi.getMenuItems.mockResolvedValue(mockMenuItems)
  })

  it('should render menu page with loading state initially', () => {
    render(<MenuPage />)
    
    expect(screen.getByText('Loading menu...')).toBeInTheDocument()
  })

  it('should render menu items after loading', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('Croissant')).toBeInTheDocument()
    })

    // Should not show unavailable items
    expect(screen.queryByText('Cappuccino')).not.toBeInTheDocument()
  })

  it('should display menu items with correct information', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })

    expect(screen.getByText('¥25')).toBeInTheDocument()
    expect(screen.getByText('Rich espresso with hot water')).toBeInTheDocument()
  })

  it('should filter menu items by category', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })

    // Click on Coffee category filter
    const coffeeFilter = screen.getByText('Coffee')
    fireEvent.click(coffeeFilter)

    // Should show coffee items
    expect(screen.getByText('Americano')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
    
    // Should not show pastry items
    expect(screen.queryByText('Croissant')).not.toBeInTheDocument()
  })

  it('should add item to cart when add button is clicked', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])

    expect(mockAddItem).toHaveBeenCalledWith(mockMenuItems[0])
  })

  it('should show all categories filter', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument()
    })

    const allFilter = screen.getByText('All')
    fireEvent.click(allFilter)

    // Should show items from all categories
    expect(screen.getByText('Americano')).toBeInTheDocument()
    expect(screen.getByText('Croissant')).toBeInTheDocument()
  })

  it('should handle API error gracefully', async () => {
    mockApi.getMenuItems.mockRejectedValue(new Error('API Error'))
    
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load menu items')).toBeInTheDocument()
    })
  })

  it('should show empty state when no items available', async () => {
    mockApi.getMenuItems.mockResolvedValue([])
    
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No menu items available')).toBeInTheDocument()
    })
  })

  it('should display correct number of available items', async () => {
    render(<MenuPage />)
    
    await waitFor(() => {
      // Should show 3 available items (excluding unavailable Cappuccino)
      const addButtons = screen.getAllByText('Add to Cart')
      expect(addButtons).toHaveLength(3)
    })
  })

  it('should update cart count when items are added', async () => {
    const mockCartStoreWithItems = {
      ...mockCartStore,
      itemCount: 2,
      items: [
        { ...mockMenuItems[0], quantity: 1 },
        { ...mockMenuItems[1], quantity: 1 }
      ]
    }
    
    mockUseCartStore.mockReturnValue(mockCartStoreWithItems)
    
    render(<MenuPage />)
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // Cart count badge
    })
  })
})