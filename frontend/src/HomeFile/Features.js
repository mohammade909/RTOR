import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function ForexTutorial() {
  return (
    <div className="bg-gray-50 lg:min-h-screen ">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="flex">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full -ml-1"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full -ml-1"></div>
          </div>
          <h3 className="text-blue-600 font-medium text-lg">Video Tutorial</h3>
        </div>
        <h2 className="text-3xl font-semibold text-center text-slate-800 mb-2">
        Comprehensive Trading Tutorials

        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        Watch our expert-led video tutorials to master 
        {" "}
          <span className="text-amber-700">
          Forex, Crypto, and Stock trading strategies and build your financial future.
          </span>
        </p>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 col-span-12 rounded-lg overflow-hidden">
            <video
              className="w-full h-100"
              controls
              muted
              loop
              autoPlay
              playsInline
              preload="none"
            >
              <source
                src="https://softivuspro.com/pic/vid/videoplayback%20(2).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="lg:col-span-2 col-span-12">
            <div className="grid grid-cols-2 border-b border-gray-200 mb-6">
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold text-slate-800">
                350<span className="text-orange-500">+</span>
                </h2>
                <p className="text-purple-700 text-sm">Trading Tutorials
                </p>
              </div>
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold text-slate-800">
                18<span className="text-orange-500">K</span>
                </h2>
                <p className="text-purple-700 text-sm"> Monthly Views</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span className="text-slate-700">Market analysis fundamentals across Forex, Crypto, and Stocks
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span className="text-slate-700">Advanced trading strategies for multiple markets
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span className="text-slate-700">
                Risk management techniques for consistent profitability
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span className="text-slate-700">
                Technical analysis tools and practical applications

                </span>
              </li>
            </ul>
            <Link to="/user/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full w-fit flex items-center justify-center gap-2 transition-colors">
            Explore All Tutorials 
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
