import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeTrade } from "../redux/tradeSlice";
import { ArrowRight, X, Clock, TrendingUp, Zap, Coins, Wallet } from "lucide-react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
export function TradeSuccessModal({
  isOpen,
  onClose,
  message,
  coinSymbol,
  tradeAmount,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const defaultMessage = "Congratulations! Your share of the hotel income has been credited!";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      {showConfetti && <Confetti />}

      <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Success icon with animated gradient */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-md opacity-75 animate-pulse"></div>
              <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 p-3 shadow-lg">
                <FaHome className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-bold text-white mb-2">
           Rent Collected Successfully! !
          </h3>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            {message || defaultMessage}
          </p>

          {/* Trade details card */}
 

          {/* Additional info */}
          <div className="flex items-center justify-center text-sm text-gray-400 mb-6">
            <Clock className="h-4 w-4 mr-2" />
            <span>Trade completed at {new Date().toLocaleTimeString()}</span>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center justify-center"
          >
            View Portfolio
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Confetti component for celebration effect
const Confetti = () => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ];

  // Generate random confetti pieces
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.floor(Math.random() * 8) + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1.5,
    duration: 1 + Math.random() * 2,
    animation: Math.random() > 0.5 ? 'fall' : 'float',
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute rounded-sm ${piece.color} ${
            piece.animation === 'fall' 
              ? 'animate-fall-confetti' 
              : 'animate-float-confetti'
          }`}
          style={{
            left: piece.left,
            top: `-${piece.size}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};
