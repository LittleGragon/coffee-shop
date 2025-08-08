'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types/models';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Construct URL with query parameters if filters are applied
        let url = '/api/orders';
        const params = new URLSearchParams();
        
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [statusFilter]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update the order in the state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <Link 
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mr-2">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            className="p-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 appearance-none bg-white bg-no-repeat bg-right"
            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading orders...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Orders Table */}
      {!loading && !error && (
        <>
          <p className="mb-4 text-gray-600">
            Showing {orders.length} orders
          </p>
          
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {formatDate(order.created_at.toString())}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {order.user_id ? `User: ${order.user_id.substring(0, 8)}...` : 'Guest'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-medium">
                        ${parseFloat(order.total_amount.toString()).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                          
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-800">
                              Update Status
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                              <div className="py-1">
                                {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                  <button
                                    key={status}
                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                      order.status === status ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => handleStatusUpdate(order.id, status)}
                                    disabled={order.status === status}
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}