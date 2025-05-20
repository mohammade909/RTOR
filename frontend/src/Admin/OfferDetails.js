import React, { useEffect } from "react";
import { fetchOfferById } from "../redux/offer";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const OfferDetails = () => {
  const dispatch = useDispatch();
  const { offerId } = useParams();
  const offerData = useSelector((state) => state.offers?.offerDetails);

  useEffect(() => {
    if (offerId) {
      dispatch(fetchOfferById(offerId));
    }
  }, [dispatch, offerId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      active: "bg-emerald-100 text-emerald-800",
      pending: "bg-amber-100 text-amber-800",
      completed: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return statusMap[status?.toLowerCase()] || "bg-purple-100 text-purple-800";
  };

  if (!offerData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Offer Details</h2>
          <span className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(offerData.status)}`}>
            {offerData.status}
          </span>
        </div>
        <p className="text-indigo-100 mt-1 text-lg">{offerData.title}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-1/3">ID:</span>
                <span className="font-medium text-gray-800">{offerData.offer_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 w-1/3">Description:</span>
                <p className="text-gray-800">{offerData.description}</p>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-1/3">Plan:</span>
                <span className="font-medium text-gray-800">{offerData.plan}</span>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Financial Details
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-1/2">Business Value:</span>
                <span className="font-medium text-gray-800">${offerData?.business_val || 0}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-1/2">Reward:</span>
                <span className="font-medium text-green-600">${offerData?.reward || 0}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-1/2">User Plan Value:</span>
                <span className="font-medium text-gray-800">{offerData?.user_plan_val || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Timeline */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Start Date</span>
                <time className="font-medium text-gray-800">{formatDate(offerData?.start_date)}</time>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">End Date</span>
                <time className="font-medium text-gray-800">{formatDate(offerData?.end_date)}</time>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Created</span>
                <time className="font-medium text-gray-800">{formatDate(offerData?.created_at)}</time>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Last Updated</span>
                <time className="font-medium text-gray-800">{formatDate(offerData?.updated_at)}</time>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Usage Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <span className="text-4xl font-bold text-indigo-600">{offerData?.users || 0}</span>
                <p className="text-sm text-gray-500 mt-1">Total Users</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <span className="text-4xl font-bold text-purple-600">{offerData?.associatedUsers?.length || 0}</span>
                <p className="text-sm text-gray-500 mt-1">Associated Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Associated Users Table */}
        {offerData?.associatedUsers?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Associated Users
            </h3>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offerData.associatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">ID: {user.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.assigned_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;