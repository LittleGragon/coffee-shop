import { NextResponse } from 'next/server';

const MOCK_MEMBER_DATA = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  membershipLevel: 'Gold',
  memberSince: '2022-01-15',
  points: 1250,
  balance: 75.50,
  orderHistory: [
    { id: 'ord-xyz-1', date: '2023-10-25', items: '1x Latte, 1x Croissant', total: 7.00 },
    { id: 'ord-xyz-2', date: '2023-10-22', items: '2x Americano', total: 7.00 },
    { id: 'ord-xyz-3', date: '2023-10-18', items: '1x Green Tea', total: 3.00 },
  ],
};

export async function GET() {
  // In a real application, you would fetch this from the database based on the authenticated user
  const { name, email, membershipLevel, points, balance, orderHistory } = MOCK_MEMBER_DATA;
  return NextResponse.json({ name, email, membershipLevel, points, balance, orderHistory });
}
