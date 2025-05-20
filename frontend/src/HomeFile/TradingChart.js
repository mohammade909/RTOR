import { useEffect, useRef } from "react";

export const TradingChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 400,
      currencies: [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD"
      ],
      isTransparent: false,
      colorTheme: "dark",
      locale: "en",
      backgroundColor: "#000000"
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, []);
  return (
    <>
    
    <div className="min-h-screen  bg-gray-100 text-white flex flex-col items-center justify-center p-3">
      <div className="text-center text-5xl text-black py-8 font-semibold "> TRADING CHART </div>
    <div className="w-full  mx-auto bg-black rounded-xl shadow-lg p-4">
      <div className="tradingview-widget-container" ref={containerRef}>
        {/* Widget will be injected here */}
      </div>
      <div className="text-center mt-4 text-sm text-blue-400">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
          className="hover:underline"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
    </div>
    
    </>
  )
}
