import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '../../stores/cart-store';

// Mock menu item for testing
const mockMenuItem = {
  id: '1',
  name: 'Americano',
  price: 25,
  category: 'Coffee',
  description: 'Rich espresso with hot water',
  image: '/images/americano.jpg',
  is_available: true,
};

const mockMenuItem2 = {
  id: '2',
  name: 'Latte',
  price: 35,
  category: 'Coffee',
  description: 'Espresso with steamed milk',
  image: '/images/latte.jpg',
  is_available: true,
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice()).toBe(0);
    expect(result.current.totalItems()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      ...mockMenuItem,
      quantity: 1,
    });
    expect(result.current.totalPrice()).toBe(25);
    expect(result.current.totalItems()).toBe(1);
  });

  it('should increase quantity when adding same item', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalPrice()).toBe(50);
    expect(result.current.totalItems()).toBe(2);
  });

  it('should add multiple different items', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalPrice()).toBe(60);
    expect(result.current.totalItems()).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem2);
      result.current.removeFromCart('1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('2');
    expect(result.current.totalPrice()).toBe(35);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.updateQuantity('1', 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalPrice()).toBe(75);
    expect(result.current.totalItems()).toBe(3);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.updateQuantity('1', 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice()).toBe(0);
  });

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem2);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice()).toBe(0);
    expect(result.current.totalItems()).toBe(0);
  });

  it('should calculate total correctly with multiple items and quantities', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem); // 25 * 1 = 25
      result.current.addToCart(mockMenuItem); // 25 * 2 = 50
      result.current.addToCart(mockMenuItem2); // 35 * 1 = 35
      result.current.updateQuantity('2', 3); // 35 * 3 = 105
    });

    expect(result.current.totalPrice()).toBe(155); // 50 + 105
    expect(result.current.totalItems()).toBe(5); // 2 + 3
  });

  it('should decrement item quantity', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem); // Quantity is now 2
      result.current.decrementItem('1');
    });

    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalPrice()).toBe(25);
    expect(result.current.totalItems()).toBe(1);
  });

  it('should remove item when decremented below 1', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart(mockMenuItem); // Quantity is 1
      result.current.decrementItem('1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice()).toBe(0);
    expect(result.current.totalItems()).toBe(0);
  });
});
