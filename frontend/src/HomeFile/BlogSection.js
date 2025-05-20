import { useState } from 'react';
import { Star, DollarSign, TrendingUp, Shield, Zap, ArrowRight, Globe, Award } from 'lucide-react';

export default function ForexBrokerReviews() {
  const [activeTab, setActiveTab] = useState('popular');
  
  const brokers = {
    popular: [
      {
        id: 1,
        name: 'Alpha Trading',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/ic-markets.png',
        rating: 4.8,
        minDeposit: 100,
        spread: 0.7,
        leverage: '1:500',
        platforms: ['MT4', 'MT5', 'WebTrader'],
        regulation: ['FCA', 'ASIC'],
        description: 'Industry-leading forex broker with tight spreads and excellent customer service.',
        promotions: 'Zero commission on first 10 trades'
      },
      {
        id: 2,
        name: 'Globle Markets Pro',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/robofores.png',
        rating: 4.6,
        minDeposit: 200,
        spread: 0.9,
        leverage: '1:400',
        platforms: ['MT4', 'WebTrader', 'Mobile App'],
        regulation: ['CySEC', 'ASIC'],
        description: 'Trusted broker offering competitive pricing and diverse trading instruments.',
        promotions: '20% deposit bonus for new accounts'
      },
      {
        id: 3,
        name: 'Swift Forex',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/etoro.png',
        rating: 4.7,
        minDeposit: 50,
        spread: 1.0,
        leverage: '1:300',
        platforms: ['MT5', 'WebTrader', 'Proprietary'],
        regulation: ['ASIC', 'FCA', 'FINMA'],
        description: 'Fast execution and reliable trading conditions with globle regulatory coverage.',
        promotions: 'Free VPS hosting for accounts over $2,000'
      }
    ],
    recommended: [
      {
        id: 4,
        name: 'Premier FX',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/peppershone.png',
        rating: 4.9,
        minDeposit: 250,
        spread: 0.5,
        leverage: '1:500',
        platforms: ['MT4', 'MT5', 'cTrader'],
        regulation: ['FCA', 'ASIC', 'CySEC'],
        description: 'Premium forex broker with institutional-grade liquidity and research tools.',
        promotions: 'Premium trading signals included'
      },
      {
        id: 5,
        name: 'Horizon Markets',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/ic-markets.png',
        rating: 4.8,
        minDeposit: 100,
        spread: 0.8,
        leverage: '1:400',
        platforms: ['MT4', 'MT5', 'WebTrader'],
        regulation: ['ASIC', 'FSA'],
        description: 'Innovative broker focusing on technology and trading education.',
        promotions: 'Free educational courses for new traders'
      }
    ],
    new: [
      {
        id: 6,
        name: 'Quantum Trading',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/peppershone.png',
        rating: 4.5,
        minDeposit: 50,
        spread: 1.2,
        leverage: '1:200',
        platforms: ['MT5', 'WebTrader'],
        regulation: ['FSA', 'IFSC'],
        description: 'Emerging broker offering AI-powered trading insights and competitive conditions.',
        promotions: 'Risk-free trading for first week'
      },
      {
        id: 7,
        name: 'MarketPulse FX',
        logo: 'https://pixner.net/html/tradexy/tradexy/assets/images/broker/etoro.png',
        rating: 4.4,
        minDeposit: 100,
        spread: 1.0,
        leverage: '1:300',
        platforms: ['MT4', 'Proprietary'],
        regulation: ['ASIC'],
        description: 'New-generation broker with focus on social trading and market analysis.',
        promotions: 'Copy trading features available for all accounts'
      }
    ]
  };
  
  // Function to render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={`${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto text-left my-6 border border-gray-300 bg-white rounded-md shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className=" px-6 py-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-2">Top Forex Brokers</h1>
        <p className="text-gray-700">Compare the best forex brokers for your trading style and needs</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="bg-gray-100 px-6 py-4 border-b">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'popular' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'recommended' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('new')}
          >
            New Brokers
          </button>
        </div>
      </div>
      
      {/* Broker Cards */}
      <div className="p-6">
        <div className="space-y-6">
          {brokers[activeTab].map((broker) => (
            <div key={broker.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Broker Logo & Basic Info */}
                <div className="p-6 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex items-center mb-4">
                    <img src={broker.logo} alt={broker.name} className="w-16 h-16 mr-4 rounded" />
                    <div>
                      <h3 className="font-semibold text-base">{broker.name}</h3>
                      <div className="flex mt-1 items-center">
                        {renderRating(broker.rating)}
                        <span className="ml-2 text-blue-600 font-medium">{broker.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-blue-50 rounded-lg p-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Award size={20} className="text-blue-600 mr-2" />
                      <span className="font-medium">Special Offer</span>
                    </div>
                    <p className="text-sm text-gray-700">{broker.promotions}</p>
                  </div>
                </div>
                
                {/* Key Features */}
                <div className="p-6 md:col-span-2">
                  <h4 className="font-medium text-gray-500 mb-1">BROKER FEATURES</h4>
                  <p className="text-gray-700 mb-4 text-sm">{broker.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <span className='bg-blue-100 rounded-md p-2 mr-2'><DollarSign size={18} className="text-blue-600  " /></span>
                      <div>
                        <p className="text-sm text-gray-500">Min. Deposit</p>
                        <p className="font-medium text-sm">${broker.minDeposit}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                    <span className='bg-blue-100 rounded-md p-2 mr-2'> <TrendingUp size={18} className="text-blue-600 " /></span>
                      <div>
                        <p className="text-sm text-gray-500">Avg. Spread</p>
                        <p className="font-medium text-sm">{broker.spread} pips</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                    <span className='bg-blue-100 rounded-md p-2 mr-2'> <Zap size={18} className="text-blue-600 " /></span>
                      <div>
                        <p className="text-sm text-gray-500">Max Leverage</p>
                        <p className="font-medium text-sm">{broker.leverage}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                    <span className='bg-blue-100 rounded-md p-2 mr-2'> <Shield size={18} className="text-blue-600 " /></span>
                      <div>
                        <p className="text-sm text-gray-500">Regulation</p>
                        <p className="font-medium text-sm" >{broker.regulation.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                    <span className='bg-blue-100 rounded-md p-2 mr-2'> <Globe size={18} className="text-blue-600" /></span>
                      <div>
                        <p className="text-sm text-gray-500">Platforms</p>
                        <p className="font-medium text-sm">{broker.platforms.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Section */}
                <div className="p-6 flex flex-col justify-between bg-gray-50">
                  <div className="mb-4">
                    <div className="mb-2 text-center">
                      <span className="text-sm text-gray-500">Our Score</span>
                      <div className="text-3xl font-bold text-blue-600">
                        {(broker.rating * 20).toFixed(0)}<span className="text-lg font-normal">/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center">
                      Visit Broker <ArrowRight size={16} className="ml-2" />
                    </button>
                    <button className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition">
                      Read Full Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Comparison Notes */}
      <div className="bg-blue-50 p-6 mt-4 rounded-lg mx-6 mb-6">
        <h4 className="font-bold text-blue-800 mb-2">How We Compare Forex Brokers</h4>
        <p className="text-gray-700 text-sm">Our reviews are based on regulatory status, trading costs, platform features, customer support quality, and user experience. We regularly update our assessments to ensure accuracy and relevance for traders of all experience levels.</p>
      </div>
    </div>
  );
}