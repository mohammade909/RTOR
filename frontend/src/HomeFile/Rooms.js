// import React from 'react';

// export const Rooms = () => {
//   const rooms = [
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/1-2.jpg',
//       price: '15$ / Night',
//       name: 'Junior Suite',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/2-1.jpg',
//       price: '20$ / Night',
//       name: 'Deluxe Room',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/3-1.jpg',
//       price: '18$ / Night',
//       name: 'Superior Room',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/4-1.jpg',
//       price: '22$ / Night',
//       name: 'Luxury Suite',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/5-1.jpg',
//       price: '25$ / Night',
//       name: 'Presidential Suite',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/6-1.jpg',
//       price: '17$ / Night',
//       name: 'Executive Room',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/7-1.jpg',
//       price: '16$ / Night',
//       name: 'Twin Room',
//     },
//     {
//       img: 'https://shthemes.net/demosd/thecappawp/wp-content/uploads/2022/04/5-1.jpg',
//       price: '30$ / Night',
//       name: 'Royal Penthouse',
//     },
//   ];

//   return (
//     <section className="bg-white text-gray-800 py-16 font-sheif">
//       <div className="max-w-7xl mx-auto lg:px-0 px-5">
//         <div className="text-center mb-14">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
//             Rooms for Buy
//           </h2>
//           <p className="text-lg md:text-xl text-gray-500">Experience comfort and elegance at affordable prices</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
//           {rooms.map((room, index) => (
//             <div
//               key={index}
//               className="relative rounded-3xl overflow-hidden shadow-lg group transform transition duration-500 hover:scale-105"
//             >
//               <img
//                 src={room.img}
//                 alt={room.name}
//                 className="w-full h-72 object-cover"
//               />

//               {/* Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
//                 <p className="text-white text-lg font-medium">{room.price}</p>
//                 <h3 className="text-white text-2xl font-bold">{room.name}</h3>
//                 {/* Optional room description */}
//                 {/* <p className="text-white text-sm mt-1">Includes breakfast & WiFi</p> */}
//               </div>

//               {/* Booking Button */}
//               <div className="absolute top-4 right-4">
//                 <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-gray-100 transition">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };



import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Rooms = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  const rooms = [
    {
      price: '15$ / Night',
      name: 'Junior Suite',
      description: 'Includes breakfast & WiFi',
      img:"/room1.jpg"
    },
    {
      price: '20$ / Night',
      name: 'Deluxe Room',
      description: 'Includes breakfast & WiFi',
      img:"/room2.jpg"
    },
    {
      price: '18$ / Night',
      name: 'Superior Room',
      description: 'Includes breakfast & WiFi',
      img:"/room3.jpg"
    },
    {
      price: '22$ / Night',
      name: 'Luxury Suite',
      description: 'Includes breakfast & WiFi',
      img:"/room4.avif"
    },
    {
      price: '25$ / Night',
      name: 'Presidential Suite',
      description: 'Includes breakfast & WiFi',
      img:"/room5.avif"
    },
    {
      price: '17$ / Night',
      name: 'Executive Room',
      description: 'Includes breakfast & WiFi',
      img:"/room6.jpg"
    },

  ];

  // Number of slides to show based on screen size
  const getVisibleSlides = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    }
    return 3; // Default for SSR
  };
  
  const [visibleSlides, setVisibleSlides] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };
    
    setVisibleSlides(getVisibleSlides());
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalSlides = Math.ceil(rooms.length - visibleSlides + 1);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };
  
  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeIndex, totalSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -150) {
      prevSlide();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">        {/* Header with elegant styling */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block">
            Rooms for Buy
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Experience comfort and elegance at affordable prices
          </p>
        </div>

        {/* Main slider container with enhanced styling */}
        <div 
          className="relative px-8 md:px-12" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
        >
          {/* Navigation Buttons with improved styling */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-yellow-600 hover:text-yellow-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-yellow-600 hover:text-yellow-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slider track with smooth animation */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ 
                transform: `translateX(-${activeIndex * (100 / visibleSlides)}%)`,
              }}
            >
              {rooms.map((room, index) => (
                <div 
                  key={index}
                  className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 py-2 transition-opacity duration-500`}
                  style={{ 
                    opacity: Math.abs(activeIndex - index) > visibleSlides ? 0.3 : 1 
                  }}
                >
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 h-full border border-gray-100">
                    <div className="relative overflow-hidden">
                      {/* Using placeholder image with zoom effect on hover */}
                      <div className="overflow-hidden h-64">
                        <img 
                          src={room.img}
                          alt={room.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Gradient Overlay with animation */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                      
                      {/* Price tag with animated hover effect */}
                      <div className="absolute bottom-4 left-4 transform transition-transform duration-500 group-hover:translate-y-1">
                        <span className="bg-yellow-600 text-white py-2 px-4 rounded-md font-bold text-sm shadow-lg">
                          {room.price}
                        </span>
                      </div>
                      
                      {/* Room name overlay */}
                      <div className="absolute hidden sm:block bottom-4 right-4 text-right">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {room.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-900 block sm:hidden font-semibold text-base">{room.name}</p>
                      <p className="text-gray-800 mb-6 text-sm">{room.description}</p>
                      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg duration-300 shadow-md hover:shadow-xl transform hover:scale-105 transition-transform">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improved dots indicator */}
        <div className="flex justify-center mt-10 space-x-1">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button 
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 transition-all duration-300 rounded-full ${
                activeIndex === idx 
                  ? 'bg-yellow-600 w-8' 
                  : 'bg-gray-300 w-3 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}