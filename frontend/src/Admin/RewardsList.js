import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewards, setSelectedReward } from '../redux/rewardSlice';
import RewardEditModal from './RewardEditModal';

const RewardsList = () => {
  const dispatch = useDispatch();
  const { rewards, loading, error } = useSelector((state) => state.rewards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);
  
  const handleEdit = (reward) => {
    dispatch(setSelectedReward(reward));
    setIsModalOpen(true);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  if (loading) return <div className="text-center p-4">Loading rewards...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reward Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards?.map((reward) => (
          <div
            key={reward.id}
            className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
              reward.is_active ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-800">{reward.title}</h2>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  reward.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {reward.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 mt-2 h-24 overflow-y-auto text-sm">{reward.description}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <span className="text-blue-700 font-medium">Target:</span>
                <p className="text-gray-700">${reward.threshold.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <span className="text-purple-700 font-medium">Reward:</span>
                <p className="text-gray-700">{formatCurrency(reward.reward_amount)}</p>
              </div>
            </div>
            
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              <div className="bg-teal-50 p-2 rounded flex justify-between items-center">
                <span className="text-teal-700 font-medium">Time Frame:</span>
                <p className="text-gray-700">{reward.duration_days} days</p>
              </div>
            </div>
            
            {/* <button
              onClick={() => handleEdit(reward)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
            >
              Edit Reward
            </button> */}
          </div>
        ))}
      </div>
      
      {isModalOpen && <RewardEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default RewardsList;