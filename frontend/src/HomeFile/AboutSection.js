// import React from 'react';

// export default function AboutSection() {
//   return (
//     <section className="bg-white py-16">
//       <div className="max-w-7xl mx-auto lg:px-0 px-5 md:px-8">
//         {/* Main Content Container */}
//         <div className="flex flex-col lg:flex-row gap-12">
//           {/* Text Content Section */}
//           <div className="lg:w-1/2 space-y-6">
//             <div className="space-y-4">
//               <h4 className="text-yellow-700  text-lg tracking-wider">THE CAPPA LUXURY HOTEL</h4>
//               <h2 className="text-4xl md:text-5xl  text-gray-800 font-light">Enjoy a Luxury Experience</h2>
              
//               <div className="w-20 h-0.5 bg-yellow-700 my-6"></div>
              
//               <p className="text-gray-600 leading-relaxed">
//                 Welcome to the best five-star deluxe hotel in New York. Hotel elementum sesue the aucan vestibulum aliquam justo in sapien rutrum volutpat. Donec in quis the pellentesque velit. Donec id velit ac arcu posuere blane.
//               </p>
//               <p className="text-gray-600 leading-relaxed">
//                 Hotel ut nisl quam nestibulum ac quam nec odio elementum sceisue the aucan ligula. Orci varius natoque penatibus et magnis dis parturient monte nascete ridiculus mus nellentesque habitant morbine.
//               </p>
//             </div>
            
//             {/* Reservation Box */}
//             <div className="bg-yellow-50 p-6 border-l-4 border-yellow-700 flex items-center mt-8">
   
//               <div className="ml-auto">
//                 <svg className="w-12 h-12 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* Images Section */}
//           <div className="lg:w-1/2">
//             <div className="grid grid-cols-12 gap-4">
//               <div className="col-span-12 md:col-span-7">
//                 <img 
//                   src="https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/06/2-1.jpg" 
//                   alt="Hotel Interior" 
//                   className="w-full h-full object-cover rounded shadow-lg"
//                 />
//               </div>
//               <div className="col-span-12 md:col-span-5 md:mt-16">
//                 <img 
//                   src="https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/06/8.jpg" 
//                   alt="Hotel Room" 
//                   className="w-full h-full object-cover rounded shadow-lg" 
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-24 relative overflow-hidden"> 
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full -mr-32 -mt-32 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-50 rounded-full -ml-24 -mb-24 opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Text Content Section */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-6">
         
              
              <h2 className="text-4xl md:text-5xl text-gray-800 font-semibold">
                Why You Can Trust <span className="text-yellow-700">R2R</span>  Globle
              </h2>  
              
              <div className="w-24 h-0.5 bg-yellow-700 my-8"></div>
              
              <div className="pl-5 border-l-2 border-yellow-200">
                <p className="text-gray-600 leading-relaxed text-lg">
                 At R2R Globle, we bring you real investment opportunities in operational hotels that generate steady income. With our platform, you don’t just invest—you become a stakeholder in a growing hospitality business. Every booking made by guests turns into earnings for you.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg mt-4">
                  Our process is clear, secure, and built for globle investors. Whether you're starting small or scaling up, your investment is backed by transparency and trust. Join a globle network of investors and watch your money work—automatically and consistently.
                </p>
              </div>
            </div>
            
            {/* Reservation Box */}
            {/* <div className="bg-yellow-50 p-8 border-l-4 border-yellow-700 flex items-center mt-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-800">Reservations</h3>
                <p className="text-yellow-700 font-medium">+1 (555) 123-4567</p>
              </div>
              <div className="ml-auto bg-white rounded-full p-3 shadow-md">
                <svg className="w-10 h-10 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div> */}
          </div>
          
          {/* Images Section */}
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-12 gap-5 relative">
              {/* Main image with decorative frame */}
              <div className="col-span-12 md:col-span-7 relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-200 rounded-lg"></div>
                <img 
                  src="/about1.jpg" 
                  alt="Hotel Interior" 
                  className="w-full h-full object-cover rounded-lg shadow-xl relative z-10"
                />
              </div>
              
              {/* Second image with floating effect */}
              <div className="col-span-12 md:col-span-5 md:mt-16 relative">
                <div className="absolute -bottom-3 -right-3 w-1/2 h-1/2 bg-yellow-100 rounded-lg"></div>
                <img 
                  src="/about2.jpg" 
                  alt="Hotel Room" 
                  className="w-full h-full object-cover rounded-lg shadow-xl relative z-10" 
                />
                
                {/* Decorative badge */}
                <div className="absolute -top-6 -right-6 bg-yellow-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-20">
                  <span className="text-xs font-medium">LUXURY</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-10 right-10 w-20 h-20 border-2 border-yellow-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="flex items-center justify-center mt-16 mb-8">
          <div className="w-16 h-0.5 bg-yellow-200"></div>
          <div className="w-3 h-3 bg-yellow-700 rounded-full mx-4"></div>
          <div className="w-16 h-0.5 bg-yellow-200"></div>
        </div>
        
        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 hover:bg-yellow-50 rounded-lg transition-colors duration-300">
            <svg className="w-12 h-12 text-yellow-700 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800">Luxury Rooms</h3>
          </div>
          <div className="p-6 hover:bg-yellow-50 rounded-lg transition-colors duration-300">
            <svg className="w-12 h-12 text-yellow-700 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800">Fine Dining</h3>
          </div>
          <div className="p-6 hover:bg-yellow-50 rounded-lg transition-colors duration-300">
            <svg className="w-12 h-12 text-yellow-700 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800">Prime Location</h3>
          </div>
        </div>
      </div>
    </section>
  );
}