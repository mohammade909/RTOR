// import React from 'react';

// export const Process = () => {
//   return (
//     <section className="bg-white py-16 text-gray-800 font-sheif">
//       <div className="max-w-7xl mx-auto lg:px-0 px-5">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-5xl font-extrabold  text-black mb-4">
//             Process
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Invest smartly, earn passively, and enjoy a relaxing vacation! Here's how you can get started.
//           </p>
//         </div>

//         {/* 3 Steps Process */}
//         <div className="grid md:grid-cols-3 gap-12 text-center">
//           {/* Step 1 */}
//           <div className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all transform  duration-300">
//             <img
//               src="https://img.freepik.com/free-vector/sales-contract-terms-abstract-concept-illustration_335657-3940.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740"
//               alt="Purchase"
//               className="mx-auto mb-6 rounded-lg w-full h-56 object-cover transition-transform transform hover:scale-110 duration-300"
//             />
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">Purchase a Room</h3>
//             <p className="text-gray-600">
//               Secure a premium hotel room investment with high long-term value.
//             </p>
//           </div>

//           {/* Step 2 */}
//           <div className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all transform  duration-300">
//             <img
//               src="https://img.freepik.com/free-vector/sales-contract-terms-abstract-concept-illustration_335657-3940.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740"
//               alt="Rent"
//               className="mx-auto mb-6 rounded-lg w-full h-56 object-cover transition-transform transform hover:scale-110 duration-300"
//             />
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">Give It on Rent</h3>
//             <p className="text-gray-600">
//               Rent your room to guests and travelers, and start earning passive income.
//             </p>
//           </div>

//           {/* Step 3 */}
//           <div className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all transform  duration-300">
//             <img
//               src="https://img.freepik.com/free-vector/sales-contract-terms-abstract-concept-illustration_335657-3940.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740"
//               alt="Earn ROI"
//               className="mx-auto mb-6 rounded-lg w-full h-56 object-cover transition-transform transform hover:scale-110 duration-300"
//             />
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">Earn ROI</h3>
//             <p className="text-gray-600">
//               Watch your investment grow with high returns from consistent bookings.
//             </p>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="text-center mt-12">
//           <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gradient-to-l hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 transform ">
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

import React from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export const Process = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-32 text-gray-800 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full opacity-20 translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-yellow-100 rounded-full opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        {" "}
        {/* Heading with animated elements */}
        <div className="text-center flex flex-col  mb-24 relative">
          <div className=" mb-8 w-auto flex justify-center mx-auto max-w-md bg-white/70 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
            <Sparkles className="text-yellow-500 mr-2" size={20} />
            <span className="text-yellow-600 font-semibold">
              How R2R Globle Works
            </span>
          </div>

          <h2 className="text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 via-yellow-600 to-yellow-600 relative inline-block">
            Our Process
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto relative">
            We make hotel investment simple, transparent, and rewarding. Follow
            three easy steps to start earning from real hotels around the world.
          </p>

          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
        </div>
        {/* 3 Steps Process with advanced styling */}
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 relative mb-24">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-32 left-0 w-full h-1 border-b-4 border-dashed border-yellow-200 z-0"></div>

          {/* Step 1 */}
          <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 z-10 overflow-hidden transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-50 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Number indicator - more elegant style */}
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                01
              </div>
            </div>

            <div className="p-8 pt-10 relative z-10">
              <div className="bg-yellow-100 text-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              <div className="mb-8 relative">
                <img
                  src="/process1.avif"
                  alt="Purchase"
                  className="w-full h-64 object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl flex items-end">
                  <span className="text-white p-4 font-medium">
                    Premium Properties
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                Register & Explore
              </h3>

              <p className="text-gray-600 mb-6">
                Create your free account and browse available hotel investment
                opportunities.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Quick and secure signup</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Access verified hotel listings</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>View performance insights</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 z-10 overflow-hidden transform hover:-translate-y-2 md:mt-16">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-50 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Number indicator - more elegant style */}
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                02
              </div>
            </div>

            <div className="p-8 pt-10 relative z-10">
              <div className="bg-yellow-100 text-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="mb-8 relative">
                <img
                  src="/precess2.avif"
                  alt="Rent"
                  className="w-full h-64 object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl flex items-end">
                  <span className="text-white p-4 font-medium">
                    Rental Management
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                Invest in a Hotel
              </h3>

              <p className="text-gray-600 mb-6">
                Choose a hotel, invest your desired amount, and become a shareholder.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Invest from as low as $100</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Get legal proof of ownership</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Investment secured by contracts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 z-10 overflow-hidden transform hover:-translate-y-2 md:mt-32">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-50 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Number indicator - more elegant style */}
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                03
              </div>
            </div>

            <div className="p-8 pt-10 relative z-10">
              <div className="bg-yellow-100 text-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <div className="mb-8 relative">
                <img
                  src="/process3.avif"
                  alt="Earn ROI"
                  className="w-full h-64 object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl flex items-end">
                  <span className="text-white p-4 font-medium">
                    Growing Returns
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                Earn Consistently
              </h3>

              <p className="text-gray-600 mb-6">
                 As the hotel earns income from guests, you receive your share automatically.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Monthly passive income</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Real-time earnings dashboard</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <Check size={16} className="text-yellow-500 mr-2" />
                  <span>Withdraw anytime (based on terms)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
