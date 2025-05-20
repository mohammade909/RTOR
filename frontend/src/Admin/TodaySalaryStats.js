// src/components/admin/TodaySalaryStats.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fetchTodaySalaryStats } from '../redux/salarySlice';

const TodaySalaryStats = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.salary.todayStats);
  
  useEffect(() => {
    dispatch(fetchTodaySalaryStats());
  }, [dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
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

  const { summary, salary_tiers, active_salaries, top_users, date } = data;
  
  // Setup data for pie chart
  const pieData = salary_tiers?.map(tier => ({
    name: `${tier.directs} Directs`,
    value: tier.total_amount || 0
  })) || [];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Salary Statistics</h2>
        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {date}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-lg font-medium opacity-80">Transactions</p>
          <p className="text-3xl font-bold">{summary?.transaction_count || 0}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-lg font-medium opacity-80">Total Amount</p>
          <p className="text-3xl font-bold">${summary?.total_amount|| 0}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-lg font-medium opacity-80">New Assignments</p>
          <p className="text-3xl font-bold">{summary?.new_salary_assignments || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Distribution by Salary Tier */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribution by Salary Tier</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Active Salaries Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Salaries Status</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{active_salaries?.total_active || 0}</p>
                <p className="text-sm text-gray-500">Total Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{active_salaries?.active_count || 0}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{active_salaries?.expired_count || 0}</p>
                <p className="text-sm text-gray-500">Expired</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{active_salaries?.avg_remaining_days || 0}</p>
                <p className="text-sm text-gray-500">Avg Days Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Salary Tier Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Tier Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Directs
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary Amount
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salary_tiers?.map((tier) => (
                <tr key={tier.salary_id}>
                  <td className="py-2 px-4 text-sm text-gray-900">{tier.directs}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">${tier.amount}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{tier.transaction_count}</td>
                  <td className="py-2 px-4 text-sm font-medium text-green-600">${tier.total_amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Users */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Users Today</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {top_users?.map((user) => (
                <tr key={user.user_id}>
                  <td className="py-2 px-4 text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{user.referral_code}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{user.transaction_count}</td>
                  <td className="py-2 px-4 text-sm font-medium text-green-600">${user.total_amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodaySalaryStats;