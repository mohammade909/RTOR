import React, { useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { resetPassword ,clearErrors,clearMessage} from '../../redux/forgotSlice'; // Adjust the import based on your project structure
import ErrorAlert from '../comman/ErrorAlert';
import SuccessAlert from '../comman/SuccessAlert';
import { useParams } from 'react-router-dom';
export default function ForgotPassword() {
    const {token}=useParams()
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { message ,error,loading} = useSelector((state) => state.forgot);

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const forgotData = {
      newPassword,
      token
    };

    dispatch(resetPassword(forgotData))
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch,message]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {error && <ErrorAlert error={error} />}
        {message && <SuccessAlert message={message} />}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {error && <p className="text-lg text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
