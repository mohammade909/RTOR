// import React, { useState, useEffect, useRef } from "react";
// import { Check, ChevronLeft, ChevronRight } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPlans } from "../../redux/planSlice";

// const Packagessection = () => {
//   const dispatch = useDispatch();
//   const { allplans, loading, error } = useSelector((state) => state.allplans);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     dispatch(getAllPlans());
//   }, [dispatch]);

//   const plans = allplans?.slice().sort((a, b) => a.monthly_price - b.monthly_price) || [];


//   const slidesPerView = () => {
//     if (window.innerWidth >= 1280) return 3;
//     if (window.innerWidth >= 768) return 2;
//     return 1;
//   };

//   const [visibleSlides, setVisibleSlides] = useState(slidesPerView());

//   useEffect(() => {
//     const handleResize = () => {
//       setVisibleSlides(slidesPerView());
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const nextSlide = () => {
//     if (currentIndex < plans.length - visibleSlides) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const formatFeatures = (plan) => [
//     `${plan.ROI_day}% Daily ROI`,
//     `${plan.plan_period} Month Plan Period`,
//     `Min: $${plan.min}`,
//     `Max: ${plan.max === 1000000 ? "Unlimited" : "$" + plan.max}`,
//   ];

//   const formatPlanName = (name) => {
//     return name.charAt(0).toUpperCase() + name.slice(1);
//   };

//   if (loading) {
//     return (
//       <div className="bg-gradient-to-r from-[#263283] to-[#ed2924] py-12 flex justify-center items-center h-96">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-[#263283] to-[#ed2924] py-12 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-5 lg:px-0">
//         <div className="text-center">
//           <h2 className="text-base text-red-300 font-semibold tracking-wide uppercase inline-flex items-center gap-2">
//             <span className="bg-white rounded-full p-1">💼</span> Our Investment
//             Packages
//           </h2>
//           <p className="mt-3 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
//             Start Earning Daily Returns
//           </p>
//           <p className="mt-4 max-w-2xl text-xl text-gray-100 mx-auto">
//             Choose the right package based on your investment goals — all
//             powered by GFM's advanced Forex bots.
//           </p>
//         </div>

//         <div className="mt-12 relative">
//           {plans.length > visibleSlides && (
//             <>
//               <button
//                 onClick={prevSlide}
//                 disabled={currentIndex === 0}
//                 className={`absolute -left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg ${
//                   currentIndex === 0
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 <ChevronLeft className="h-6 w-6 text-[#263283]" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 disabled={currentIndex >= plans.length - visibleSlides}
//                 className={`absolute -right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg ${
//                   currentIndex >= plans.length - visibleSlides
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 <ChevronRight className="h-6 w-6 text-[#ed2924]" />
//               </button>
//             </>
//           )}

//           <div
//             ref={sliderRef}
//             className="flex transition-transform duration-300 ease-in-out"
//             style={{
//               transform: `translateX(-${
//                 currentIndex * (100 / visibleSlides)
//               }%)`,
//             }}
//           >
//             {plans.map((plan) => {
//               const isPremium =
//                 plan.name === "diamond" || plan.name === "platinum";
//               const features = formatFeatures(plan);

//               return (
//                 <div
//                   key={plan.id}
//                   className={`w-full px-2 sm:px-3 flex-shrink-0`}
//                   style={{ width: `${100 / visibleSlides}%` }}
//                 >
//                   <div
//                     className={`h-full rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
//                       isPremium
//                         ? "ring-2 ring-yellow-400"
//                         : "ring-1 ring-gray-200"
//                     }`}
//                   >
//                     <div
//                       className={`px-6 py-8 ${
//                         isPremium
//                           ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
//                           : "bg-white"
//                       }`}
//                     >
//                       {isPremium && (
//                         <div className="absolute top-0 right-0">
//                           <div className="bg-yellow-400 text-xs font-bold uppercase px-3 py-1 rounded-bl-lg text-gray-900">
//                             Premium
//                           </div>
//                         </div>
//                       )}
//                       <h3
//                         className={`text-center text-2xl font-bold ${
//                           isPremium ? "text-white" : "text-gray-900"
//                         }`}
//                       >
//                         {formatPlanName(plan.name)}
//                       </h3>
//                       <div className="mt-4 flex justify-center items-baseline">
//                         <span
//                           className={`text-4xl font-extrabold ${
//                             isPremium ? "text-white" : "text-gray-900"
//                           }`}
//                         >
//                           ${plan.min}
//                         </span>
//                         <span
//                           className={`ml-1 text-xl ${
//                             isPremium ? "text-gray-300" : "text-gray-500"
//                           }`}
//                         >
//                           min
//                         </span>
//                       </div>
//                       <p
//                         className={`mt-4 text-sm ${
//                           isPremium ? "text-gray-300" : "text-gray-500"
//                         } text-center`}
//                       >
//                         {plan.description ||
//                           `Investment range: $${plan.min} - $${
//                             plan.max === 1000000 ? "Unlimited" : plan.max
//                           }`}
//                       </p>
//                     </div>
//                     <div
//                       className={`px-6 pt-6 pb-8 ${
//                         isPremium ? "bg-gray-800" : "bg-gray-50"
//                       }`}
//                     >
//                       <h4
//                         className={`text-sm font-medium tracking-wide ${
//                           isPremium ? "text-gray-200" : "text-gray-900"
//                         }`}
//                       >
//                         What's included:
//                       </h4>
//                       <ul className="mt-6 space-y-4">
//                         {features.map((feature, index) => (
//                           <li key={index} className="flex items-start">
//                             <Check
//                               className={`flex-shrink-0 h-5 w-5 ${
//                                 isPremium ? "text-green-400" : "text-green-500"
//                               } mt-1`}
//                             />
//                             <span
//                               className={`ml-3 text-base ${
//                                 isPremium ? "text-gray-300" : "text-gray-600"
//                               }`}
//                             >
//                               {feature}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                       <div className="mt-8">
//                         <button
//                           onClick={()=>{
//                             window.location.href ='/registration'
//                           }}
//                           className={`w-full py-3 px-4 rounded-lg shadow-md text-center text-base font-medium transition-all duration-300 ${
//                             isPremium
//                               ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900"
//                               : "bg-gradient-to-r from-[#263283] to-[#ed2924] hover:opacity-90 text-white"
//                           }`}
//                         >
//                           Start Investing
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex justify-center mt-8">
//           <div className="flex space-x-2">
//             {Array.from({
//               length: Math.ceil(plans.length / visibleSlides),
//             }).map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentIndex(idx * visibleSlides)}
//                 className={`h-2 w-2 rounded-full ${
//                   currentIndex >= idx * visibleSlides &&
//                   currentIndex < (idx + 1) * visibleSlides
//                     ? "bg-white"
//                     : "bg-gray-400 bg-opacity-50"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Packagessection;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../redux/planSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Check } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Packagessection = () => {
  const dispatch = useDispatch();
  const { allplans, loading } = useSelector((state) => state.allplans);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const plans =
    allplans?.slice().sort((a, b) => a.monthly_price - b.monthly_price) || [];

  const formatFeatures = (plan) => [
    `${plan.ROI_day}% Daily ROI`,
    `${plan.plan_period} Month Plan Period`,
    `Min: $${plan.min}`,
    `Max: ${plan.max === 1000000 ? "Unlimited" : "$" + plan.max}`,
  ];

  const formatPlanName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  const getCardTheme = (index) => {
    const themes = [
      {
        bg: "from-blue-900 to-indigo-800",
        accent: "bg-blue-500",
        text: "text-blue-100",
        button:
          "from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
      },
      {
        bg: "from-purple-900 to-fuchsia-800",
        accent: "bg-purple-500",
        text: "text-purple-100",
        button:
          "from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700",
      },
      {
        bg: "from-amber-900 to-orange-800",
        accent: "bg-amber-500",
        text: "text-amber-100",
        button:
          "from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700",
      },
      {
        bg: "from-emerald-900 to-teal-800",
        accent: "bg-emerald-500",
        text: "text-emerald-100",
        button:
          "from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700",
      },
    ];
    return themes[index % themes.length];
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 py-12 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-0">
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold tracking-wide mb-4">
            INVESTMENT PLANS
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Tailored{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Investment Solutions
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
            Choose a plan that matches your financial goals and risk appetite.
          </p>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
          >
            {plans.map((plan, index) => {
              const theme = getCardTheme(index);
              const features = formatFeatures(plan);

              return (
                <SwiperSlide key={plan.id}>
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-gray-900 hover:scale-[1.02] transition-all duration-300">
                    <div className={`bg-gradient-to-r ${theme.bg} px-6 py-8 relative`}>
                      <div className="absolute top-4 right-4">
                        <span className={`${theme.accent} text-xs font-bold uppercase px-2 py-1 rounded-md text-white`}>
                          {formatPlanName(plan.name)}
                        </span>
                      </div>
                      <h3 className={`text-center text-2xl font-bold ${theme.text}`}>
                        {formatPlanName(plan.name)} Plan
                      </h3>
                      <div className="mt-6 flex justify-center items-end">
                        <span className="text-5xl font-extrabold text-white">
                          ${plan.min}
                        </span>
                        <span className="ml-2 text-lg text-gray-300">
                          - {plan.max === 1000000 ? "∞" : `$${plan.max}`}
                        </span>
                      </div>
                      <div className="mt-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-black bg-opacity-20 text-sm font-medium text-white">
                          {plan.ROI_day}% Daily ROI
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow px-6 pt-6 pb-8">
                      <ul className="space-y-3">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div
                              className={`h-6 w-6 rounded-full ${theme.accent} flex items-center justify-center mr-3`}
                            >
                              <Check className="h-4 w-4 text-white" />
                            </div>
                            <span className={`text-base ${theme.text}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <button
                          onClick={() => (window.location.href = "/registration")}
                          className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${theme.button} shadow-lg transition-all hover:shadow-xl`}
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Packagessection;
