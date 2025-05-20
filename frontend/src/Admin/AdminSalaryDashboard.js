// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSalaryDashboard } from '../redux/salarySlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminSalaryDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.salary.adminDashboard);
  
  useEffect(() => {
    dispatch(fetchAdminSalaryDashboard());
  }, [dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  if (!data) return null;
  
  const { summary, today, recent_transactions, charts } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Salary Dashboard</h1>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Users</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{summary?.active_users || 0}</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{summary?.users_received_salary || 0}</p>
              <p className="text-sm text-gray-500">Received Salary</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Salaries</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{summary?.active_salaries || 0}</p>
              <p className="text-sm text-gray-500">Active Salaries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">${summary?.avg_salary_amount || 0}</p>
              <p className="text-sm text-gray-500">Avg Amount</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Payments</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">${summary?.total_paid || 0}</p>
              <p className="text-sm text-gray-500">Total Paid</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">${summary?.paid_last_30_days || 0}</p>
              <p className="text-sm text-gray-500">Last 30 Days</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Activity */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-bold text-blue-600">{today?.today_transactions || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Amount Paid</p>
            <p className="text-2xl font-bold text-green-600">${today?.today_amount || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">New Salaries</p>
            <p className="text-2xl font-bold text-purple-600">{today?.today_new_salaries || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Salary by Tier Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary by Tier</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={charts?.salary_by_tier || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="directs" label={{ value: 'Required Directs', position: 'bottom' }} />
                <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="total_amount" name="Total Amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Daily Transactions Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Transactions (Last 30 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={charts?.daily_transactions || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => name === 'total_amount' ? `$${value}` : value} />
                <Line type="monotone" dataKey="transaction_count" name="Transaction Count" stroke="#3b82f6" />
                <Line type="monotone" dataKey="total_amount" name="Total Amount" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recent_transactions?.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {transaction.directs} Directs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    ${transaction.paid_amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryDashboard;