import React from "react";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import Faq from "../Faq";
import {
  Code,
  Palette,
  Globe,
  Rocket,
  BarChart,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import Packagessection from "./Packagessection";
import { Serviceherosection } from "./Serviceherosection";
import { Rooms } from "../Rooms";

// New Hero Section Component

// Services Section Component
const ServicesSection = () => {
  const services = [
    {
      title: "Verified Hotel Properties",
      description:
        " Every hotel is carefully vetted for performance and legal compliance.",
      icon: <Code className="h-12 w-12" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Transparent Earnings Dashboard",
      description:
        " Track your income, hotel performance, and portfolio in real time.",
      icon: <Palette className="h-12 w-12" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Legal Ownership Contracts",
      description:
        " Your investment is backed by legal documentation and secure agreements.",
      icon: <Globe className="h-12 w-12" />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Global Investment Access",
      description:
        " Invest in top-performing hotels across multiple countries with ease.",
      icon: <Rocket className="h-12 w-12" />,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div
      id="services"
      className="py-24 bg-gradient-to-br from-gray-200 to-gray-300/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-yellow-400 tracking-wide uppercase">
            Our Services
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-black">
            What Makes Our Service Stand Out
          </p>
          <p className="mt-5 max-w-xl text-xl text-gray-600 mx-auto">
            We bring unmatched value, trust, and performance to your hotel
            investment journey. Here’s what you get when you choose R2R Globle:
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <div
                className={`p-6 bg-gradient-to-r ${service.color} flex justify-center`}
              >
                <div className="text-white">{service.icon}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="mt-4 flex-1 text-gray-300">
                  {service.description}
                </p>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Service Component
export const Service = () => {
  return (
    <>
      <Header />
      <Serviceherosection />
      <ServicesSection />
      <Packagessection />
      {/* <Rooms/> */}
      <Faq />
      <Footer />
    </>
  );
};

export default Service;
