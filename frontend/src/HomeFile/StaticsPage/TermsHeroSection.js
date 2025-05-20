import React from 'react';
import { TrendingUp, Globe, Compass, ChevronRight } from 'lucide-react';

export const TermsHeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-tr from-blue-100 via-orange-400/70 to-gray-900/60">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Currency Symbols - Floating Animation */}
      <div className="hidden lg:block">
        <div className="absolute top-20 left-20 text-5xl opacity-10 animate-float-slow">€</div>
        <div className="absolute top-60 right-40 text-6xl opacity-10 animate-float-medium">$</div>
        <div className="absolute bottom-20 left-1/3 text-7xl opacity-10 animate-float-fast">¥</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 animate-float-slow">£</div>
      </div>
      
      <div className="max-w-7xl mx-auto lg:px-0 px-5 sm:py-20 py-10 md:py-28 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm mb-8">
                <a href="/" className="text-gray-500 hover:text-amber-600 transition-colors flex items-center">
                  Home
                </a>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-amber-700 font-medium"></span>Terms & Conditions
              </nav>
              
              {/* Title with Animation */}
              <div className="relative mb-6">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-300 rounded-full opacity-20 blur-xl"></div>
          
                <h1 className="sm:text-3xl text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Terms & Conditions
                </h1>
              </div>
              
              <p className="sm:text-xl text-gray-700 mb-8 leading-relaxed">
                By using R2R Globle’s services, you agree to follow the terms outlined below. These terms are designed to protect your rights, define responsibilities, and ensure a secure investment experience.  
              </p>
            </div>
          </div>
          
          {/* Right Content - Trading Visual */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
              
        <img src="/herosections1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}