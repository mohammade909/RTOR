import React from "react";
import { useState, useEffect } from "react";
 
const ElectricLoader = ({ isLoading, text = "Loading..." }) => {
  const [dotCount, setDotCount] = useState(0);
  const [zap, setZap] = useState(false);
 
  useEffect(() => {
    if (!isLoading) return;
   
    const dotInterval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 4);
    }, 500);

    // Random electric zaps
    const zapInterval = setInterval(() => {
      setZap(true);
      setTimeout(() => setZap(false), 200);
    }, 2000 + Math.random() * 2000);
   
    return () => {
      clearInterval(dotInterval);
      clearInterval(zapInterval);
    };
  }, [isLoading]);
 
  if (!isLoading) return null;
 
  const dots = ".".repeat(dotCount);
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-80"
      aria-label="Loading..."
      role="status"
    >
      <div className="relative w-64 h-64">
{/*        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48 animate-slow-spin">
          
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                className="fill-none stroke-yellow-400 stroke-2"
                strokeDasharray={zap ? "1" : "5,2"}
              />
             
              <polygon
                points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30"
                className="fill-none stroke-yellow-200 stroke-1"
                strokeDasharray={zap ? "1" : "3,3"}
              />
            
              <polygon
                points="50 20, 76.6 35, 76.6 65, 50 80, 23.4 65, 23.4 35"
                className={`${zap ? "fill-yellow-300" : "fill-yellow-600/40"} stroke-yellow-400 stroke-1`}
              />
              
             
              <line x1="50" y1="0" x2="50" y2="20" className="stroke-yellow-300 stroke-1" />
              <line x1="93.3" y1="25" x2="76.6" y2="35" className="stroke-yellow-300 stroke-1" />
              <line x1="93.3" y1="75" x2="76.6" y2="65" className="stroke-yellow-300 stroke-1" />
              <line x1="50" y1="100" x2="50" y2="80" className="stroke-yellow-300 stroke-1" />
              <line x1="6.7" y1="75" x2="23.4" y2="65" className="stroke-yellow-300 stroke-1" />
              <line x1="6.7" y1="25" x2="23.4" y2="35" className="stroke-yellow-300 stroke-1" />
            </svg>
           
           
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 -ml-2 -mt-2 top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(90px)`
                }}
              >
                <div 
                  className={`w-full h-full ${i % 2 === 0 ? "bg-cyan-400" : "bg-yellow-400"} rounded-full animate-electric-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              </div>
            ))}
          </div>
        </div> */}
       
        {/* Electric circuit paths */}
        {/* <div className="absolute inset-0">
          <div className="relative w-full h-full animate-reverse-spin">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <circle cx="50" cy="50" r="45" className="fill-none stroke-cyan-500/40 stroke-1" strokeDasharray="1,4" />
              <circle cx="50" cy="50" r="40" className="fill-none stroke-yellow-500/40 stroke-1" strokeDasharray="4,2" />
             
             
              <circle
                cx="50"
                cy="50"
                r="35"
                className="fill-none stroke-cyan-400 stroke-2"
                strokeDasharray="1,10"
                strokeDashoffset={zap ? "20" : "0"}
              />
              
          
              {zap && (
                <>
                  <path 
                    d="M50,15 L55,25 L45,30 L55,45 L45,50 L55,70 L50,85" 
                    className="fill-none stroke-yellow-300 stroke-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M15,50 L25,55 L30,45 L45,55 L50,45 L70,55 L85,50" 
                    className="fill-none stroke-yellow-300 stroke-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
          </div>
        </div> */}
       
        {/* Inner spinning component */}
        {/* <div className="absolute top-1/2 left-1/2 -ml-12 -mt-12 w-24 h-24 animate-faster-spin">
          <div className="w-full h-full relative">
           
            {[0, 120, 240].map((angle, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 -ml-2 origin-bottom"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className={`w-4 h-4 ${zap ? "bg-yellow-300" : "bg-cyan-400"}`}></div>
              </div>
            ))}
           
       
            <div className={`absolute inset-1/4 ${zap ? "bg-yellow-300" : "bg-gradient-to-br from-cyan-300 to-blue-600"} rounded-full animate-throb shadow-lg ${zap ? "shadow-yellow-500/70" : "shadow-cyan-500/50"}`}></div>
          </div>
        </div>
        */}
        {/* Electric particles */}
        {/* {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-around"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: ['#0ea5e9', '#fde047', '#7dd3fc'][Math.floor(Math.random() * 3)],
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 7}s`,
              boxShadow: `0 0 ${3 + Math.random() * 5}px ${['#0ea5e9', '#fde047', '#7dd3fc'][Math.floor(Math.random() * 3)]}`
            }}
          ></div>
        ))}
         */}
        {/* Lightning bolts around text */}
        <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="relative">
            {zap && (
              <>
                <svg className="absolute -top-6 -left-12 w-8 h-8 text-yellow-300" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11 15H6L13 1V9H18L11 23V15Z" />
                </svg>
                <svg className="absolute -top-6 -right-12 w-8 h-8 text-yellow-300" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11 15H6L13 1V9H18L11 23V15Z" />
                </svg>
              </>
            )}
            <div className={`text-xl font-bold ${zap ? "text-yellow-300" : "text-cyan-400"} tracking-widest mb-1`}>ENERGIZING</div>
          </div>
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${zap ? "bg-yellow-300" : "bg-cyan-300"} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
     
      <style jsx>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes faster-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(720deg); }
        }
        @keyframes throb {
          0%, 100% { transform: scale(0.9); opacity: 0.8; filter: brightness(0.8); }
          50% { transform: scale(1.1); opacity: 1; filter: brightness(1.2); }
        }
        @keyframes electric-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.7; filter: brightness(0.8); }
          20% { transform: scale(1.3); opacity: 1; filter: brightness(1.5); }
          40% { transform: scale(0.9); opacity: 0.8; filter: brightness(0.9); }
          60% { transform: scale(1.2); opacity: 0.9; filter: brightness(1.3); }
          80% { transform: scale(0.8); opacity: 0.7; filter: brightness(0.8); }
        }
        @keyframes float-around {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          25% { transform: translate(10px, -10px) scale(1.2); opacity: 1; }
          50% { transform: translate(0, -20px) scale(0.8); opacity: 0.5; }
          75% { transform: translate(-10px, -10px) scale(1.1); opacity: 0.9; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
        }
        .animate-slow-spin {
          animation: slow-spin 15s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 12s linear infinite;
        }
        .animate-faster-spin {
          animation: faster-spin 8s linear infinite;
        }
        .animate-throb {
          animation: throb 1.5s ease-in-out infinite;
        }
        .animate-electric-pulse {
          animation: electric-pulse 1.5s ease-in-out infinite;
        }
        .animate-float-around {
          animation: float-around 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
 
export default ElectricLoader;