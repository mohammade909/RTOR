// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Search, MapPin, Calendar, User, Star, DollarSign, Percent, Briefcase } from 'lucide-react';

// export default function HotelROIHero() {
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [guests, setGuests] = useState(1);
//   const [investmentTab, setInvestmentTab] = useState('stay'); // 'stay' or 'invest'
//   const [showROICalculator, setShowROICalculator] = useState(false);
//   const [investmentAmount, setInvestmentAmount] = useState(1000);
//   const [rentalRate, setRentalRate] = useState(150);
//   const [occupancyRate, setOccupancyRate] = useState(70);
  
//   const heroImages = [
//     { url: "/hero1.jpg", alt: "Luxury hotel rooms for investment", location: "Paris, France", roi: "12% Annual ROI" },
//     { url: "/hero2.jpg", alt: "Beachfront property with investment opportunity", location: "Bali, Indonesia", roi: "15% Annual ROI" },
//     { url: "/hero3.jpg", alt: "Mountain cabin investment properties", location: "Aspen, USA", roi: "10% Annual ROI" },
//   ];
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const calculateROI = () => {
//     const annualRevenue = rentalRate * 365 * (occupancyRate / 100);
//     const annualROI = (annualRevenue / investmentAmount) * 100;
//     return annualROI.toFixed(2);
//   };
  
//   return (
//     <div className="relative overflow-hidden bg-gray-900 lg:min-h-screen">
//       {/* Background Slider */}
//       <div className="absolute inset-0 z-0">
//         {heroImages.map((image, index) => (
//           <div 
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === activeSlide ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <div className="absolute inset-0 bg-black/40 z-10" />
//             <img 
//               src={image.url} 
//               alt={image.alt}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>
      
//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-40 flex flex-col items-center">
//         {/* Location Badge */}
   
        
//         {/* Main Heading */}
//         <h1 className="sm:text-4xl text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight my-6">
//           <span className="relative">
//              Invest in  
//             <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></span>
//           </span>
//           {" "}
//           <span className="text-rose-400">Real Hotels,</span>:  Earn Real Income
//         </h1>
        
//         <p className="text-white/80 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-8">
          
// R2R Globle makes hotel investment easy, secure, and accessible for everyone around the world. Start building a passive income stream by owning a share in income-generating hotels.
//         </p>
        
//         {/* Tab Switch */}
//         <div className="bg-white/10 backdrop-blur-md rounded-full p-1 mb-8 border border-white/20 flex">
//           <button 
//             className={`px-6 py-2 rounded-full transition-all ${
//               investmentTab === 'stay' 
//                 ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
//                 : 'text-white/70 hover:text-white'
//             }`}
//             onClick={() => setInvestmentTab('stay')}
//           >
//             Book a Stay
//           </button>
//           <button 
//             className={`px-6 py-2 rounded-full transition-all ${
//               investmentTab === 'invest' 
//                 ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
//                 : 'text-white/70 hover:text-white'
//             }`}
//             onClick={() => setInvestmentTab('invest')}
//           >
//             Invest & Earn
//           </button>
//         </div>
        

        
//         {/* Features */}
//         <div className="mt-8 hidden sm:flex flex-wrap justify-center gap-6 md:gap-12">
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center mr-3">
//               <Star size={18} className="text-rose-400" />
//             </div>
//             <span>24/7 Support</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center mr-3">
//               <DollarSign size={18} className="text-amber-400" />
//             </div>
//             <span>Guaranteed Returns</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center mr-3">
//               <Percent size={18} className="text-emerald-400" />
//             </div>
//             <span>1-2 % Daily Rent Income</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
//               <Briefcase size={18} className="text-blue-400" />
//             </div>
//             <span>Portfolio Management</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Search, MapPin, Calendar, User, Star, DollarSign, Percent, Briefcase } from 'lucide-react';

// export default function HotelROIHero() {
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [guests, setGuests] = useState(1);
//   const [investmentTab, setInvestmentTab] = useState('stay'); // 'stay' or 'invest'
//   const [showROICalculator, setShowROICalculator] = useState(false);
//   const [investmentAmount, setInvestmentAmount] = useState(1000);
//   const [rentalRate, setRentalRate] = useState(150);
//   const [occupancyRate, setOccupancyRate] = useState(70);
  
//   const heroImages = [
//     { url: "/hero1.jpg", alt: "Luxury hotel rooms for investment", location: "Paris, France", roi: "12% Annual ROI" },
//     { url: "/hero2.jpg", alt: "Beachfront property with investment opportunity", location: "Bali, Indonesia", roi: "15% Annual ROI" },
//     { url: "/hero3.jpg", alt: "Mountain cabin investment properties", location: "Aspen, USA", roi: "10% Annual ROI" },
//   ];
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const calculateROI = () => {
//     const annualRevenue = rentalRate * 365 * (occupancyRate / 100);
//     const annualROI = (annualRevenue / investmentAmount) * 100;
//     return annualROI.toFixed(2);
//   };
  
//   return (
//     <div className="relative overflow-hidden bg-gray-900 lg:min-h-screen">
//       {/* Background Slider */}
//       <div className="absolute inset-0 z-0">
//         {heroImages.map((image, index) => (
//           <div 
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === activeSlide ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <div className="absolute inset-0 bg-black/40 z-10" />
//             <img 
//               src={image.url} 
//               alt={image.alt}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>
      
//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-40 flex flex-col items-center">
//         {/* Location Badge */}
   
        
//         {/* Main Heading */}
//         <h1 className="sm:text-4xl text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight my-6">
//           <span className="relative">
//              Invest in  
//             <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></span>
//           </span>
//           {" "}
//           <span className="text-rose-400">Real Hotels,</span>:  Earn Real Income
//         </h1>
        
//         <p className="text-white/80 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-8">
          
// R2R Globle makes hotel investment easy, secure, and accessible for everyone around the world. Start building a passive income stream by owning a share in income-generating hotels.
//         </p>
        
//         {/* Tab Switch */}
//         <div className="bg-white/10 backdrop-blur-md rounded-full p-1 mb-8 border border-white/20 flex">
//           <button 
//             className={`px-6 py-2 rounded-full transition-all ${
//               investmentTab === 'stay' 
//                 ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
//                 : 'text-white/70 hover:text-white'
//             }`}
//             onClick={() => setInvestmentTab('stay')}
//           >
//             Book a Stay
//           </button>
//           <button 
//             className={`px-6 py-2 rounded-full transition-all ${
//               investmentTab === 'invest' 
//                 ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
//                 : 'text-white/70 hover:text-white'
//             }`}
//             onClick={() => setInvestmentTab('invest')}
//           >
//             Invest & Earn
//           </button>
//         </div>
        

        
//         {/* Features */}
//         <div className="mt-8 hidden sm:flex flex-wrap justify-center gap-6 md:gap-12">
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center mr-3">
//               <Star size={18} className="text-rose-400" />
//             </div>
//             <span>24/7 Support</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center mr-3">
//               <DollarSign size={18} className="text-amber-400" />
//             </div>
//             <span>Guaranteed Returns</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center mr-3">
//               <Percent size={18} className="text-emerald-400" />
//             </div>
//             <span>1-2 % Daily Rent Income</span>
//           </div>
//           <div className="flex items-center text-white">
//             <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
//               <Briefcase size={18} className="text-blue-400" />
//             </div>
//             <span>Portfolio Management</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, MapPin, Calendar, User, Star, DollarSign, Percent, Briefcase } from 'lucide-react';

export default function HotelROIHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [investmentTab, setInvestmentTab] = useState('stay'); // 'stay' or 'invest'
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [rentalRate, setRentalRate] = useState(150);
  const [occupancyRate, setOccupancyRate] = useState(70);
  
  const heroImages = [
    { url: "/hero1.jpg", alt: "Luxury hotel rooms for investment", location: "Paris, France", roi: "12% Annual ROI" },
    { url: "/hero2.jpg", alt: "Beachfront property with investment opportunity", location: "Bali, Indonesia", roi: "15% Annual ROI" },
    { url: "/hero3.jpg", alt: "Mountain cabin investment properties", location: "Aspen, USA", roi: "10% Annual ROI" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateROI = () => {
    const annualRevenue = rentalRate * 365 * (occupancyRate / 100);
    const annualROI = (annualRevenue / investmentAmount) * 100;
    return annualROI.toFixed(2);
  };
  
  
  return (
    <div className="relative overflow-hidden bg-gray-900 min-h-screen">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={image.url} 
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-24 xl:py-32 flex flex-col items-center">
        {/* Location Badge */}
  
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight mt-0 mb-4 sm:mb-5 md:mb-6">
          <span className="relative inline-block">
            Invest in
            <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></span>
          </span>
          {" "}
          <span className="text-rose-400">Real Hotels,</span> Earn Real Income
        </h1>
        
        <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-2xl mb-5 sm:mb-6 md:mb-8 px-2 sm:px-4">
          R2R Globle makes hotel investment easy, secure, and accessible for everyone around the world. Start building a passive income stream by owning a share in income-generating hotels.
        </p>
        
        {/* Tab Switch */}
        <div className="bg-white/10 backdrop-blur-md rounded-full p-1 mb-5 sm:mb-6 md:mb-8 border border-white/20 flex">
          <button 
            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
              investmentTab === 'stay' 
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setInvestmentTab('stay')}
          >
            Book a Stay
          </button>
          <button 
            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
              investmentTab === 'invest' 
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setInvestmentTab('invest')}
          >
            Invest & Earn
          </button>
        </div>
        
       
        
        {/* Features */}
        <div className="mt-5 sm:mt-6 md:mt-8 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3">
          <div className="flex items-center text-white bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-400/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Star size={16} className="text-rose-400" />
            </div>
            <span className="text-xs sm:text-sm md:text-base">24/7 Support</span>
          </div>
          <div className="flex items-center text-white bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <DollarSign size={16} className="text-amber-400" />
            </div>
            <span className="text-xs sm:text-sm md:text-base">Guaranteed Returns</span>
          </div>
          <div className="flex items-center text-white bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-400/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Percent size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs sm:text-sm md:text-base">1-2% Daily Rent Income</span>
          </div>
          <div className="flex items-center text-white bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-400/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Briefcase size={16} className="text-blue-400" />
            </div>
            <span className="text-xs sm:text-sm md:text-base">Portfolio Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}