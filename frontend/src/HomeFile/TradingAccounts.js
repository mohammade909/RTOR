// import React from 'react';
// import { ShieldCheck, TrendingUp, DollarSign, Users, Clock } from 'lucide-react';

// export const TradingAccounts = () => {
//   const benefits = [
//     {
//       icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
//       title: 'Robust Security',
//       desc: 'Military-grade encryption protects your assets and data 24/7.',
//     },
//     {
//       icon: <TrendingUp className="w-8 h-8 text-green-400" />,
//       title: 'Smart ROI Engine',
//       desc: 'AI-driven strategy delivers consistent, risk-adjusted returns.',
//     },
//     {
//       icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
//       title: 'Flexible Investments',
//       desc: 'Start small or scale up anytime. No hidden fees or lock-ins.',
//     },
//     {
//       icon: <Users className="w-8 h-8 text-blue-400" />,
//       title: 'Referral Rewards',
//       desc: 'Earn extra by inviting others—unlock multi-level commissions.',
//     },
//     {
//       icon: <Clock className="w-8 h-8 text-red-400" />,
//       title: 'Real-Time Insights',
//       desc: 'Live dashboard keeps you in control of every market move.',
//     },
//     {
//       icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
//       title: 'Robust Security',
//       desc: 'Military-grade encryption protects your assets and data 24/7.',
//     },
//   ];

//   return (
//     <section className="relative text-gray-900 py-24 overflow-hidden">
//       {/* Section Heading */}
//       <div className="max-w-6xl mx-auto px-6 text-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">
//           Why Choose <span className="text-orange-500">R2R Global</span>
//         </h2>
//         <p className="text-lg text-slate-800 max-w-2xl mx-auto">
//           A powerful platform designed to maximize your profits, minimize risk, and simplify your journey.
//         </p>
//       </div>

//       {/* Glass Benefit Cards */}
//       <div className="mt-20 max-w-7xl mx-auto lg:px-0 px-5 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
//         {benefits.map((item, idx) => (
//           <div
//             key={idx}
//             className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/10 hover:shadow-orange-500/30 transition-transform  relative"
//           >
//             {/* Gradient Icon Ring */}
//             <div className="mb-5 flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-purple-500 p-[2px]">
//               <div className="bg-[#0f172a] rounded-full w-full h-full flex items-center justify-center">
//                 {item.icon}
//               </div>
//             </div>

//             <h3 className="text-xl font-semibold text-gray-900 text-center">{item.title}</h3>
//             <p className="mt-2 text-slate-800 text-center">{item.desc}</p>
//           </div>
//         ))}
//       </div>


//       {/* Visual Accent */}
//       <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500 opacity-10 rounded-full blur-3xl pointer-events-none animate-pulse" />
//       <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600 opacity-10 rounded-full blur-2xl pointer-events-none animate-pulse" />
//     </section>
//   );
// };



import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Users, Clock, ChevronRight, Star, Award, BarChart4 } from 'lucide-react';

export const TradingAccounts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elements = document.querySelectorAll('.benefit-card');
      
      elements.forEach((el, index) => {
        if (el.offsetTop < scrollPosition - 100) {
          setTimeout(() => {
            setActiveCard(prev => prev === null ? 0 : Math.max(prev, index));
          }, index * 120);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated benefit items with additional content
  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
      title: 'Real Assets, Not Promises',
      desc: ' Invest in actual operational hotels with verified income—not future blueprints or concepts.',
      highlight: '256-bit encryption',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: 'Monthly Passive Returns',
      desc: ' Enjoy consistent monthly income based on real hotel bookings and performance.',
      highlight: '+15% avg. returns',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      title: 'Low Entry Barrier',
      desc: ' Start investing with as little as $100 and scale your portfolio at your own pace.',
      highlight: 'No minimum deposit',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: 'Full Transparency',
      desc: ' Access detailed reports, real-time dashboards, and legal documentation for every investment.',
      highlight: 'Up to 20% commission',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Clock className="w-8 h-8 text-red-400" />,
      title: 'Global Reach, Local Expertise',
      desc: ' Invest in hotels located in top-performing global markets, selected by our expert team.',
      highlight: 'Under 0.5s latency',
      color: 'from-red-400 to-rose-500'
    },
    {
      icon: <BarChart4 className="w-8 h-8 text-purple-400" />,
      title: 'Security You Can Trust',
      desc: ' All investments are legally backed and protected through smart contracts and secure agreements.',
      color: 'from-purple-400 to-violet-500'
    },
  ];

  // Featured statistics
  const stats = [
    { value: '$150M+', label: 'in Hotel Transactions' },
    { value: '25+', label: 'Countries Investors' },
    { value: '$5.4M+', label: 'Paid Out to Investors' },
    { value: '97.3%', label: 'Investor Retention Rate' }
  ];

  return (
    <section className="relative text-gray-900 py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50 opacity-80"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 opacity-5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-300 to-purple-300 opacity-20"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">        
        {/* Section Heading with animated reveal */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-purple-100 px-5 py-2 rounded-full shadow-sm mb-6">
            <Award className="text-orange-500 h-5 w-5" />
            <span className="text-orange-800 font-medium text-sm">Industry-Leading Platform</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-purple-600">
            Why Choose <span className="relative text-blue-500">
              R2R Global
              <div className="absolute h-1 w-full bg-gradient-to-r from-orange-400 to-purple-400 bottom-0 left-0 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            A platform built on real results, strong ethics, and investor-first values. We're not just a tech solution—we're your trusted partner in global hotel investing.
          </p>
          
          {/* Stats showcase */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-10 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-orange-200 hover:-translate-y-1">
                  <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Glass Benefit Cards with staggered animation */}
        <div className="mt-16 grid gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className={`benefit-card group bg-white backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-xl border border-orange-100 hover:border-transparent transition-all duration-500 relative overflow-hidden ${activeCard >= idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ 
                transitionDelay: `${idx * 150}ms`,
                boxShadow: '0 10px 40px -10px rgba(255, 125, 26, 0.15)'
              }}
            >
              {/* Gradient background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100/30 to-purple-100/30 -translate-y-1/2 translate-x-1/2 rounded-full blur-xl group-hover:blur-lg transition-all duration-500 opacity-80"></div>
              
              {/* Animated gradient border effect on hover */}
              <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" style={{ background: `linear-gradient(90deg, ${item.color.split(' ')[0].replace('from-', '')}, ${item.color.split(' ')[1].replace('to-', '')})` }}></div>
              
              {/* Gradient Icon Ring with raised effect */}
              <div className="mb-6 relative z-10">
                <div className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.color} p-[2px] group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-slate-700 mb-4">{item.desc}</p>
                

                
                {/* Subtle learn more link */}
                <div className="flex justify-center">
                  <a href="#" className="text-sm font-medium text-orange-500 flex items-center hover:text-orange-700 transition-colors">
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
