// import React from 'react'

// const componentsData = [
//     {
//       title: "Copy & paste components",
//       description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//         </svg>
//       ),
//     },
//     {
//       title: "Zero Configuration",
//       description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//         </svg>
//       ),
//     },
//     {
//         title: "Zero Configuration",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//         icon: (
//           <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//           </svg>
//         ),
//       },
//       {
//         title: "Zero Configuration",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//         icon: (
//           <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//           </svg>
//         ),
//       },

//     {
//       title: "New Components Every month",
//       description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//     },
//     {
//       title: "Elegant Dark Mode",
//       description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab nulla quod dignissimos vel non corrupti doloribus voluptatum eveniet.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
//         </svg>
//       ),
//     },
//     // Add more component objects as needed
//   ];

// export const WhyChooseUs = () => {
//   return (
//    <>

// <section className="bg-white dark:bg-gray-900 lg:mb-10">
//       <div className="max-w-7xl lg:px-7 px-4 py-10 mx-auto">
//         <div className='max-w-3xl mx-auto'>
//         <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
//           explore our Product
//         </h1>

//         <p className="mt-1 text-gray-500 text-sm dark:text-gray-300">
//           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum quam voluptatibus
//         </p>
//         </div>

//         <div className="grid grid-cols-1 gap-4 mt-8 gap-y-4 md:grid-cols-2  xl:grid-cols-3">
//           {componentsData.map((component, index) => (
//           <div key={index} className="px-4 py-6 border shadow-sm rounded-sm transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-600">
//           <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full dark:text-white dark:bg-blue-500">
//             {component.icon}
//           </span>

//           <h1 className="text-sm font-semibold text-gray-700 capitalize dark:text-white">{component.title}</h1>

//           <p className="text-gray-500 text-xs mt-1 dark:text-gray-300">{component.description}</p>
//         </div>

//           ))}
//         </div>
//       </div>
//     </section>

//    </>
//   )
// }

import { ExternalLink, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function WhyChooseUs() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-blue-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 ">
            <div className="flex items-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
              <h3 className="text-blue-600 font-semibold text-xl ml-2">
                Why Choose Us
              </h3>
              <div className="ml-auto">
                <div className="w-12 h-12 border border-blue-200 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 border border-blue-300 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl text-left l font-semibold text-navy-800">
                Precision, Security, Innovation, Reliability—BotEdgeTrade Delivers
                </h2>

                <p className="text-gray-600 text-base text-left mt-4">
                Our multi-market trading platform is designed to transform your trading experience across Forex, Crypto, and Stock markets with powerful yet accessible tools.

                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700 text-base">
                  Real-time data across all global markets

                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700 text-base">
                  Secure trading environment with advanced encryption
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700 text-base">
                  Intuitive platform suitable for beginners and professionals
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700 text-base">
                  Competitive spreads and transparent fee structure
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Link
                to="/user/login"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-6 rounded-full w-fit flex items-center gap-2 transition duration-300 ${
                  isHovered ? "shadow-lg" : "shadow"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
               Discover More 
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="relative">
              <img src="https://pixner.net/html/tradexy/tradexy/assets/images/about/choose-thumb1.png" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
