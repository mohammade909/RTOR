import { useEffect, useState, useMemo } from "react";

export default function TradingCard() {
  const [cryptoData, setCryptoData] = useState({
    data: {},
    loading: true,
    error: null
  });
  
  const cryptoIds = useMemo(() => [
    { symbol: "bitcoin", name: "BTC" },
    { symbol: "ethereum", name: "ETH" },
    { symbol: "litecoin", name: "LTC" }
    // { symbol: "binancecoin", name: "BNB" }, // Changed from "bnb" to "binancecoin" for CoinGecko API
    // { symbol: "solana", name: "SOL" },
    // { symbol: "dogecoin", name: "DOGE" },
    // { symbol: "tron", name: "TRX" }, // Fixed typo from "trone" to "tron"
    // { symbol: "sui", name: "SUI" }
  ], []);
  
  useEffect(() => {
    const fetchAllPrices = async () => {
      try {
        setCryptoData(prev => ({ ...prev, loading: true }));
        
        // Set timeout to show loading state if API is slow
        const timeoutId = setTimeout(() => {
          if (cryptoData.loading) {
            setCryptoData(prev => ({ ...prev, error: "Taking longer than expected" }));
          }
        }, 3000);
        
        // Create a comma-separated list of IDs for a single API call
        const idsString = cryptoIds.map(crypto => crypto.symbol).join(",");
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd&include_24hr_change=true`
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
       
        setCryptoData({
          data,
          loading: false,
          error: null
        });
      } catch (error) {
        setCryptoData({
          data: {},
          loading: false,
          error: error.message
        });
      }
    };
    
    fetchAllPrices();
    
    // Optional: Set up interval for periodic refreshes
    const intervalId = setInterval(fetchAllPrices, 60000); // Refresh every 60 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [cryptoIds]);
  
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
      {cryptoIds.map((crypto) => (
        <CryptoPriceCard 
          key={crypto.symbol}
          symbol={crypto.symbol}
          name={crypto.name}
          priceData={cryptoData.data[crypto.symbol]}
          loading={cryptoData.loading}
          error={cryptoData.error}
        />
      ))}
    </div>
  );
}

function CryptoPriceCard({ symbol, name, priceData, loading, error }) {
  const price = priceData?.usd;
  const change = priceData?.usd_24h_change;
  
  const isPositive = change > 0;
  const changeColor = isPositive ? 'bg-teal-500 text-teal-900' : 'bg-red-500 text-red-900';
  
  return (
    <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border border-white/20 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">{name}</h3>
        {loading ? (
          <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
        ) : error ? (
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500 text-yellow-900">Error</span>
        ) : change ? (
          <span className={`px-2 py-1 rounded text-xs font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        ) : (
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500 text-yellow-900">N/A</span>
        )}
      </div>
      
      <div className="text-white text-left text-2xl font-semibold">
        {loading ? (
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
        ) : error ? (
          <span className="text-red-400 text-sm">Price unavailable</span>
        ) : price ? (
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(price)
        ) : (
          <span className="text-red-400 text-sm">Price unavailable</span>
        )}
      </div>
      
      {error && !loading && (
        <div className="text-yellow-400 text-xs mt-2">
          {error === "Failed to fetch data" ? "Network error" : error}
        </div>
      )}
    </div>
  );
}