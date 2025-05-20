import React, { useState, useEffect } from 'react';
import {
  Star, Users, Percent, MapPin, DollarSign, Building, Shield, Hotel
} from 'lucide-react';

export default function Overview() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [counts, setCounts] = useState({
    reviews: 0,
    roi: "1-2",
    investors: 0,
    countries: 0
  });

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;

    const targetValues = {
      reviews: 100,
      roi: "1-2",
      investors: 8500,
      countries: 12
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        reviews: Math.ceil(progress * targetValues.reviews),
        roi: Math.ceil(),
        investors: Math.ceil(progress * targetValues.investors),
        countries: Math.ceil(progress * targetValues.countries)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const statistics = [
    {
      value: counts.reviews + "+",
      label: "Verified Hotels",
      description: "Carefully selected, income-generating hotel properties.",
      icon: <Star className="text-amber-500" size={28} />,
      color: "from-amber-500 to-amber-300"
    },
    {
      value: "30%- 60%",
      label: "Monthly Rent Income",
      description: "Enjoy stable earnings based on actual hotel performance.",
      icon: <Percent className="text-emerald-500" size={28} />,
      color: "from-emerald-500 to-emerald-300"
    },
    {
      value: (counts.investors / 1000).toFixed(1) + "k+",
      label: "Investors",
      description: "A growing community of investors who trust us.",
      icon: <Users className="text-indigo-500" size={28} />,
      color: "from-indigo-500 to-indigo-300"
    },
    {
      value: counts.countries + "+",
      label: "Countries",
      description: "Invest in hotels across major globle destinations.",
      icon: <MapPin className="text-rose-500" size={28} />,
      color: "from-rose-500 to-rose-300"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 py-20 lg:py-32 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100 rounded-full -ml-32 -mb-32 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28 relative">
          <div className="relative inline-block mb-10">
            <h3 className="text-3xl font-bold text-rose-600 relative z-10 px-4">Overview</h3>
            <div className="absolute -bottom-3 left-0 w-full h-3 bg-amber-200 opacity-70 -rotate-1 z-0"></div>
          </div>
          <h2 className="sm:text-5xl text-2xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Build Wealth Through Real Hotel Ownership
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
            Experience a new way to grow your income by investing in real, high-performing hotels. R2R Globle connects you with trusted properties that generate steady returns, giving you financial freedom with peace of mind.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 md:p-8 text-center relative overflow-hidden group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.color}`}></div>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 opacity-20 rounded-full"></div>
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-gray-50 opacity-20 rounded-full"></div>

              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-bold text-gray-900 mb-3 relative">
                {stat.value}
                <span className="absolute -top-2 -right-2 text-xs font-medium text-white bg-rose-500 rounded-full w-6 h-6 flex items-center justify-center transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </span>
              </h3>

              <p className="text-lg font-medium text-gray-800 mb-3">{stat.label}</p>

              <div className="h-0 group-hover:h-px bg-gray-200 w-1/2 mx-auto transition-all duration-300 mb-0 group-hover:mb-3"></div>

              <p className="text-gray-500 mt-0 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-b md:border-b-0 md:border-r border-gray-100 pr-0 md:pr-8 pb-8 md:pb-0">
              <DollarSign className="text-amber-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">High Yield</h4>
              <p className="text-gray-600">Get consistent monthly income from hotel bookings.</p>
            </div>
            <div className="border-b md:border-b-0 lg:border-r border-gray-100 pr-0 lg:pr-8 pb-8 md:pb-0">
              <Building className="text-rose-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">Prime Locations</h4>
              <p className="text-gray-600">Invest in top tourist destinations with strong demand.</p>
            </div>
            <div className="border-b lg:border-b-0 lg:border-r border-gray-100 pr-0 lg:pr-8 pb-8 lg:pb-0">
              <Shield className="text-emerald-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">Secure Investment</h4>
              <p className="text-gray-600">Your capital is protected by contracts and legal agreements.</p>
            </div>
            <div>
              <Hotel className="text-indigo-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">Luxury Perks</h4>
              <p className="text-gray-600">Enjoy exclusive perks, detailed reporting, and full transparency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
