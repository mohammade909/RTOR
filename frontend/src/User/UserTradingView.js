import { useEffect, useRef } from "react";

const TradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Remove any existing child nodes before appending a new script
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "FX:EURUSD",
      width: "100%",
      height: 500, // Increase height for better visibility
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      isTransparent: false,
      autosize: true, // Enable autosize for full width
      largeChartUrl: "",
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup: Remove existing widgets to prevent duplicates
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full">
      <div
        ref={containerRef}
        className="tradingview-widget-container__widget w-full"
      ></div>
    </div>
  );
};

export default TradingViewWidget;
