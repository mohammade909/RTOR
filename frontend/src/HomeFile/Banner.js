import React from 'react';
import { Apple, ArrowLeft, Bell } from 'lucide-react';

const Banner = () => {
  return (
    <div className="bg-gray-800  overflow-hidden text-white p-8 relative">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        {/* Left section - Text and download buttons */}
        <div className="md:w-1/2 z-10">
          <p className="text-green-500 font-medium mb-2">DOWNLOAD APP</p>
          <h1 className="text-4xl font-bold mb-4">Download Trading App</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            We use cookines to understand how you use our website and to 
            give you the best possible experience.
          </p>
          
          {/* Download buttons row */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-gray-900 hover:bg-gray-700 py-3 px-6 rounded-md flex items-center justify-center w-20">
              <Apple size={24} />
            </button>
            <button className="bg-gray-900 hover:bg-gray-700 py-3 px-6 rounded-md flex items-center justify-center w-20">
              {/* <Windows size={24} /> */}
            </button>
            <button className="bg-green-600 hover:bg-green-700 py-3 px-6 rounded-md flex items-center justify-center w-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 11l-5-5-5 5" />
                <path d="M17 18l-5-5-5 5" />
              </svg>
            </button>
            <button className="bg-red-600 hover:bg-red-700 py-3 px-6 rounded-md flex items-center justify-center w-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M7 15V9l10 0" />
                <path d="M17 15l-4 -3" />
                <path d="M17 9l-4 3" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Right section - Phone mockups */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative -bottom-[32px]">
          <img className='' src='https://azim.hostlin.com/Fortradex/assets/images/resource/mockup-1.png'/>
         
        </div>
      </div>
    </div>
  );
};

export default Banner;