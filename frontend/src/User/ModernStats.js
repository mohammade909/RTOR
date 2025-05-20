import { useState } from 'react';
import { 
  LineChart, 
  BarChart, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight, 
  Trophy,
  Users,
  CreditCard,
  ShoppingBag,
  Calendar,
  Star,
  Heart,
  Circle
} from 'lucide-react';

export default function ModernStats() {
  const [selectedMetric, setSelectedMetric] = useState('sales');
  
  // Sample data for different metrics
  const metrics = {
    sales: {
      value: '$42,856',
      change: '+24.5%',
      positive: true,
      color: 'from-blue-500 to-indigo-600',
      lightColor: 'blue-500',
      darkColor: 'blue-600',
      icon: <CreditCard className="h-5 w-5" />,
      data: [28, 35, 22, 38, 25, 42, 32, 45, 35, 55, 40, 60]
    },
    users: {
      value: '12,483',
      change: '+18.2%',
      positive: true,
      color: 'from-purple-500 to-fuchsia-600',
      lightColor: 'purple-500',
      darkColor: 'purple-600',
      icon: <Users className="h-5 w-5" />,
      data: [18, 25, 32, 28, 35, 26, 42, 38, 45, 36, 48, 52]
    },
    orders: {
      value: '3,746',
      change: '-5.8%',
      positive: false,
      color: 'from-amber-500 to-orange-600',
      lightColor: 'amber-500',
      darkColor: 'amber-600',
      icon: <ShoppingBag className="h-5 w-5" />,
      data: [35, 42, 38, 30, 25, 22, 18, 24, 28, 32, 25, 20]
    },
    engagement: {
      value: '86.3%',
      change: '+12.7%',
      positive: true,
      color: 'from-green-500 to-emerald-600',
      lightColor: 'green-500',
      darkColor: 'green-600',
      icon: <Heart className="h-5 w-5" />,
      data: [25, 32, 38, 42, 50, 45, 55, 60, 52, 65, 58, 72]
    }
  };
  
  // Get current metric data
  const currentMetric = metrics[selectedMetric];
  
  return (
    <div className="mt-4">
      <div className="bg-gradient-to-br  from-slate-900 to-slate-800 dark:bg-gray-900 rounded-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-0 text-left">
          {/* Badge */}
          <div className="absolute top-6 right-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-medium rounded-full flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Last 30 days
          </div>
          
          <h2 className="text-2xl font-semibold text-white">Performance Analytics</h2>
          <p className="text-gray-400 mt-1">Track your key metrics and business growth</p>
          
          {/* Metric Selection */}
          <div className="flex gap-3 mt-6 pb-2 overflow-x-auto">
            {Object.entries(metrics).map(([key, metric]) => (
              <button 
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`relative flex items-center px-5 py-3 border border-white/20 rounded-md transition-all ${
                  selectedMetric === key 
                    ? `bg-gradient-to-r ${metric.color} text-white shadow-lg` 
                    : 'bg-gray-800 text-gray-300  dark:hover:bg-gray-700'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                  selectedMetric === key 
                    ? 'bg-white/20' 
                    : `bg-${metric.lightColor}/10 dark:bg-${metric.lightColor}/20 text-${metric.darkColor} dark:text-${metric.lightColor}`
                }`}>
                  {metric.icon}
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    selectedMetric === key ? 'text-white' : 'text-gray-300 dark:text-gray-300'
                  }`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                  <p className={`text-xs ${
                    selectedMetric === key ? 'text-white/80' : 'text-gray-400 '
                  }`}>
                    {metric.value}
                  </p>
                </div>
                {selectedMetric === key && (
                  <div className="absolute -bottom-0.5 left-0 right-0 h-1 mx-auto w-12 bg-gray-300 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-md shadow-lg border border-white/20  p-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-gray-400 text-left text-sm font-medium">
                      Total {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                    </h3>
                    <div className="flex items-end mt-2">
                      <span className="sm:text-4xl text-3xl sm:font-bold font-semibold text-gray-300 dark:text-white">{currentMetric.value}</span>
                      <div className={`ml-3 px-2 py-1 rounded-lg text-xs font-medium flex items-center ${
                        currentMetric.positive 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {currentMetric.positive ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                        {currentMetric.change}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${currentMetric.color}`}>
                    {currentMetric.icon}
                  </div>
                </div>
                
                <div className="sm:block hidden h-40 mt-6">
                  <div className="relative h-full">
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="col-span-12 border-t border-gray-200 dark:border-gray-700" />
                      ))}
                      {Array.from({ length: 13 }).map((_, i) => (
                        <div key={i} className="row-span-5 border-l border-gray-200 dark:border-gray-700" />
                      ))}
                    </div>
                    
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full flex items-end justify-between h-full px-2">
                        {currentMetric.data.map((value, index) => {
                          const maxValue = Math.max(...currentMetric.data);
                          const heightPercent = (value / maxValue) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <div 
                                className={`w-full max-w-6 rounded-full bg-gradient-to-t ${currentMetric.color}`}
                                style={{ height: `${heightPercent}%` }}
                              ></div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Rate Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-md shadow-lg border border-white/20  p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-400 dark:text-gray-400 text-sm font-medium">Conversion Rate</h3>
                    <p className="text-2xl font-semibold text-gray-300  mt-2">38.5%</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: '38.5%' }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-300 dark:text-gray-400">Target: 40%</span>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-md shadow-lg border border-white/20  p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-400 text-xs font-medium">Satisfaction</h3>
                    <div className="p-1.5 rounded-md bg-green-100 ">
                      <Star className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-300 dark:text-white">94.2%</p>
                  <div className="mt-2 flex items-center text-xs text-green-300 ">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+5.2%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-md shadow-lg border border-white/20  p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-400  text-xs font-medium">Sessions</h3>
                    <div className="p-1.5 rounded-lg bg-blue-100 ">
                      <Users className="h-3.5 w-3.5 text-blue-500 " />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-300 ">8,492</p>
                  <div className="mt-2 flex items-center text-xs text-blue-300 ">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br  from-gray-800 to-gray-900 rounded-md shadow border border-white/20  p-4 flex items-center">
              <div className="p-2 rounded-lg bg-blue-100  mr-3">
                <LineChart className="h-4 w-4 text-blue-600 " />
              </div>
              <div>
                <p className="text-xs text-gray-400 ">Avg. Time</p>
                <p className="text-sm font-semibold text-gray-300">4m 38s</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br  from-gray-800 to-gray-900 rounded-md shadow border border-white/20  p-4 flex items-center">
              <div className="p-2 rounded-lg bg-green-100  mr-3">
                <BarChart className="h-4 w-4 text-green-600 " />
              </div>
              <div>
                <p className="text-xs text-gray-400 ">Bounce Rate</p>
                <p className="text-sm font-semibold text-gray-300">24.8%</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br  from-gray-800 to-gray-900 rounded-md shadow border border-white/20  p-4 flex items-center">
              <div className="p-2 rounded-lg bg-purple-100  mr-3">
                <Users className="h-4 w-4 text-purple-600 " />
              </div>
              <div>
                <p className="text-xs text-gray-400 ">New Users</p>
                <p className="text-sm font-semibold text-gray-400 ">12.4%</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-md shadow border border-white/20  p-4 flex items-center">
              <div className="p-2 rounded-lg bg-amber-100  mr-3">
                <Circle className="h-4 w-4 text-amber-600 " />
              </div>
              <div>
                <p className="text-xs text-gray-400 ">Goal Completion</p>
                <p className="text-sm font-semibold text-gray-300 ">68.3%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}