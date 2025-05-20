import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { makeTrade } from "../redux/tradeSlice";
import { Award, Check, PartyPopper, Gift, X } from "lucide-react";
import { TradeSuccessModal } from "./TradeSuccessModal";

const TradeNow = () => {
  const dispatch = useDispatch();
  const [latestDate, setLatestDate] = useState(null);
  const [canShowButton, setCanShowButton] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const { loading, message } = useSelector((state) => state.trade);
  const { auth } = useSelector((state) => state.auth);
  const userId = auth?.id;

  // Check if today is weekend (Saturday or Sunday)
  useEffect(() => {
    const checkIfWeekend = () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
      setIsWeekend(dayOfWeek === 0 || dayOfWeek === 6);
    };

    checkIfWeekend();
    // Check every minute in case day changes during session
    const interval = setInterval(checkIfWeekend, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLatestRoiDate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/referral/latest/${userId}`
        );

        if (res.data?.latestRoiDate) {
          const roiDate = new Date(res.data.latestRoiDate);
          setLatestDate(roiDate);
        } else {
          setCanShowButton(true); // If API returns success but no date
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCanShowButton(true); // Show button if not found
        } else {
          console.error("Error fetching ROI date:", err);
        }
      }
    };

    fetchLatestRoiDate();
  }, [userId]);

  useEffect(() => {
    if (!latestDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const nextRoiTime = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
      const diff = nextRoiTime - now;

      if (diff <= 0) {
        setCanShowButton(true);
        setCountdown("");
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [latestDate]);

  useEffect(() => {
    if (message) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleTrade() {
    dispatch(makeTrade({ userId, pair: "USD" }));
  }

  // Get next available trading day message
  function getNextTradingDayMessage() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) {
      // Sunday
      return "Trading resumes on Monday";
    } else if (dayOfWeek === 6) {
      // Saturday
      return "Trading resumes on Monday";
    }
    return "";
  }
  function isDateToday(dateString) {
    if (!dateString) return false;

    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getUTCFullYear() === today.getUTCFullYear() &&
      date.getUTCMonth() === today.getUTCMonth() &&
      date.getUTCDate() === today.getUTCDate()
    );
  }

  // Determine if button should be shown (not weekend and passed other checks)
  const shouldShowButton = !isDateToday(latestDate) ;
  return (
    <div className="mt-8">
      <TradeSuccessModal
        isOpen={showSuccessMessage}
        onClose={() => showSuccessMessage(false)}
        message={"Trade successfull"}
      />

      <div className="text-center">

          <button
              onClick={() => handleTrade("DOGE")}
              disabled={loading}
              className="cursor-pointer relative group rounded-md overflow-hidden border-2 px-4 py-2 border-yellow-500"
            >
              <span className="font-semibold text-white text-base relative z-10 group-hover:text-yellow-500 duration-500">
                Get today Rent
              </span>
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:-translate-x-full h-full" />
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:translate-x-full h-full" />
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 delay-300 group-hover:-translate-y-full h-full" />
              <span className="absolute delay-300 top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:translate-y-full h-full" />
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </button>
   {/* {shouldShowButton ? (
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide">
            <button
              onClick={() => handleTrade("DOGE")}
              disabled={loading}
              className="cursor-pointer relative group rounded-md overflow-hidden border-2 px-4 py-2 border-yellow-500"
            >
              <span className="font-semibold text-white text-base relative z-10 group-hover:text-yellow-500 duration-500">
                Get today Rent
              </span>
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:-translate-x-full h-full" />
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:translate-x-full h-full" />
              <span className="absolute top-0 left-0 w-full bg-yellow-500 duration-500 delay-300 group-hover:-translate-y-full h-full" />
              <span className="absolute delay-300 top-0 left-0 w-full bg-yellow-500 duration-500 group-hover:translate-y-full h-full" />
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </button>
          </div>
        ) : countdown ? (
          <div className="bg-gradient-to-br from-[#1f1f3d] to-[#121223] rounded-md px-2 py-3 border border-gray-700 shadow-lg text-white">
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                Next Trade Available In
              </h3>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#2a2a4d] rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-base font-semibold text-emerald-400 tracking-wide">
                 
                  Complete for Today
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TradeNow;
