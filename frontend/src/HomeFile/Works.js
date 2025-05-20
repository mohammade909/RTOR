import React from 'react';

export default function Works() {
  const steps = [
    {
      title: "Create Account ",
      description: "Open your BotEdgeTrade account with quick verification to access all trading features",
      icon: "https://pixner.net/html/tradexy/tradexy/assets/images/icon/customer-support.png",
    },
    {
      title: "Select Market",
      description: "Choose which markets to follow: Forex pairs, Cryptocurrencies, Stocks, or all three",
      icon: "https://pixner.net/html/tradexy/tradexy/assets/images/icon/choose.png",
    },
    {
      title: "Set Parameters",
      description: "Customize your signal preferences based on your risk tolerance and trading goals",
      icon: "https://pixner.net/html/tradexy/tradexy/assets/images/icon/select-account.png",
    },
    {
      title: "Begin Trading",
      description: " Execute trades directly from signals or use them to inform your own strategy",
      icon: "https://pixner.net/html/tradexy/tradexy/assets/images/icon/profit-sharing.png",
    },
  ];
  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Half Background Color */}
      <div className="absolute top-0 left-0 w-full h-[360px] bg-blue-50 z-0"></div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-400 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-300 rounded-full"></span>
          </span>
          <span className="text-blue-600 font-medium">How to copy trades</span>
        </div>

        <h2 className="text-3xl  font-semibold text-center text-gray-800 mb-2 max-w-2xl mx-auto leading-tight">
        Start trading with expert-powered market signals

        </h2>

        <p className="text-center text-gray-600 max-w-2xl text-base mx-auto mb-12">
        Access BotEdgeTrade's premium signal service with professional recommendations across Forex, Crypto, and Stock markets. These signals help you identify profitable opportunities with confidence.

        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, i) => (
            <div key={i} className="bg-[#132f590d] border border-gray-300 p-4 rounded-sm shadow-sm relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -right-2 -top-2">
                    <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-white border-[2px] border-dashed border-blue-300 flex items-center justify-center text-blue-600">
                    <img src={step.icon} alt={step.title} className="w-12" />
                  </div>
                </div>
              </div>
              <h3 className="text-base font-semibold text-center text-gray-800 mb-1">{step.title}</h3>
              <p className="text-sm text-center text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block absolute right-0 top-[360px] -translate-y-full z-10">
        <img
          src="https://pixner.net/html/tradexy/tradexy/assets/images/review/working-trades-ele.png"
          alt="Trader with tablet"
          className="w-48 object-contain"
        />
      </div>
    </div>
  );
}
