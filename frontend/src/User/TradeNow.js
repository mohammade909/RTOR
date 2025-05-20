import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { makeTrade } from "../redux/tradeSlice";
import { Award, Check, PartyPopper, Gift, X } from "lucide-react";
import { TradeSuccessModal } from "./TradeSuccessModal";

const TradeNow = ({user}) => {
  const dispatch = useDispatch();
  const [bookingTimestamp, setBookingTimestamp] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [isRentAvailable, setIsRentAvailable] = useState(false);
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

  // On component mount, check localStorage for booking timestamp
  useEffect(() => {
    const storedBookingTime = localStorage.getItem(`bookingTime_${userId}`);

    if (storedBookingTime) {
      const bookingTime = parseInt(storedBookingTime);
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - bookingTime;
      const hoursPassed = timeDiff / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        // Less than 24 hours have passed since booking
        setBookingTimestamp(bookingTime);
        setIsRentAvailable(false);
      } else {
        // More than 24 hours have passed, rent is available
        setIsRentAvailable(true);
        setBookingTimestamp(null);
      }
    } else {
      // No booking has been made yet
      setIsRentAvailable(false);
      setBookingTimestamp(null);
    }
  }, [userId]);

  // Handle countdown timer
  useEffect(() => {
    let timer;

    if (bookingTimestamp) {
      // If there's an active booking, count down until 24 hours
      timer = setInterval(() => {
        const now = new Date().getTime();
        const bookingEndTime = bookingTimestamp + 7 * 60 * 1000;
        const diff = bookingEndTime - now;

        if (diff <= 0) {
          // When 24 hours passed, rent is available
          setIsRentAvailable(true);
          setBookingTimestamp(null);
          setCountdown("");
          clearInterval(timer);
        } else {
          // Update countdown display
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
    }

    return () => clearInterval(timer);
  }, [bookingTimestamp]);

  // Handle success message
  useEffect(() => {
    if (message) {
      setSuccessMessageText("Rent collected successfully!");
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        // After getting rent, rent is no longer available
        setIsRentAvailable(false);
        localStorage.removeItem(`bookingTime_${userId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, userId]);

  // Handle rent collection
  async function handleGetRent() {
    dispatch(makeTrade({ userId, pair: "USD" }));
  }

 


  // Handle booking
function handleBookNow() {
  // Check if user has an active plan
  if (user?.active_plan == 0) {
    alert("Please buy a plan first.");
    return;
  }

  const currentTime = new Date().getTime();

  // Store the booking time in localStorage
  localStorage.setItem(`bookingTime_${userId}`, currentTime.toString());

  // Update component state
  setBookingTimestamp(currentTime);
  setIsRentAvailable(false);

  // Show booking modal
  setBookingModal(true);
}


  return (
    <div className="text-center">
      <TradeSuccessModal
        isOpen={showSuccessMessage}
        onClose={() => {
          setShowSuccessMessage(false)
          window.location.reload()
        }}
        message={successMessageText}
      />
      <BookingOpenModal
        isOpen={bookingModal}
        onClose={() => setBookingModal(false)}
        message={successMessageText}
      />

      {bookingTimestamp && (
        // Show countdown when there's an active booking
        <div className="mb-4">
          <div className="font-semibold text-lg mb-2">
            Time until rent is available:
          </div>
          <div className="text-2xl font-bold text-yellow-500">{countdown}</div>
        </div>
      )}

      {isRentAvailable ? (
        // Get Rent Button - only show when rent is available (timer ended)
        <button
          onClick={handleGetRent}
          disabled={loading}
          className="cursor-pointer relative group rounded-md overflow-hidden border-2 px-4 py-2 border-yellow-500"
        >
          <span className="font-semibold text-white text-base relative z-10 group-hover:text-yellow-500 duration-500">
            Get Today's Rent
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
      ) : (
        !bookingTimestamp && (
          // Book Now button - only show when there's no active booking and rent is not available
          <button
            onClick={handleBookNow}
            className="cursor-pointer relative group rounded-md overflow-hidden border-2 px-4 py-2 border-blue-500"
          >
            <span className="font-semibold text-white text-sm relative z-10 group-hover:text-blue-500 duration-500">
              Booking Allow
            </span>
            <span className="absolute top-0 left-0 w-full bg-blue-500 duration-500 group-hover:-translate-x-full h-full" />
            <span className="absolute top-0 left-0 w-full bg-blue-500 duration-500 group-hover:translate-x-full h-full" />
            <span className="absolute top-0 left-0 w-full bg-blue-500 duration-500 delay-300 group-hover:-translate-y-full h-full" />
            <span className="absolute delay-300 top-0 left-0 w-full bg-blue-500 duration-500 group-hover:translate-y-full h-full" />
          </button>
        )
      )}
    </div>
  );
};

const BookingOpenModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-pop-in">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-teal-400"></div>

        <div className="p-6 text-center">
          {/* Animated checkmark */}
          <div className="mx-auto flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600 animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Bookings Are Now Open!
          </h3>
          <p className="text-gray-600 mb-6">
            Great news! You can now book your preferred dates. Don't miss out on
            your perfect schedule.
          </p>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Booking Now
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors focus:outline-none"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-400 rounded-br-xl opacity-20"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-teal-400 rounded-tl-xl opacity-20"></div>
      </div>
    </div>
  );
};
export default TradeNow;
