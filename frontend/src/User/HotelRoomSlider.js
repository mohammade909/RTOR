import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function HotelRoomSlider() {
  const roomData = [
    {
      id: 1,
      roomNumber: "172 Grey",
      floor: "22F",
      wing: "JF",
      type: "Type 234",
      status: "Booked",
      image: "https://kamr.scriptlelo.com/vite/demo/assets/pic-8-CeEQEqhO.jpg",
      color: "bg-blue-100",
    },
    {
      id: 2,
      roomNumber: "235 Cream",
      floor: "G32",
      wing: "",
      type: "Type 234",
      status: "Booked",
      image: "https://kamr.scriptlelo.com/vite/demo/assets/pic-8-CeEQEqhO.jpg",
      color: "bg-amber-50",
    },
    {
      id: 3,
      roomNumber: "82 Green",
      floor: "HF",
      wing: "",
      type: "Type 234",
      status: "Available",
      image: "https://kamr.scriptlelo.com/vite/demo/assets/pic-8-CeEQEqhO.jpg",
      color: "bg-gray-100",
    },
    {
      id: 4,
      roomNumber: "193 Blue",
      floor: "15F",
      wing: "EF",
      type: "Type 234",
      status: "Booked",
      image: "https://kamr.scriptlelo.com/vite/demo/assets/pic-8-CeEQEqhO.jpg",
      color: "bg-blue-50",
    },
    {
      id: 5,
      roomNumber: "301 Beige",
      floor: "30F",
      wing: "WF",
      type: "Type 234",
      status: "Available",
      image: "https://kamr.scriptlelo.com/vite/demo/assets/pic-8-CeEQEqhO.jpg",
      color: "bg-amber-100",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else {
        setVisibleItems(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = roomData.length;
  const maxIndex = totalSlides - visibleItems;

  const next = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getStatusClass = (status) => {
    return status === "Available"
      ? "bg-green-500 text-white"
      : "bg-red-400 text-white";
  };

  return (
    <div className="relative">
     

      {/* Slider Content */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {roomData.map((room) => (
            <div
              key={room.id}
              className="flex-shrink-0 px-1"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <div className="rounded-lg overflow-hidden shadow-md h-full group">
                <div className="relative">
                  <div className="h-80 bg-gray-200 relative group">
                    <img
                      src={room.image}
                      alt={room.roomNumber}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2 flex flex-col items-center space-y-2">
                      {/* Tag above the button */}
                      <Link to='/user/plan' className="text-white border border-white/20 bg-black/60 px-3 py-1 text-xs rounded-full">
                         View Details
                      </Link>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <Heart size={18} className="text-gray-700" />
                    </button>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-md ${getStatusClass(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-base font-semibold mb-1 flex items-center">
                      <MapPin size={18} className="mr-1" />
                      {room.roomNumber} - {room.floor}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm bg-black/30 px-2 py-1 rounded">
                        {room.type}
                      </p>
                      <div className="flex items-center">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="ml-1 text-sm">4.8 (120 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev Button */}
        {currentIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full shadow-md p-2 z-10 hover:bg-gray-900"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < maxIndex && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full shadow-md p-2 z-10 hover:bg-gray-900"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}
      </div>

      {/* Slide Dots */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-8 mx-1 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
