import React from 'react';
import { motion } from 'framer-motion';
import { BotIcon } from 'lucide-react';

export const Botsection = () => {
  return (
    <>
    
    <div className="relative bg-gradient-to-r from-[#263283] to-[#ed2924] text-white py-16  md:px-5 lg:px-20 overflow-hidden">
      {/* Floating Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-[#263283] to-[#ed2924] opacity-30 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:px-0  md:flex-row items-center justify-between gap-12 z-10 relative">
        {/* Left Content */}
        

        {/* Animated Bot Graphic or Icon */}
        <motion.div
          className="flex-1 flex justify-center items-center"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className=" rounded-2xl p-1  w-auto  lg:h-[300px] flex items-center justify-center transform rotate-">
            <img src="/BOT4.png" alt="" />
          </div>
        </motion.div>
        <div className="flex-1 md:px-0 px-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
          The Future of Trading with Crypto & AI Bots
          </h2>
          <p className="text-lg text-gray-300 mb-8">
          Gold Fox Market blends the power of AI with the speed of crypto. Our platform helps you trade smarter, faster, and with more confidence using automated, intelligent systems.
          </p>
          <ul className="space-y-4 text-gray-300 text-base">
            <li>✅ Smart AI Bots – Trade automatically with real-time decisions</li>
            <li>✅  Crypto-Friendly – Fast, global, and secure transactions</li>
            <li>✅ 24/7 Auto-Trading – Earn even while you sleep</li>
          </ul>
          <button className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 transition duration-300 rounded-xl font-semibold shadow-lg">
            Get Start Now
          </button>
        </div>
      </div>
    </div>
    
    
    </>
  )
}
