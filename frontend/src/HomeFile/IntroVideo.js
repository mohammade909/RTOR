import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import TextPressure from '../HomeFile/TextPressure';


export default function IntroVideo() {
  // State for managing the video popup modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Open and close modal functions
  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isVideoModalOpen]);

  // When modal is open, prevent body scrolling
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVideoModalOpen]);

  const exchanges = [
    { name: 'Ascendex', color: 'text-teal-500' },
    { name: 'Bitget', color: 'text-cyan-500' },
    { name: 'Bitmart', color: 'text-gray-600' },
    { name: 'Bitso', color: 'text-green-600' },
    { name: 'Bybit', color: 'text-yellow-500' },
    { name: 'Gateio', color: 'text-blue-400' },
    { name: 'Kraken', color: 'text-purple-600' },
    { name: 'Kucoin', color: 'text-teal-400' },
    { name: 'Lbank', color: 'text-gray-700' },
    { name: 'Mexc', color: 'text-green-500' },
    { name: 'Poloniex', color: 'text-green-600' }
  ];

  const cryptocurrencies = [
    { name: 'BTC', symbol: '₿', color: 'text-orange-500' },
    { name: 'BNB', symbol: 'BNB', color: 'text-yellow-500' },
    { name: 'Dogecoin', symbol: 'Ð', color: 'text-blue-400' },
    { name: 'Litecoin', symbol: 'Ł', color: 'text-gray-400' },
    { name: 'Ripple', symbol: 'XRP', color: 'text-gray-600' },
    { name: 'Stellar', symbol: 'XLM', color: 'text-gray-500' },
    { name: 'ADA', symbol: '₳', color: 'text-blue-500' },
    { name: 'Tether BEP20', symbol: '₮', color: 'text-yellow-400' },
    { name: 'Tether TRC20', symbol: '₮', color: 'text-teal-400' }
  ];

  // Responsive marquee speeds
  const [exchangeSpeed, setExchangeSpeed] = useState(40);
  const [cryptoSpeed, setCryptoSpeed] = useState(30);

  // Responsive state for pause on hover
  const [pauseOnHover, setPauseOnHover] = useState(true);

  // Adjust settings based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setExchangeSpeed(25);
        setCryptoSpeed(20);
        setPauseOnHover(false); // Better mobile experience to not pause on touch
      } else if (width < 1024) { // Tablet
        setExchangeSpeed(35);
        setCryptoSpeed(25);
        setPauseOnHover(true);
      } else { // Desktop
        setExchangeSpeed(40);
        setCryptoSpeed(30);
        setPauseOnHover(true);
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom fade-in animation
  const fadeInStyle = (delay) => ({
    opacity: 0,
    animation: `fadeIn 0.6s ${delay}s forwards`
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-white">
      <div
        className="text-center mb-8 sm:mb-12"
        style={{
          opacity: 0,
          animation: 'fadeInDown 0.5s forwards'
        }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"></h2>

        <div style={{ position: 'relative',  color: 'blue' }}>
          <TextPressure
            text="ACCESS GLOBAL MARKETS IN ONE PLATFORM"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#1F2937" // gray
            strokeColor="#00ffff" // Optional: Cyan stroke for visibility
            minFontSize={36}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 mb-3 sm:mb-4"
          />
        </div>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
        Trade seamlessly across Forex, Crypto, and Stock markets with our advanced yet simple interface. BotEdgeTrade connects you to worldwide financial opportunities with competitive spreads and powerful tools.

        </p>
      </div>

      {/* Exchanges Marquee */}
      <div
        className="mb-6 sm:mb-8"
        style={fadeInStyle(0.2)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4 text-center">Featured Markets </h2>
        <Marquee
          speed={exchangeSpeed}
          gradientWidth={50}
          pauseOnHover={pauseOnHover}
          className="py-2"
        >
          <div className="flex items-center gap-4 sm:gap-6 px-2">
            {exchanges.map((exchange, index) => (
              <div
                key={`${exchange.name}-${index}`}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ${exchange.color} bg-opacity-20`}>
                  <span className="font-semibold text-xs sm:text-sm">{exchange.name.charAt(0)}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{exchange.name}</span>
              </div>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Cryptocurrencies Marquee */}
      <div
        className="mb-8 sm:mb-12"
        style={fadeInStyle(0.4)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4 text-center">Popular Trading Pairs </h2>
        <Marquee
          speed={cryptoSpeed}
          direction="right"
          gradientWidth={50}
          pauseOnHover={pauseOnHover}
          className="py-2"
        >
          <div className="flex items-center gap-4 sm:gap-6 px-2">
            {cryptocurrencies.map((crypto, index) => (
              <div
                key={`${crypto.name}-${index}`}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ${crypto.color} bg-opacity-20`}>
                  <span className="font-semibold text-xs">{crypto.symbol}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{crypto.name}</span>
              </div>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Buttons - Responsive layout */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={openVideoModal}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-400 text-white rounded-lg font-medium transition-transform duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          <span className="w-4 h-4 flex items-center justify-center">▶</span>
          <span>Watch Demo </span>
        </button>

        <button
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg font-medium transition-transform duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base shadow-sm hover:shadow-md"
        >
          <span> → Explore Markets</span>
          <span className="w-4 h-4 flex items-center justify-center">→</span>
        </button>
      </div>

      {/* Chat button - Responsive size and positioning */}
      <div
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-500 p-3 sm:p-4 rounded-full shadow-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 z-40"
      >
        <div className="text-white text-lg sm:text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-icon lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>

      {/* Video Modal Popup */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6">
          <div
            className="animate-fadeIn bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Introduction Video</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative bg-black w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
              {/* Using placeholder to simulate video - replace with actual video player */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 text-3xl sm:text-4xl">▶</div>
                  </div>
                  <p className="text-lg sm:text-xl">Video Player Placeholder</p>
                  <p className="text-sm sm:text-base text-gray-300 mt-2">
                    In a real implementation, this would be an embedded video player
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">Video Duration:</span>
                  <span className="font-medium">3:45</span>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeVideoModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors text-sm flex items-center gap-1"
                  >
                    <span>Share</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations for fade effects */}
      <style jsx>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}