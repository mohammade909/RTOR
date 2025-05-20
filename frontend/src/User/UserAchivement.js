import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {getAllAchivers} from "../redux/achiversSlice"
import { useSelector, useDispatch } from "react-redux";
 
export const UserAchievement = () => {
  const dispatch=useDispatch()
  const {allachivers}=useSelector((state)=>state.achivers)
 
  useEffect(()=>{
    dispatch(getAllAchivers())
  },[dispatch])
  return (
    <>
      <div className="mb-6 ">
        <div className="p-3 mx-auto bg-white rounded-md shadow-lg max-w-7xl">
          <div className="text-left">
            <h2 className="mb-2 text-base font-semibold text-gray-800">Achievement</h2>
          </div>
          <Swiper
             spaceBetween={10}
             slidesPerView={1}
             loop={true}
             grabCursor={true}
             autoplay={{ delay: 2000, disableOnInteraction: false }}
             breakpoints={{
              360: { slidesPerView: 1 },  
               410: { slidesPerView: 2 },  
               640: { slidesPerView:3}, 
               1024: { slidesPerView:  4},

             }}
                 modules={[Autoplay, Navigation]}
             className="w-full swiper "
           >
          <div className="grid grid-cols-2 gap-8 mt-12 sm:grid-cols-4 lg:grid-cols-6 max-sm:justify-center ">
            {allachivers?.map((ach, index) => (
              <SwiperSlide  key={index} className="p-4 bg-gray-800 border rounded-lg ">
                <img
                  src={`/uploads/achivers/${ach?.image}`}
                  // src="/amit.png"
                  alt={ach?.image}
                  className="w-full sm:h-[140px]  lg:object-cover object-top rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h4 className="text-[12px] font-semibold text-white">{ach?.username}</h4>
                </div>
              </SwiperSlide>
            ))}
          </div>
          </Swiper>
        </div>
      </div>
    </>
  );
};