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
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-36 flex flex-col items-center">
        {/* Location Badge */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center text-white mb-6 border border-white/20">
          <MapPin size={16} className="mr-2 text-rose-400" />
          <span>{heroImages[activeSlide].location}</span>
          <div className="ml-3 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 flex items-center">
            <Percent size={14} className="mr-1 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">{heroImages[activeSlide].roi}</span>
          </div>
          <div className="flex ml-3 gap-1">
            {heroImages.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeSlide ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight mb-6">
          <span className="relative">
             Invest in  
            <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></span>
          </span>
          {" "}
          <span className="text-rose-400">Real Hotels,</span>:  Earn Real Income
        </h1>
        
        <p className="text-white/80 text-lg md:text-xl text-center max-w-2xl mb-8">
          
R2R Globle makes hotel investment easy, secure, and accessible for everyone around the world. Start building a passive income stream by owning a share in income-generating hotels.
        </p>
        
        {/* Tab Switch */}
        <div className="bg-white/10 backdrop-blur-md rounded-full p-1 mb-8 border border-white/20 flex">
          <button 
            className={`px-6 py-2 rounded-full transition-all ${
              investmentTab === 'stay' 
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setInvestmentTab('stay')}
          >
            Book a Stay
          </button>
          <button 
            className={`px-6 py-2 rounded-full transition-all ${
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
        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center text-white">
            <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center mr-3">
              <Star size={18} className="text-rose-400" />
            </div>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center mr-3">
              <DollarSign size={18} className="text-amber-400" />
            </div>
            <span>Guaranteed Returns</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center mr-3">
              <Percent size={18} className="text-emerald-400" />
            </div>
            <span>10-15% Annual ROI</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
              <Briefcase size={18} className="text-blue-400" />
            </div>
            <span>Portfolio Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}