import React, { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Header from '../CoreFile/Header';
import Footer from '../CoreFile/Footer';
export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
    <Header/>
    <div className="h-[67px] bg-black"></div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4">
      <div className="grid lg:grid-cols-2 max-w-6xl w-full shadow-2xl rounded-md overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="hidden lg:block relative">
          <img
            src="https://img.freepik.com/free-vector/isometric-stock-exchange-financial-market-trading-composition_1284-67573.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid&w=740"
            alt="Trading Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 sm:p-12 text-white">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-400">Join TradePro</h2>
            <p className="text-sm text-gray-300 mt-2">Your gateway to smarter trading begins here.</p>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full py-3 pl-10 pr-4 rounded-lg bg-black/30 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full py-3 pl-10 pr-4 rounded-lg bg-black/30 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full py-3 pl-10 pr-10 rounded-lg bg-black/30 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </div>
            </div>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full py-3 pl-10 pr-10 rounded-lg bg-black/30 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <input type="checkbox" className="mr-2 accent-indigo-500" />
              I agree to the{' '}
              <a href="#" className="ml-1 text-indigo-400 hover:underline">
                Terms & Conditions
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all py-3 rounded-lg text-white font-semibold shadow-lg"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/user/login" className="text-indigo-400 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};
