export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  paymentMethod: string;
  total: number;
}

export interface ReservationDetails {
  date: string;
  time: string;
  partySize: number;
  name: string;
  phone: string;
}

export interface CakeCustomization {
  size: {
    id: string;
    name: string;
    price: number;
  };
  flavor: {
    id: string;
    name: string;
    price: number;
  };
  frosting: {
    id: string;
    name: string;
    color: string;
  };
  toppings: string[];
  message: string;
  font: {
    id: string;
    name: string;
    fontFamily: string;
  };
  price: number;
}
