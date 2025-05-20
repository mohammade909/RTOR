import React, { useState, useEffect } from 'react';  
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactions, 
  fetchUserTransactions, 
  setFilters, 
  resetFilters 
} from '../redux/rewardTransaction';
import { format } from 'date-fns';

// Transaction Status Options
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' }
];

// All Transactions Table Component
 const AllTransactionsTable = () => {
  const dispatch = useDispatch();
  const { transactions, pagination, loading, filters } = useSelector(
    (state) => state.transaction
  );
  
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    offer_id: '',
    status: '',
    offer_title: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  });

  // Load transactions on component mount and when filters change
  useEffect(() => {
    dispatch(fetchTransactions({ 
      page: pagination?.current_page, 
      limit: pagination?.per_page,
      ...filters 
    }));
  }, [dispatch, pagination?.current_page, pagination?.per_page, filters]);

  // Handle pagination change
  const handlePageChange = (newPage) => {
    dispatch(fetchTransactions({ 
      page: newPage, 
      limit: pagination.per_page,
      ...filters 
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value
    });
  };

  // Apply filters
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };

  // Reset filters
  const clearFilters = () => {
    setLocalFilters({
      offer_id: '',
      status: '',
      offer_title: '',
      date_from: '',
      date_to: '',
      amount_min: '',
      amount_max: ''
    });
    dispatch(resetFilters());
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  // Get status style based on transaction status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  console.log(transactions)

  return (
    <div className="  p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Transactions
        </h2>
        <div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="p-2 rounded-full hover:bg-gray-400 text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search by offer title */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by Offer Title"
            name="offer_title"
            value={localFilters.offer_title}
            onChange={handleFilterChange}
          />
          <button 
            className="absolute right-2 top-2 p-1 text-blue-600 hover:text-blue-800"
            onClick={applyFilters}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white ">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Advanced Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer ID</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="offer_id"
                value={localFilters.offer_id}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="status"
                value={localFilters.status}
                onChange={handleFilterChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="amount_min"
                value={localFilters.amount_min}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="amount_max"
                value={localFilters.amount_max}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="date_from"
                value={localFilters.date_from}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="date_to"
                value={localFilters.date_to}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex gap-2 md:col-span-3">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
                onClick={applyFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Apply Filters
              </button>
              <button 
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded flex items-center"
                onClick={clearFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full  border border-gray-200">
            <thead className="bg-black">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">#</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Business</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Plan Val</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">User</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Offer Title</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider border-b">Achived At</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={transaction.transaction_id} className="hover:bg-gray-30">
                    <td className="py-3 px-4 text-sm text-gray-800">{index+1}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.business_val}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.user_plan_val}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{transaction.offer_title}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">${transaction.offer_amount}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination?.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          </p>
          <div className="flex">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={pagination.current_page === 1}
              className={`mx-1 px-3 py-1 rounded border ${pagination.current_page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              First
            </button>
            <button 
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`mx-1 px-3 py-1 rounded border ${pagination.current_page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Prev
            </button>
            
            {/* Page numbers - show current, previous and next when available */}
            {pagination.current_page > 1 && (
              <button 
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className="mx-1 px-3 py-1 rounded border hover:bg-gray-100 text-gray-700"
              >
                {pagination.current_page - 1}
              </button>
            )}
            
            <button className="mx-1 px-3 py-1 rounded border bg-blue-600 text-white">
              {pagination.current_page}
            </button>
            
            {pagination.current_page < pagination.last_page && (
              <button 
                onClick={() => handlePageChange(pagination.current_page + 1)}
                className="mx-1 px-3 py-1 rounded border hover:bg-gray-100 text-gray-700"
              >
                {pagination.current_page + 1}
              </button>
            )}
            
            <button 
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`mx-1 px-3 py-1 rounded border ${pagination.current_page === pagination.last_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Next
            </button>
            <button 
              onClick={() => handlePageChange(pagination.last_page)}
              disabled={pagination.current_page === pagination.last_page}
              className={`mx-1 px-3 py-1 rounded border ${pagination.current_page === pagination.last_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactionsTable