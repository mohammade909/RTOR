import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTransactions,
  resetFilters,
  setFilters,
} from "../redux/rewardTransaction";
import { format } from "date-fns";
import Loader from '../BaseFile/comman/Loader'
// Transaction Status Options
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

export const UserTransactionsTable = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { userTransactions, userPagination, loading, filters } = useSelector(
    (state) => state.rewardTransactions
  );

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    offer_id: "",
    status: "",
    offer_title: "",
    date_from: "",
    date_to: "",
    amount_min: "",
    amount_max: "",
  });

  // Load user transactions on component mount and when filters change
  useEffect(() => {
    if (auth) {
      dispatch(
        fetchUserTransactions({
          userId:auth?.id,
          page: userPagination.current_page,
          limit: userPagination.per_page,
          ...filters,
        })
      );
    }
  }, [
    dispatch,
    auth?.id,
    userPagination.current_page,
    userPagination.per_page,
    filters,
  ]);

  // Handle pagination change
  const handlePageChange = (newPage) => {
    dispatch(
      fetchUserTransactions({
        userId:auth?.id,
        page: newPage,
        limit: userPagination.per_page,
        ...filters,
      })
    );
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  // Apply filters
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };

  // Reset filters
  const clearFilters = () => {
    setLocalFilters({
      offer_id: "",
      status: "",
      offer_title: "",
      date_from: "",
      date_to: "",
      amount_min: "",
      amount_max: "",
    });
    dispatch(resetFilters());
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  // Get status style based on transaction status
  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-[#111c54c7] rounded-sm shadow-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-200">
          Your Transactions
        </h2>
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full bg-blue-200 hover:bg-blue-100 text-blue-700 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search by offer title */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full placeholder:text-gray-400 p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 bg-[#7e66c5b3]"
            placeholder="Search by Offer Title"
            name="offer_title"
            value={localFilters.offer_title}
            onChange={handleFilterChange}
          />
          <button
            className="absolute right-2 top-2 p-1 text-white"
            onClick={applyFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Advanced Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer ID
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="offer_id"
                value={localFilters.offer_id}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="amount_min"
                value={localFilters.amount_min}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="amount_max"
                value={localFilters.amount_max}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="date_from"
                value={localFilters.date_from}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Apply Filters
              </button>
              <button
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded flex items-center"
                onClick={clearFilters}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
      <Loader isLoading={loading} />
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full  border border-gray-200">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  #
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Business
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Plan value
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Offer Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b">
                  Achieved At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userTransactions.length > 0 ? (
                userTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-300"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {index+1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.business_val}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.user_plan_val}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.offer_title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      ${transaction.offer_amount}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-800">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {userPagination.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {userPagination.from} to {userPagination.to} of{" "}
            {userPagination.total} entries
          </p>
          <div className="flex">
            <button
              onClick={() => handlePageChange(1)}
              disabled={userPagination.current_page === 1}
              className={`mx-1 px-3 py-1 rounded border ${
                userPagination.current_page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(userPagination.current_page - 1)}
              disabled={userPagination.current_page === 1}
              className={`mx-1 px-3 py-1 rounded border ${
                userPagination.current_page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              Prev
            </button>

            {/* Page numbers - show current, previous and next when available */}
            {userPagination.current_page > 1 && (
              <button
                onClick={() =>
                  handlePageChange(userPagination.current_page - 1)
                }
                className="mx-1 px-3 py-1 rounded border hover:bg-gray-100 text-gray-700"
              >
                {userPagination.current_page - 1}
              </button>
            )}

            <button className="mx-1 px-3 py-1 rounded border bg-blue-600 text-white">
              {userPagination.current_page}
            </button>

            {userPagination.current_page < userPagination.last_page && (
              <button
                onClick={() =>
                  handlePageChange(userPagination.current_page + 1)
                }
                className="mx-1 px-3 py-1 rounded border hover:bg-gray-100 text-gray-700"
              >
                {userPagination.current_page + 1}
              </button>
            )}

            <button
              onClick={() => handlePageChange(userPagination.current_page + 1)}
              disabled={
                userPagination.current_page === userPagination.last_page
              }
              className={`mx-1 px-3 py-1 rounded border ${
                userPagination.current_page === userPagination.last_page
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(userPagination.last_page)}
              disabled={
                userPagination.current_page === userPagination.last_page
              }
              className={`mx-1 px-3 py-1 rounded border ${
                userPagination.current_page === userPagination.last_page
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
