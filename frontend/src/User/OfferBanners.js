import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fecthUserOffers, fetchReferredUsers } from "../redux/offer";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import OfferCard from "./OfferCard";

const TrendingOffersBanner = () => {
  const dispatch = useDispatch();
  const {loading, offers} = useSelector((state) => state.offers?.offers);
  const { auth } = useSelector((state) => state.auth);
  const referredUsers = useSelector((state) => state.offers.offerDetails);

  useEffect(() => {
    if (auth?.id) {
      dispatch(fecthUserOffers(auth.id));
    }
  }, [dispatch, auth]);

  // Function to handle slide change
  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.activeIndex;

    // Check if offers exist and the activeIndex is valid
    if (offers && offers.length > 0 && activeIndex < offers.length) {
      const currentOffer = offers[activeIndex];

      // Dispatch the action for the current slide
      dispatch(
        fetchReferredUsers({
          userId: auth.id,
          startDate: currentOffer.start_date,
          endDate: currentOffer.end_date,
          userPlanVal: currentOffer.user_plan_val,
        })
      );
    }
  };

  // Initial load for the first slide when offers are available
  useEffect(() => {
    if (offers && offers?.length > 0 && auth?.id) {
      // Dispatch for the first offer
      const firstOffer = offers[0];

      console.log(
        auth.id,
        firstOffer.start_date,
        firstOffer.end_date,
        firstOffer.user_plan_val
      );
      dispatch(
        fetchReferredUsers({
          userId: auth.id,
          startDate: firstOffer.start_date,
          endDate: firstOffer.end_date,
          userPlanVal: firstOffer.user_plan_val,
        })
      );
    }
  }, [offers, auth, dispatch]);

  console.log(referredUsers);
  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full"
        onSlideChange={handleSlideChange}
      >
       
         { offers?.map((offer) => (
            <SwiperSlide key={offer.offer_id}>
              <OfferCard offer={offer} referredUsers={referredUsers} />
            </SwiperSlide>
          ))
          }
      </Swiper>
    </div>
  );
};

export default TrendingOffersBanner;
