import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  User,
  BarChart2,
  DollarSign,
  Percent,
  Shield,
  Activity,
  Check,
  Copy,
} from "lucide-react";
import TradeNow from "./TradeNow";

function getActiveSinceInfo(createdAt) {
  const createdDate = new Date(createdAt);
  const today = new Date();

  // Format Month Year
  const options = { year: "numeric", month: "long" };
  const formattedDate = createdDate.toLocaleDateString("en-US", options);

  // Calculate month difference
  let months =
    (today.getFullYear() - createdDate.getFullYear()) * 12 +
    (today.getMonth() - createdDate.getMonth());

  months = months <= 0 ? 0 : months; // Ensure not negative

  return {
    formattedDate, // e.g., "March 2023"
    monthsActive: months, // e.g., 14
    displayText: `Active Since\n${formattedDate}\n${months} months`,
  };
}

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCopied, setIsCopied] = useState(false);
  // Mock chart data
  const chartData = [20, 45, 28, 80, 99, 43, 50, 65, 35, 88, 70, 81];
  const maxValue = Math.max(...chartData);

  const registerUrl = `https://www.goldfoxmarket.com/registration?referral=${user?.refferal_code}`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(registerUrl)
      .then(() => {
        alert("Referral link copied to clipboard!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy referral link: ", err);
      });
  };
  const limit =
  user?.active_plan * 5;

const usedLimit = (
  (user?.roi_income ?? 0) +
  (user?.level_month ?? 0) +
  Number(user?.community_income) +
  (user?.reward ?? 0) +
  Number(user?.direct_income ) +
  (user?.total_salary ?? 0)
).toFixed(2);
  return (
    <div className=" bg-gray-900 rounded-md shadow-2xl overflow-hidden border border-gray-800">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 p-6">
        {/* Avatar and user info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 p-0.5">
              <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src="/default.png"
                  alt="Trader avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-900"></div>
          </div>

          <div className="ml-4">
            <div className="flex items-center">
              <h2 className="text-white font-bold text-xl">{user?.fullname}</h2>
              <div className="flex ml-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <Award className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-gray-300 text-xs">{user?.email}</span>
              {user?.active_plan > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs text-white font-medium ml-2">
                  Pro Trader
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Performance overview */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-green-400 font-bold text-2xl flex items-center justify-center">
              +{Number(user?.roi_income).toLocaleString()}
              <TrendingUp className="h-4 w-4 ml-1" />
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Rent Income
            </p>
          </div>

          <div className="text-center m-auto">
            <div className="text-white font-bold text-xl flex items-center justify-center">
              <button
                onClick={handleCopy}
                className={`transition-all duration-300  ${
                  isCopied
                    ? "bg-green-500/20 border-green-400 text-green-200"
                    : " text-white"
                }`}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <>
                    <span className="flex items-center gap-4">
                      {" "}
                      {user?.refferal_code} <Copy className="h-4 w-4" />
                    </span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Referral Code
            </p>
            <div className="mt-6">
              {isCopied && (
                <p className="text-green-300 text-xs mt-1.5 text-center animate-pulse">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-amber-400 font-bold text-2xl flex items-center justify-center">
              {Number(user?.active_plan).toLocaleString()}
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Active Plan
            </p>
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="p-4 bg-gray-800">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-gray-300 text-sm font-medium">
              Start AI Trade
            </span>
          </div>
          <div className="text-green-500 flex items-center text-sm font-medium">
            +$3,241.65
            <TrendingUp className="h-3 w-3 ml-1" />
          </div>
        </div>
        {/* {user?.active_plan > 0 &&
        <TradeNow  />} */}
        <div className="h-12 flex items-end space-x-1">
          {chartData.map((value, index) => (
            <div
              key={index}
              className={`w-full h-${Math.ceil((value / maxValue) * 10)} ${
                index % 2 === 0 ? "bg-blue-500" : "bg-indigo-600"
              } rounded-t-sm`}
            ></div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${
            activeTab === "overview"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${
            activeTab === "stats"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${
            activeTab === "assets"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Assets
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-gray-300 text-sm">Remaining Limit</p>
                  <p className="text-white font-medium">
                    ${Number(limit - usedLimit).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* <span className="text-green-500 text-sm">+$1,240 today</span> */}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <p className="text-gray-300 text-sm">Reffer By</p>
                  {/* <p className="text-white font-medium">{getActiveSinceInfo(user?.created_at).formattedDate}</p> */}
                  <p className="text-white font-medium">{user?.reffer_by}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {getActiveSinceInfo(user?.created_at).monthsActive}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <User className="h-5 w-5 text-purple-400 mr-2" />
                <div>
                  <p className="text-gray-300 text-sm">Web3 Address</p>
                  <p className="text-white font-normal"> {user?.bep20?.substring(0, 10)}...{user?.bep20?.substring(user?.bep20?.length - 8)}</p>
                </div>
              </div>
              {/* <span className="text-green-500 text-sm">+86 this week</span> */}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Best Trade</p>
                <p className="text-green-500 font-bold text-lg">+$8,245</p>
                <p className="text-gray-500 text-xs">ETH/USD • Jan 15</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Worst Trade</p>
                <p className="text-red-500 font-bold text-lg">-$1,632</p>
                <p className="text-gray-500 text-xs">BTC/USD • Feb 28</p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Profit Factor</span>
                <span className="text-white font-medium">3.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg. Holding Time</span>
                <span className="text-white font-medium">4.2 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Risk/Reward Ratio</span>
                <span className="text-white font-medium">1:2.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Sharpe Ratio</span>
                <span className="text-white font-medium">1.87</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  BTC
                </div>
                <div className="ml-3">
                  <p className="text-white">Bitcoin</p>
                  <p className="text-gray-400 text-xs">42% Portfolio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">1.2 BTC</p>
                <p className="text-green-500 text-xs flex items-center justify-end">
                  +8.2% <TrendingUp className="h-3 w-3 ml-1" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  ETH
                </div>
                <div className="ml-3">
                  <p className="text-white">Ethereum</p>
                  <p className="text-gray-400 text-xs">28% Portfolio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">12.4 ETH</p>
                <p className="text-green-500 text-xs flex items-center justify-end">
                  +5.7% <TrendingUp className="h-3 w-3 ml-1" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  SOL
                </div>
                <div className="ml-3">
                  <p className="text-white">Solana</p>
                  <p className="text-gray-400 text-xs">15% Portfolio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">120 SOL</p>
                <p className="text-red-500 text-xs flex items-center justify-end">
                  -2.3% <TrendingDown className="h-3 w-3 ml-1" />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
