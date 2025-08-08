'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reservation } from '@/types/models';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        
        // Construct URL with query parameters if filters are applied
        let url = '/api/reservations';
        const params = new URLSearchParams();
        
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        
        if (dateFilter) {
          params.append('date', dateFilter);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        
        const data = await response.json();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [statusFilter, dateFilter]);
  
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
  
  // Get today's date in YYYY-MM-DD format for the date filter
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }
      
      // Update the reservation in the state
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
        )
      );
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status. Please try again.');
    }
  };
  
  // Handle reservation deletion
  const handleDelete = async (reservationId: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
      
      // Remove the reservation from the state
      setReservations(prevReservations => 
        prevReservations.filter(reservation => reservation.id !== reservationId)
      );
    } catch (err) {
      console.error('Error deleting reservation:', err);
      alert('Failed to delete reservation. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reservations</h1>
        <Link 
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 appearance-none bg-white bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date:
            </label>
            <input
              id="date-filter"
              type="date"
              className="w-full p-2 pl-3 pr-3 border border-gray-300 rounded-md text-gray-800"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              min={getTodayDate()}
            />
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading reservations...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Reservations Table */}
      {!loading && !error && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing {reservations.length} reservations
            </p>
            <Link 
              href="/reservations/new"
              className="bg-[#6f4e37] hover:bg-[#5d4230] text-white font-semibold py-2 px-4 rounded"
            >
              New Reservation
            </Link>
          </div>
          
          {reservations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Size
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
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
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        {reservation.customer_name}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {reservation.customer_phone}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {reservation.party_size}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {formatDate(reservation.reservation_time.toString())}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/reservations/${reservation.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-800">
                              Update Status
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                              <div className="py-1">
                                {['confirmed', 'pending', 'cancelled', 'completed', 'no-show'].map((status) => (
                                  <button
                                    key={status}
                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                      reservation.status === status ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => handleStatusUpdate(reservation.id, status)}
                                    disabled={reservation.status === status}
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleDelete(reservation.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No reservations found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}