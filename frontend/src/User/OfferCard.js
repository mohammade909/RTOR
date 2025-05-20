import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferredUsers,
  fecthUserOffers,
  MineReward,
} from "../redux/offer";
import CountdownTimer from "../CoreFile/Timer";
import { fetchCodes, createCodes, fetchCodeById } from "../redux/codes";
import Loader from "../BaseFile/comman/Loader";

// Custom Button Component

const OfferCard = ({ offer, referredUsers }) => {
  const dispatch = useDispatch();
  const { loading,codes } = useSelector((state) => state.codes);
  // const { loading, offers } = useSelector((state) => state.offers?.offers);
  const { auth } = useSelector((state) => state.auth);
  const [isOfferCompleted, setIsOfferCompleted] = useState(false);
  const [referralCodes, setReferralCodes] = useState([]);

  useEffect(() => {
    dispatch(fetchCodes());
    // dispatch(fecthUserOffers());
    // if (offer) {
    //   dispatch(
    //     fetchReferredUsers({
    //       userId: auth.id,
    //       startDate: offer.start_date,
    //       endDate: offer.end_date,
    //       userPlanVal:offer.user_plan_val
    //     })

    //   );
    // }
  }, [offer, auth, dispatch]);

  const uniqueReferredUsers = referredUsers?.filter(
    (user) => !codes.includes(user.refferal_code)
  );

  // Calculate total achieved business value only from the filtered users
  const achievedBusinessValue =
    uniqueReferredUsers?.reduce((sum, user) => sum + user.active_plan, 0) || 0;

  // Calculate percentage progress
  const progressPercentage = Math.min(
    (achievedBusinessValue / offer.business_val) * 100,
    100
  );

  // Check if offer is completed (achieved business value equals offer business value)
  useEffect(() => {
    if (achievedBusinessValue && offer) {
      setIsOfferCompleted(achievedBusinessValue >= offer.business_val);

      // If offer is completed, extract referral codes
      if (achievedBusinessValue >= offer.business_val && referredUsers) {
        const codes = referredUsers
          .map((user) => user.refferal_code)
          .filter(Boolean);
        setReferralCodes(codes);
      }
    }
  }, [achievedBusinessValue, offer, referredUsers]);

  const [offset, setOffset] = useState(0);
  const radius = 40; // Radius of the circle
  const stroke = 6; // Stroke width
  const circumference = 2 * Math.PI * radius; // Calculate the circumference

  useEffect(() => {
    // Calculate the stroke offset based on progress
    const progressOffset = ((100 - progressPercentage) / 100) * circumference;
    setOffset(progressOffset);
  }, [progressPercentage, circumference]);

  const handleMineOffer = async () => {
    if (isOfferCompleted) {
      try {
        // First create codes
        await dispatch(createCodes(referralCodes));

        // Then mine the reward
        const mineResult = await dispatch(
          MineReward({
            user_id: auth.id,
            offer_id: offer.offer_id,
          })
        );

        // Check if the mining was successful
        if (mineResult.payload?.success) {
          // Show success animation
          showSuccessAnimation();
        } else {
          // Handle case where mining failed
          alert("Mining failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during mining process:", error);
        alert("An error occurred while mining the reward.");
      }
    }
  };

  // Function to show success animation
  const showSuccessAnimation = () => {
    // Create animation element
    const animationContainer = document.createElement("div");
    animationContainer.className = "mining-animation-container";

    // Style the container
    Object.assign(animationContainer.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: "9999",
    });

    // Add animation content
    animationContainer.innerHTML = `
    <div class="animation-content" style="text-align: center; color: white;">
      <div class="success-icon" style="font-size: 80px; margin-bottom: 20px;">
        <i class="fas fa-check-circle" style="color: #4CAF50; animation: pulse 1.5s infinite;"></i>
      </div>
      <h2 style="margin-bottom: 10px; font-size: 28px;">Success!</h2>
      <p style="font-size: 22px;">Reward: $${offer.reward}</p>
      <div class="confetti-container"></div>
    </div>
  `;

    // Add animation styling
    const style = document.createElement("style");
    style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    .mining-animation-container {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `;

    document.head.appendChild(style);
    document.body.appendChild(animationContainer);

    // Add confetti effect
    createConfetti(animationContainer.querySelector(".confetti-container"));

    // Remove the animation after a delay
    setTimeout(() => {
      animationContainer.style.animation = "fadeOut 0.5s ease-in-out";
      animationContainer.style.opacity = "0";

      setTimeout(() => {
        document.body.removeChild(animationContainer);
      }, 500);
    }, 5000);
    window.location.reload();
  };

  // Function to create confetti effect
  const createConfetti = (container) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ];

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div");

      // Random properties
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      Object.assign(confetti.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: "50%",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `confettiFall ${Math.random() * 3 + 2}s linear infinite`,
      });

      container.appendChild(confetti);
    }

    // Add animation for confetti falling
    const confettiStyle = document.createElement("style");
    confettiStyle.textContent = `
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
  `;
    document.head.appendChild(confettiStyle);
  };

  return (
    <>
    <Loader isLoading={loading} />
      <div>
        <div className="relative w-full">
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-70"
            style={{
              backgroundImage: `url(${offer.bgImage})`,
            }}
          />
          <div className="bg-gray-900 text-white mb-2">
            <div className="max-w-7xl mx-auto ">
              <div className="relative rounded mt-4">
                <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-8 sm:gap-10 py-10  border-y-8 border-[#e62e2e]">
                  <div className="text-center sm:text-left px-6">
                    <h3 className="font-extrabold text-4xl sm:text-5xl text-left text-orange-500 leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-lg md:text-xl  text-left mb-6 ">
                      {offer.description}
                    </p>
                    <div>
                      <div className="lg:flex gap-4 mb-4 items-center">
                        <div className="bg-white/10 backdrop-blur-md  rounded-sm border border-gray-200 shadow-sm flex justify-center">
                          <CountdownTimer
                            startDate={offer.start_date}
                            endDate={offer.end_date}
                          />
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-sm border border-gray-200 shadow-sm">
                          <p className="text-lg font-bold text-yellow-400">
                            ${offer.reward}
                          </p>
                          <p className="text-sm ">Reward</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-sm border border-gray-200 shadow-sm">
                          <p className="text-lg font-bold text-green-400">
                            ${offer.business_val}
                          </p>
                          <p className="text-sm ">Business Value</p>
                        </div>
                      </div>
                    </div>
                    {/* Buttons */}

                    <div className="flex items-center mt-6 space-x-4">
                      <button className="bg-orange-500 text-white border-2 border-orange-500  px-6 py-2 rounded-sm hover:bg-orange-600 transition">
                        View Details
                      </button>
                      <div className="voltage-button">
                        <button
                          onClick={handleMineOffer}
                          disabled={!isOfferCompleted}
                          className={
                            !isOfferCompleted
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          
                        </button>

                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          viewBox="0 0 234.6 61.3"
                          preserveAspectRatio="none"
                          xmlSpace="preserve"
                        >
                          <filter id="glow">
                            <feGaussianBlur
                              className="blur"
                              result="coloredBlur"
                              stdDeviation={2}
                            />
                            <feTurbulence
                              type="fractalNoise"
                              baseFrequency="0.075"
                              numOctaves="0.3"
                              result="turbulence"
                            />
                            <feDisplacementMap
                              in="SourceGraphic"
                              in2="turbulence"
                              scale={30}
                              xChannelSelector="R"
                              yChannelSelector="G"
                              result="displace"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="displace" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <path
                            className="voltage line-1"
                            d="m216.3 51.2c-3.7 0-3.7-1.1-7.3-1.1-3.7 0-3.7 6.8-7.3 6.8-3.7 0-3.7-4.6-7.3-4.6-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-0.9-7.3-0.9-3.7 0-3.7-2.7-7.3-2.7-3.7 0-3.7 7.8-7.3 7.8-3.7 0-3.7-4.9-7.3-4.9-3.7 0-3.7-7.8-7.3-7.8-3.7 0-3.7-1.1-7.3-1.1-3.7 0-3.7 3.1-7.3 3.1-3.7 0-3.7 10.9-7.3 10.9-3.7 0-3.7-12.5-7.3-12.5-3.7 0-3.7 4.6-7.3 4.6-3.7 0-3.7 4.5-7.3 4.5-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-10-7.3-10-3.7 0-3.7-0.4-7.3-0.4-3.7 0-3.7 2.3-7.3 2.3-3.7 0-3.7 7.1-7.3 7.1-3.7 0-3.7-11.2-7.3-11.2-3.7 0-3.7 3.5-7.3 3.5-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-2.9-7.3-2.9-3.7 0-3.7 8.4-7.3 8.4-3.7 0-3.7-14.6-7.3-14.6-3.7 0-3.7 5.8-7.3 5.8-2.2 0-3.8-0.4-5.5-1.5-1.8-1.1-1.8-2.9-2.9-4.8-1-1.8 1.9-2.7 1.9-4.8 0-3.4-2.1-3.4-2.1-6.8s-9.9-3.4-9.9-6.8 8-3.4 8-6.8c0-2.2 2.1-2.4 3.1-4.2 1.1-1.8 0.2-3.9 2-5 1.8-1 3.1-7.9 5.3-7.9 3.7 0 3.7 0.9 7.3 0.9 3.7 0 3.7 6.7 7.3 6.7 3.7 0 3.7-1.8 7.3-1.8 3.7 0 3.7-0.6 7.3-0.6 3.7 0 3.7-7.8 7.3-7.8h7.3c3.7 0 3.7 4.7 7.3 4.7 3.7 0 3.7-1.1 7.3-1.1 3.7 0 3.7 11.6 7.3 11.6 3.7 0 3.7-2.6 7.3-2.6 3.7 0 3.7-12.9 7.3-12.9 3.7 0 3.7 10.9 7.3 10.9 3.7 0 3.7 1.3 7.3 1.3 3.7 0 3.7-8.7 7.3-8.7 3.7 0 3.7 11.5 7.3 11.5 3.7 0 3.7-1.4 7.3-1.4 3.7 0 3.7-2.6 7.3-2.6 3.7 0 3.7-5.8 7.3-5.8 3.7 0 3.7-1.3 7.3-1.3 3.7 0 3.7 6.6 7.3 6.6s3.7-9.3 7.3-9.3c3.7 0 3.7 0.2 7.3 0.2 3.7 0 3.7 8.5 7.3 8.5 3.7 0 3.7 0.2 7.3 0.2 3.7 0 3.7-1.5 7.3-1.5 3.7 0 3.7 1.6 7.3 1.6s3.7-5.1 7.3-5.1c2.2 0 0.6 9.6 2.4 10.7s4.1-2 5.1-0.1c1 1.8 10.3 2.2 10.3 4.3 0 3.4-10.7 3.4-10.7 6.8s1.2 3.4 1.2 6.8 1.9 3.4 1.9 6.8c0 2.2 7.2 7.7 6.2 9.5-1.1 1.8-12.3-6.5-14.1-5.5-1.7 0.9-0.1 6.2-2.2 6.2z"
                            fill="transparent"
                            stroke="#fff"
                          />
                          <path
                            className="voltage line-2"
                            d="m216.3 52.1c-3 0-3-0.5-6-0.5s-3 3-6 3-3-2-6-2-3 1.6-6 1.6-3-0.4-6-0.4-3-1.2-6-1.2-3 3.4-6 3.4-3-2.2-6-2.2-3-3.4-6-3.4-3-0.5-6-0.5-3 1.4-6 1.4-3 4.8-6 4.8-3-5.5-6-5.5-3 2-6 2-3 2-6 2-3 1.6-6 1.6-3-4.4-6-4.4-3-0.2-6-0.2-3 1-6 1-3 3.1-6 3.1-3-4.9-6-4.9-3 1.5-6 1.5-3 1.6-6 1.6-3-1.3-6-1.3-3 3.7-6 3.7-3-6.4-6-6.4-3 2.5-6 2.5h-6c-3 0-3-0.6-6-0.6s-3-1.4-6-1.4-3 0.9-6 0.9-3 4.3-6 4.3-3-3.5-6-3.5c-2.2 0-3.4-1.3-5.2-2.3-1.8-1.1-3.6-1.5-4.6-3.3s-4.4-3.5-4.4-5.7c0-3.4 0.4-3.4 0.4-6.8s2.9-3.4 2.9-6.8-0.8-3.4-0.8-6.8c0-2.2 0.3-4.2 1.3-5.9 1.1-1.8 0.8-6.2 2.6-7.3 1.8-1 5.5-2 7.7-2 3 0 3 2 6 2s3-0.5 6-0.5 3 5.1 6 5.1 3-1.1 6-1.1 3-5.6 6-5.6 3 4.8 6 4.8 3 0.6 6 0.6 3-3.8 6-3.8 3 5.1 6 5.1 3-0.6 6-0.6 3-1.2 6-1.2 3-2.6 6-2.6 3-0.6 6-0.6 3 2.9 6 2.9 3-4.1 6-4.1 3 0.1 6 0.1 3 3.7 6 3.7 3 0.1 6 0.1 3-0.6 6-0.6 3 0.7 6 0.7 3-2.2 6-2.2 3 4.4 6 4.4 3-1.7 6-1.7 3-4 6-4 3 4.7 6 4.7 3-0.5 6-0.5 3-0.8 6-0.8 3-3.8 6-3.8 3 6.3 6 6.3 3-4.8 6-4.8 3 1.9 6 1.9 3-1.9 6-1.9 3 1.3 6 1.3c2.2 0 5-0.5 6.7 0.5 1.8 1.1 2.4 4 3.5 5.8 1 1.8 0.3 3.7 0.3 5.9 0 3.4 3.4 3.4 3.4 6.8s-3.3 3.4-3.3 6.8 4 3.4 4 6.8c0 2.2-6 2.7-7 4.4-1.1 1.8 1.1 6.7-0.7 7.7-1.6 0.8-4.7-1.1-6.8-1.1z"
                            fill="transparent"
                            stroke="#fff"
                          />
                        </svg>
                        <div className="dots">
                          <div className="dot dot-1" />
                          <div className="dot dot-2" />
                          <div className="dot dot-3" />
                          <div className="dot dot-4" />
                          <div className="dot dot-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" md:pl-0 pl-6">
                    <div className="flex justify-center sm:justify-end">
                      <div className="bg-gradient-to-r from-blue-600 to-yellow-400 w-full rounded-tl-full rounded-bl-full p-6 flex  shadow-2xl">
                        {/* Circular Progress Bar */}
                        <div className="relative h-44 w-44 sm:h-56 sm:w-56 flex items-center justify-center bg-gray-900 rounded-full shadow-inner">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 120 120"
                            className="transform -rotate-90"
                          >
                            {/* Background Circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r={radius}
                              stroke="rgba(255, 255, 255, 0.2)"
                              strokeWidth={stroke}
                              fill="transparent"
                            />
                            {/* Animated Progress Circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r={radius}
                              stroke="url(#gradient)"
                              strokeWidth={stroke}
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-in-out drop-shadow-glow"
                            />
                            {/* Multi-Color Gradient Effect */}
                            <defs>
                              <linearGradient
                                id="gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                              >
                                <stop offset="0%" stopColor="#ff0000" />
                                <stop offset="25%" stopColor="#ff7300" />
                                <stop offset="50%" stopColor="#ffeb00" />
                                <stop offset="75%" stopColor="#00ff00" />
                                <stop offset="100%" stopColor="#007bff" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Percentage Display with Glow */}
                          <div className="absolute text-white text-3xl font-extrabold drop-shadow-lg">
                            {progressPercentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Circular Elements for Aesthetic */}
                <div className="absolute top-[10px] left-[0px] w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-[#d68c21] opacity-30 shadow-lg" />
                <div className="absolute top-10 -left-10 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-amber-700 opacity-30 shadow-lg" />
                <div className="absolute right-6 bottom-[4px] sm:bottom-[20px] lg:left-[45%] lg:translate-x-[-50%] w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-[#d68c21] opacity-30 shadow-lg" />
                <div className="absolute right-0 bottom-6 sm:bottom-12 lg:left-[47%] lg:translate-x-[-50%] w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-amber-700 opacity-30 shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferCard;
