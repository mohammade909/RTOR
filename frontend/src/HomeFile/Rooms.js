import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Rooms = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  const rooms = [
    {
      price: "$10",
      name: "Agreement Fee",
      description: ["✅ Valid for Lifetime", "🚫 Non-refundable"],
      img: "/aggrement.avif",
    },
    {
      price: "$100",
      name: "Starter Stay Plan",
      description: ["Own 1 hotel room", "Earn 1% daily rent income", "Ideal for new investors","Fully managed, zero hassle"],
      img: "/room2.jpg",
    },
    {
      price: "$300",
      name: "Comfort Stay Plan",
      description: ["Own 3 hotel rooms", "1.5% daily rent income", "Higher returns, low entry", "Great for building momentum"],
      img: "/room3.jpg",
    },
    {
      price: "$500",
      name: "Prime Stay Plan",
      description: ["Own 5 hotel rooms", "2.5% daily rent income","Strong daily earnings","Best value for mid-level investors"],
      img: "/room4.avif",
    },
    {
      price: "$1,000",
      name: "Elite Stay Plan",
      description: ["Own 10 hotel rooms", "3% daily rent income", "Maximum daily payout","Premium benefits & reports"],
      img: "/room5.avif",
    },
 
  ];

  const getVisibleSlides = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    }
    return 3;
  };

  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    setVisibleSlides(getVisibleSlides());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalSlides = Math.ceil(rooms.length - visibleSlides + 1);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, totalSlides]);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextSlide();
    }
    if (touchStart - touchEnd < -150) {
      prevSlide();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block">
            Smart Hotel Packages
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Choose a package that fits your goals and start earning daily from real hotel rooms.
          </p>
        </div>

        <div
          className="relative px-8 md:px-12"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
        >
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-yellow-600 hover:text-yellow-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-yellow-600 hover:text-yellow-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${
                  activeIndex * (100 / visibleSlides)
                }%)`,
              }}
            >
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 py-2 transition-opacity duration-500`}
                  style={{
                    opacity:
                      Math.abs(activeIndex - index) > visibleSlides ? 0.3 : 1,
                  }}
                >
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 h-full border border-gray-100">
                    <div className="relative overflow-hidden">
                      <div className="overflow-hidden h-64">
                        <img
                          src={room.img}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 transform transition-transform duration-500 group-hover:translate-y-1">
                        <span className="bg-yellow-600 text-white py-2 px-4 rounded-md font-bold text-lg shadow-lg">
                          {room.price}
                        </span>
                      </div>
                      <div className="absolute hidden sm:block bottom-4 right-4 text-right">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {room.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-900 block sm:hidden font-semibold text-base">
                        {room.name}
                      </p>

                      {/* ✅ Description rendered conditionally as list or paragraph */}
                      {Array.isArray(room.description) ? (
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                          {room.description.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 mb-4">{room.description}</p>
                      )}

                      <Link to="/register">
                        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg duration-300 shadow-md hover:shadow-xl transform hover:scale-105 transition-transform">
                          Buy Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10 space-x-1">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "bg-yellow-600 w-8"
                  : "bg-gray-300 w-3 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
