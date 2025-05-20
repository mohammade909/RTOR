
import { useState, useEffect } from "react";

export default function Market() {
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeCoin, setActiveCoin] = useState(null);
  const [activeExchange, setActiveExchange] = useState("coinmarketcap");

  // Top 20 coins data
  const coins = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      rank: 1,
      iconText: "₿",
      circulating: "19.85M BTC",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      rank: 2,
      iconText: "Ξ",
      circulating: "120.73M ETH",
    },
    {
      id: "tether",
      name: "Tether",
      symbol: "USDT",
      color: "bg-green-500",
      rank: 3,
      iconText: "₮",
      circulating: "149.18B USDT",
    },
    {
      id: "xrp",
      name: "XRP",
      symbol: "XRP",
      color: "bg-gray-500",
      rank: 4,
      iconText: "✕",
      circulating: "58.5B XRP",
    },
    {
      id: "bnb",
      name: "BNB",
      symbol: "BNB",
      color: "bg-yellow-500",
      rank: 5,
      iconText: "B",
      circulating: "140.88M BNB",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      color: "bg-purple-500",
      rank: 6,
      iconText: "S",
      circulating: "518.07M SOL",
    },
    {
      id: "usdc",
      name: "USDC",
      symbol: "USDC",
      color: "bg-blue-400",
      rank: 7,
      iconText: "$",
      circulating: "61.52B USDC",
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      color: "bg-yellow-400",
      rank: 8,
      iconText: "Ð",
      circulating: "149.1B DOGE",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      color: "bg-cyan-500",
      rank: 9,
      iconText: "A",
      circulating: "35.38B ADA",
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      color: "bg-pink-500",
      rank: 10,
      iconText: "•",
      circulating: "1.41B DOT",
    },
    {
      id: "avalanche",
      name: "Avalanche",
      symbol: "AVAX",
      color: "bg-red-500",
      rank: 11,
      iconText: "A",
      circulating: "367.5M AVAX",
    },
    {
      id: "shiba-inu",
      name: "Shiba Inu",
      symbol: "SHIB",
      color: "bg-orange-400",
      rank: 12,
      iconText: "S",
      circulating: "589.3T SHIB",
    },
    {
      id: "tron",
      name: "TRON",
      symbol: "TRX",
      color: "bg-red-400",
      rank: 13,
      iconText: "T",
      circulating: "88.9B TRX",
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      color: "bg-blue-300",
      rank: 14,
      iconText: "L",
      circulating: "587.1M LINK",
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      color: "bg-purple-400",
      rank: 15,
      iconText: "M",
      circulating: "9.3B MATIC",
    },
    {
      id: "toncoin",
      name: "Toncoin",
      symbol: "TON",
      color: "bg-blue-200",
      rank: 16,
      iconText: "T",
      circulating: "3.4B TON",
    },
    {
      id: "wrapped-bitcoin",
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      color: "bg-orange-300",
      rank: 17,
      iconText: "W",
      circulating: "155.2K WBTC",
    },
    {
      id: "uniswap",
      name: "Uniswap",
      symbol: "UNI",
      color: "bg-pink-300",
      rank: 18,
      iconText: "U",
      circulating: "753.8M UNI",
    },
    {
      id: "bitcoin-cash",
      name: "Bitcoin Cash",
      symbol: "BCH",
      color: "bg-green-400",
      rank: 19,
      iconText: "B",
      circulating: "19.6M BCH",
    },
    {
      id: "litecoin",
      name: "Litecoin",
      symbol: "LTC",
      color: "bg-gray-400",
      rank: 20,
      iconText: "Ł",
      circulating: "74.2M LTC",
    }
  ];

  const exchanges = [
    { 
      id: "coinmarketcap", 
      name: "CoinMarketCap", 
      shortName: "CMC"
    },
    { 
      id: "coingecko", 
      name: "CoinGecko", 
      shortName: "CG"
    }
  ];

  // Generate price data on load
  useEffect(() => {
    setLoading(true);

    // Base prices for the coins
    const basePrices = {
      bitcoin: 96568.49,
      ethereum: 1837.90,
      tether: 1.00,
      xrp: 2.21,
      bnb: 600.03,
      solana: 148.01,
      usdc: 0.9999,
      dogecoin: 0.1805,
      cardano: 0.7004,
      polkadot: 7.38,
      avalanche: 42.15,
      "shiba-inu": 0.000025,
      tron: 0.12,
      chainlink: 18.75,
      polygon: 0.82,
      toncoin: 2.45,
      "wrapped-bitcoin": 96570.12,
      uniswap: 7.32,
      "bitcoin-cash": 458.21,
      litecoin: 84.56
    };

    // Market caps (in billions)
    const marketCaps = {
      bitcoin: 1917.785,
      ethereum: 221.895,
      tether: 149.225,
      xrp: 129.531,
      bnb: 84.539,
      solana: 76.681,
      usdc: 61.516,
      dogecoin: 26.921,
      cardano: 24.729,
      polkadot: 10.481,
      avalanche: 15.487,
      "shiba-inu": 14.732,
      tron: 10.668,
      chainlink: 11.006,
      polygon: 7.626,
      toncoin: 8.330,
      "wrapped-bitcoin": 14.988,
      uniswap: 5.518,
      "bitcoin-cash": 8.981,
      litecoin: 6.274
    };

    // Daily volumes (in billions)
    const volumes = {
      bitcoin: 25.149,
      ethereum: 12.863,
      tether: 50.655,
      xrp: 2.036,
      bnb: 1.380,
      solana: 2.579,
      usdc: 8.012,
      dogecoin: 0.902,
      cardano: 0.598,
      polkadot: 0.247,
      avalanche: 0.456,
      "shiba-inu": 0.345,
      tron: 0.289,
      chainlink: 0.567,
      polygon: 0.345,
      toncoin: 0.123,
      "wrapped-bitcoin": 0.456,
      uniswap: 0.234,
      "bitcoin-cash": 0.567,
      litecoin: 0.456
    };

    // Generate price data for each coin and exchange
    const newPriceData = {};

    coins.forEach((coin) => {
      const basePrice = basePrices[coin.id];
      const baseMarketCap = marketCaps[coin.id];
      const baseVolume = volumes[coin.id];
      
      newPriceData[coin.id] = {};
      
      exchanges.forEach((exchange) => {
        // Add more noticeable variation between exchanges
        const priceFactor = exchange.id === "coinmarketcap" ? 1.0 : 0.99 + (Math.random() * 0.02);
        const price = basePrice * priceFactor;
        
        // Generate change percentages with more variation between exchanges
        const change1h = (Math.random() - 0.4) * 0.3 + (exchange.id === "coingecko" ? 0.1 : -0.1);
        const change24h = (Math.random() - 0.5) * 1.0 + (exchange.id === "coingecko" ? 0.3 : -0.3);
        const change7d = (Math.random() - 0.3) * 4.0 + (exchange.id === "coingecko" ? 0.5 : -0.5);
        
        // Generate price data for charts
        const priceChart = Array(50).fill(0).map((_, i) => {
          const baseHeight = 50;
          const amplitude = 15;
          const phase = Math.random() * Math.PI * 2;
          const frequency = 10;
          
          return baseHeight + amplitude * Math.sin(i / frequency + phase);
        });
        
        newPriceData[coin.id][exchange.id] = {
          price,
          marketCap: baseMarketCap * 1_000_000_000, // Convert to full value
          volume: baseVolume * 1_000_000_000, // Convert to full value
          change1h,
          change24h,
          change7d,
          priceChart,
        };
      });
    });

    setPriceData(newPriceData);
    setTimeout(() => setLoading(false), 800);
    
    // Update random values periodically
    const interval = setInterval(() => {
      setPriceData((prevData) => {
        const updatedData = { ...prevData };
        
        // Only update a few random coins
        const coinToUpdate = coins[Math.floor(Math.random() * coins.length)].id;
        
        exchanges.forEach((exchange) => {
          if (updatedData[coinToUpdate] && updatedData[coinToUpdate][exchange.id]) {
            const current = updatedData[coinToUpdate][exchange.id];
            const priceChange = current.price * (Math.random() - 0.5) * 0.005; // Small random change
            
            updatedData[coinToUpdate][exchange.id] = {
              ...current,
              price: current.price + priceChange,
              change1h: current.change1h + (Math.random() - 0.5) * 0.05,
              change24h: current.change24h + (Math.random() - 0.5) * 0.1,
            };
          }
        });
        
        return updatedData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Format functions
  const formatPrice = (price) => {
    if (price >= 1000)
      return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (price >= 1)
      return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (price >= 0.01)
      return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return "$" + price.toFixed(6);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1_000_000_000_000) {
      return "$" + (marketCap / 1_000_000_000_000).toFixed(3) + "T";
    }
    if (marketCap >= 1_000_000_000) {
      return "$" + (marketCap / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 3 }) + "B";
    }
    return "$" + (marketCap / 1_000_000).toFixed(2) + "M";
  };

  const formatVolume = (volume) => {
    if (volume >= 1_000_000_000) {
      return "$" + (volume / 1_000_000_000).toFixed(3) + "B";
    }
    return "$" + (volume / 1_000_000).toFixed(2) + "M";
  };

  const formatChange = (change) => {
    const formattedChange = Math.abs(change).toFixed(2) + "%";
    if (change > 0) {
      return <span className="text-green-500">+{formattedChange}</span>;
    } else if (change < 0) {
      return <span className="text-red-500">-{formattedChange}</span>;
    }
    return <span className="text-gray-400">{formattedChange}</span>;
  };

  // Sort data based on current sort field and direction
  const getSortedData = () => {
    const sortableData = [...coins].map(coin => {
      const exchangeData = priceData[coin.id]?.[activeExchange];
      return {
        ...coin,
        price: exchangeData?.price || 0,
        marketCap: exchangeData?.marketCap || 0,
        volume: exchangeData?.volume || 0,
        change1h: exchangeData?.change1h || 0,
        change24h: exchangeData?.change24h || 0,
        change7d: exchangeData?.change7d || 0,
        priceChart: exchangeData?.priceChart || [],
      };
    });
    
    return sortableData.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "rank":
          comparison = a.rank - b.rank;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "change1h":
          comparison = a.change1h - b.change1h;
          break;
        case "change24h":
          comparison = a.change24h - b.change24h;
          break;
        case "change7d":
          comparison = a.change7d - b.change7d;
          break;
        case "marketCap":
          comparison = a.marketCap - b.marketCap;
          break;
        case "volume":
          comparison = a.volume - b.volume;
          break;
        default:
          comparison = a.rank - b.rank;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };
  
  // Handle sorting when column header is clicked
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Sparkline mini chart component
  const SparkLine = ({ data, isPositive }) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="h-10 w-32">
        <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d={`M0,${data[0]} ${data.map((point, i) => `L${i * (100 / (data.length - 1))},${point}`).join(' ')}`}
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white overflow-hidden rounded-lg shadow-xl border border-gray-800">
      {/* Top navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-4 py-2 bg-gray-800 rounded-lg">
            <span className="text-gray-300 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12" y2="17" />
              </svg>
            </span>
            <span className="font-medium">Coins</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-blue-900/30 text-blue-300 text-sm hover:bg-blue-800/40">
              Top
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-800/70 text-gray-300 text-sm hover:bg-gray-700/70">
              Trending
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-800/70 text-gray-300 text-sm hover:bg-gray-700/70">
              New
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-800/70 text-gray-300 text-sm hover:bg-gray-700/70">
              Gainers
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Exchange selector buttons */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveExchange("coinmarketcap")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                activeExchange === "coinmarketcap"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              CMC
            </button>
            <button
              onClick={() => setActiveExchange("coingecko")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                activeExchange === "coingecko"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              CoinGecko
            </button>
          </div>
          
          <button className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          
          <button className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Columns
          </button>
          
          <button className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm">
            Show 20
          </button>
        </div>
      </div>
      
      {/* Main table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
            <tr className="text-left text-xs font-medium text-gray-200">
              <th className="p-4 w-10">#</th>
              <th className="p-4 w-64" onClick={() => handleSort('name')}>
                <div className="flex items-center cursor-pointer">
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4 w-32" onClick={() => handleSort('price')}>
                <div className="flex items-center cursor-pointer">
                  Price
                  {sortField === 'price' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4 w-20" onClick={() => handleSort('change1h')}>
                <div className="flex items-center cursor-pointer">
                  1h %
                  {sortField === 'change1h' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4 w-20" onClick={() => handleSort('change24h')}>
                <div className="flex items-center cursor-pointer">
                  24h %
                  {sortField === 'change24h' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4 w-20" onClick={() => handleSort('change7d')}>
                <div className="flex items-center cursor-pointer">
                  7d %
                  {sortField === 'change7d' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4 w-40" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center cursor-pointer">
                  Market Cap
                  {sortField === 'marketCap' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </th>
              <th className="p-4 w-40" onClick={() => handleSort('volume')}>
                <div className="flex items-center cursor-pointer">
                  Volume(24h)
                  {sortField === 'volume' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </th>
              <th className="p-4 w-40">
                <div className="flex items-center">
                  Circulating Supply
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </th>
              <th className="p-4 w-40">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading state
              Array(10).fill(0).map((_, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td colSpan={10} className="p-4">
                    <div className="h-12 bg-gray-800/50 rounded-md animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : (
              // Data rows
              getSortedData().map((coin) => {
                const exchangeData = priceData[coin.id]?.[activeExchange];
                if (!exchangeData) return null;
                
                return (
                  <tr key={coin.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="p-4 text-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 text-gray-500 hover:text-yellow-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>{coin.rank}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${coin.color} flex items-center justify-center font-medium text-sm mr-3`}>
                          {coin.iconText}
                        </div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-gray-500 text-sm">{coin.symbol}</div>
                        </div>
                        <div className="ml-4">
                          <button className="px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-sm hover:bg-blue-800/40">
                            Buy
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      {formatPrice(exchangeData.price)}
                    </td>
                    <td className="p-4">
                      {formatChange(exchangeData.change1h)}
                    </td>
                    <td className="p-4">
                      {formatChange(exchangeData.change24h)}
                    </td>
                    <td className="p-4">
                      {formatChange(exchangeData.change7d)}
                    </td>
                    <td className="p-4">
                      {formatMarketCap(exchangeData.marketCap)}
                    </td>
                    <td className="p-4">
                      <div>
                        {formatVolume(exchangeData.volume)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {Math.floor(Math.random() * 1000) / 10}K {coin.symbol}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{coin.circulating}</div>
                    </td>
                    <td className="p-4">
                      <SparkLine 
                        data={exchangeData.priceChart} 
                        isPositive={exchangeData.change7d > 0} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex justify-between items-center p-4 bg-gray-900 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          Showing 1-20 of 20 coins
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 text-sm">
            Previous
          </button>
          {[1].map(page => (
            <button 
              key={page} 
              className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}