import React from 'react';

export const LimitWarningModal = ({ open, onClose, limit, used }) => {
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  const isCritical = percentage >= 90;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-3">
            {isCritical ? 'Limit Almost Reached!' : 'Usage Warning'}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {isCritical
                ? `You've used ${percentage}% of your limit (${used}/${limit}). Please upgrade to continue.`
                : `You've used ${percentage}% of your limit (${used}/${limit}).`}
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${isCritical ? 'bg-red-600' : 'bg-yellow-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-md text-white ${isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
              onClick={onClose}
            >
              {isCritical ? 'Upgrade Now' : 'I Understand'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};