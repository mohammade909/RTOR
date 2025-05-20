import React from "react";
import { MdOutlinePayments } from "react-icons/md";
const searches = [
  {
    image:
      "https://image3.jdomni.in/banner/13062021/58/97/7C/E53960D1295621EFCB5B13F335_1623567851299.png?output-format=webp",
    title: "Daily Profit Earning",
    bgColor: "bg-blue-800"
  },
  {
    image:
      "https://image2.jdomni.in/banner/13062021/3E/57/E8/1D6E23DD7E12571705CAC761E7_1623567977295.png?output-format=webp",
    title: "Safe & Secure Platform",
    bgColor: "bg-pink-800"
  },
  {
    image:
      "https://image3.jdomni.in/banner/13062021/16/7E/7E/5A9920439E52EF309F27B43EEB_1623568010437.png?output-format=webp",
    title: "Low Starting Investment",
    bgColor: "bg-purple-800"
  },
  {
    image:
      "https://image3.jdomni.in/banner/13062021/EB/99/EE/8B46027500E987A5142ECC1CE1_1623567959360.png?output-format=webp",
    title: "24/7 Auto Trading Bots",
    bgColor: "bg-teal-800"
  },
];
export const SearchTab = () => {
  return (
    <>
   <div className="max-w-5xl mx-auto px-2 py-4 relative z-30 -mt-24 sm:mb-10">
  <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 p-4">
    {searches.map((search, index) => (
      <div
        key={index}
        className={`px-4 py-3 ${search.bgColor} shadow-sm border border-white/50 transition-transform transform hover:scale-105 hover:shadow-lg `}
      >
        <div className="flex justify-center">
          <img
            className="w-20 duration-300" // Remove group-hover as it's not needed here
            src={search.image} 
            alt={search.title} 
          />
        </div>
        <h2 className="text-sm font-semibold  text-white my-2">{search.title}</h2>
      </div>
    ))}
  </div>
</div>

    </>
  );
};
