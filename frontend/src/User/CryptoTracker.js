import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Users } from 'lucide-react';

const data = [
  { name: '2 am', purchase: 50000, sales: 20000 },
  { name: '4 am', purchase: 47000, sales: 18000 },
  { name: '6 am', purchase: 37000, sales: 10000 },
  { name: '8 am', purchase: 63000, sales: 17000 },
  { name: '10 am', purchase: 62000, sales: 25000 },
  { name: '12 am', purchase: 63000, sales: 18000 },
  { name: '14 pm', purchase: 38000, sales: 12000 },
  { name: '16 pm', purchase: 47000, sales: 17000 },
  { name: '18 pm', purchase: 80000, sales: 40000 },
  { name: '20 pm', purchase: 38000, sales: 10000 },
  { name: '22 pm', purchase: 65000, sales: 30000 },
  { name: '24 pm', purchase: 48000, sales: 22000 },
];

export default function CryptoTracker() {
  const [activeTimeframe, setActiveTimeframe] = useState('3M');
  
  return (
    <div className="lg:flex gap-5 bg-gray-50">
      <div className="bg-white rounded-md border border-gray-300 shadow-sm p-5 lg:w-3/5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <ShoppingCart size={20} className="text-orange-500" />
            </div>
            <span className="font-semibold text-gray-800">Sales & Purchase</span>
          </div>

          {/* Time Filter */}
          <div className="flex rounded-lg bg-gray-100">
            {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                className={`py-1 px-3 text-sm ${
                  activeTimeframe === period
                    ? 'bg-orange-500 text-white rounded-lg'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4 mb-5">
          <div className="bg-gray-50 rounded-lg p-3 w-1/2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Total Purchase</span>
            </div>
            <div className="text-2xl font-bold">3K</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 w-1/2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Total Sales</span>
            </div>
            <div className="text-2xl font-bold">1K</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value === 0 ? '0K' : `${value / 1000}K`}
                domain={[0, 100000]}
                ticks={[0, 20000, 40000, 60000, 80000, 100000]}
              />
              <Bar dataKey="purchase" fill="#FFDFC0" stackId="stack" />
              <Bar dataKey="sales" fill="#F9A826" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:w-2/5 flex flex-col  gap-4">
        <div className="bg-white rounded-md border border-gray-300 shadow-sm p-5 text-gray-800">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-500 flex justify-center items-center">
              <span className="font-bold">ⓘ</span>
            </div>
            <span className="font-semibold text-gray-800">Overall Information</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center">
              <div className="text-blue-500 mb-1">
                <Users size={22} />
              </div>
              <span className="text-sm text-gray-600">Suppliers</span>
              <div className="font-bold">6987</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center">
              <div className="text-orange-500 mb-1">
                <Users size={22} />
              </div>
              <span className="text-sm text-gray-600">Customer</span>
              <div className="font-bold">4896</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center">
              <div className="text-teal-500 mb-1">
                <ShoppingCart size={22} />
              </div>
              <span className="text-sm text-gray-600">Orders</span>
              <div className="font-bold">487</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md border border-gray-300 text-gray-800 shadow-sm p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-800">Customers Overview</span>
            <div className="flex items-center text-sm">
              <span className="mr-1">Today</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="white" stroke="#eee" strokeWidth="10" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#36B37E" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="198.5" 
                  transform="rotate(-90 50 50)" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#F97316" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="63" 
                  transform="rotate(80 50 50)" 
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">5.5K</div>
              <div className="text-orange-500">First Time</div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                ↑ 25%
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-800">3.5K</div>
              <div className="text-teal-500">Return</div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                ↑ 21%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}