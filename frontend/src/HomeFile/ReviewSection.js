import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ReviewSection = () => {
  const cardData = [
    {
      title: "Absolutely recommended!",
      name: "John M.",
      img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      sub_text: "John M.",
      description:
        "FinDocs made the whole process of finding the right franchise so much easier. Their team was always there to guide me, and now I'm running a successful business!",
    },
    {
      title: "Absolutely recommended!",
      name: "Sarah L.",
      img:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      sub_text: "Sarah L.",
      description:
        "I was overwhelmed by all the options out there, but FinDocs helped me narrow it down to the perfect franchise. Their support and resources were invaluable",
    },
    {
      title: "Absolutely recommended!",
      name: "Mark T.",
      sub_text: "Mark T.",
      img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
      description:
        "From the first consultation to the final decision, FinDocs was with me every step of the way. I couldn't be happier with the franchise I chose!",
    },
   
  ];

  return (
    <div className=" py-10 bg-white sm:px-4 lg:px-0 px-4">
        <div className="max-w-7xl mx-auto lg:px-8 px-4">
      <div className="relative p-[2px] rounded-lg shadow-lg border overflow-hidden">
        <div className="absolute inset-0 shadow-lg opacity-50"></div>
        <div className="relative z-10 sm:p-6 rounded-lg">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="w-full"
          >
            {cardData.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="p-4">
                  <div className="w-full mb-4 sm:px-4 pt-5">
                    <div className="sm:text-center ">
                      <h2 id="our-clients" className="font-semibold text-3xl text-gray-800">
                      Our Clients’ Success Stories
                      </h2>
                    </div>
                  </div>
                  <div className="h-full sm:text-center sm:px-8 rounded custom-shadow hover:custom-shadow">
                    <div className="sm:text-center sm:pb-5">
                      <div className="isolate flex  overflow-hidden py-5 justify-center">
                        <img
                          alt=""
                          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="relative z-30 inline-block h-20 w-20 rounded-md ring-2 ring-white"
                        />
                    
                      </div>
                      <div className="max-w-3xl mx-auto">
                      <span className="title-font font-medium text-lg text-gray-800">
                            {card.name}
                          </span>
                      <p className="leading-relaxed mb-6 text-gray-800 text-sm sm:text-center text-center">
                        {card.description}
                      </p>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
