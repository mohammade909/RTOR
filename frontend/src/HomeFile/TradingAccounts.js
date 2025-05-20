import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Globe,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function WhyChooseR2R() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: "Real Assets, Not Promises",
      desc: "At R2R Globle, you invest in actual operating hotels—not ideas or undeveloped plans. These are verified properties that already generate consistent revenue.",
      color: "bg-amber-600",
      textColor: "text-amber-600",
      img: "/whychoose1.avif",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Monthly Passive Returns",
      desc: "Enjoy consistent monthly income based on real hotel bookings and performance.",
      color: "bg-green-600",
      textColor: "text-green-600",
      img:"/whychoose2.avif"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-white" />,
      title: "Low Entry Barrier",
      desc: "Start investing with as little as $100 and scale your portfolio at your own pace.",
      color: "bg-blue-600",
      textColor: "text-blue-600",
      img:"/whychoose3.avif"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Full Transparency",
      desc: "Access detailed reports, real-time dashboards, and legal documentation for every investment.",
      color: "bg-yellow-600",
      textColor: "text-yellow-600",
      img:"/whychoose4.avif"
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Global Reach, Local Expertise",
      desc: "Invest in hotels in top-performing global markets, selected by our expert team.",
      color: "bg-rose-600",
      textColor: "text-rose-600",
      img:"/whychoose5.avif"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: "Security You Can Trust",
      desc: "All investments are legally backed and protected through smart contracts and secure agreements.",
      color: "bg-indigo-600",
      textColor: "text-indigo-600",
      img:"/whychoose6.avif"
    },
  ];

  return (
    <section
      className={`py-24 px-1 bg-gray-100 transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Dark Background with Animated Pattern */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.15),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl  mx-auto lg:px-0 px-5 relative z-10">
        {/* Main Title Area */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-pink-500 mb-6">
            <div className="bg-gray-900 rounded-full px-6 py-2 flex items-center justify-center">
              <Award className="text-blue-400 w-4 h-4 mr-2" />
              <span className="text-blue-400 text-sm font-medium">
                R2R ADVANTAGES
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Why choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-500 mr-2">
              R2R
            </span>{" "}
            Globle
          </h2>

          <p className="text-gray-800 text-base sm:text-lg">
            R2R Globle stands apart with a platform built on real results,
            strong ethics, and investor-first values. We’re not just a tech
            solution—we’re your trusted partner in global hotel investing.
          </p>
        </div>

        {/* Interactive Feature Display */}
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          {/* Left - Feature Tabs */}
          <div className="md:col-span-5 space-y-2">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg cursor-pointer transition-all flex items-center space-x-4 
                  ${
                    activeTab === idx
                      ? "bg-gray-900 shadow-lg "
                      : "hover:bg-gray-100/50"
                  }`}
                onClick={() => setActiveTab(idx)}
              >
                <div className={`${benefit.color} p-3 rounded-full`}>
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-medium ${
                      activeTab === idx ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {benefit.title}
                  </h3>
                </div>
                <div
                  className={`transition-transform ${
                    activeTab === idx ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Right - Feature Detail */}
          <div className="md:col-span-7 px-5 relative">
            <div className="bg-yellow-50 rounded-2xl border-3 p-8 h-full transform transition-all duration-500">
              <div
                className={`absolute -left-3 top-1/2 w-6 h-6 transform -translate-y-1/2 rotate-45 ${benefits[activeTab].color}`}
              ></div>

              {/* Animated Content */}
              <div className="space-y-3 h-full flex flex-col">
                <div
                  className={`${benefits[activeTab].textColor} text-xl font-semibold mb-2 transition-all duration-300`}
                >
                  {benefits[activeTab].title}
                </div>

                <p className="text-gray-800 text-base flex-grow">
                  {benefits[activeTab].desc}
                </p>
                {benefits[activeTab].img && (
                  <div className="w-full mt-4">
                    <img
                      src={benefits[activeTab].img}
                      alt={benefits[activeTab].title}
                      className="w-full max-h-96 object-cover rounded-lg shadow"
                    />
                  </div>
                )}

                <div
                  className={`flex items-center mt-6 text-sm font-medium ${benefits[activeTab].textColor}`}
                >
                  <span>Learn more about this benefit</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
