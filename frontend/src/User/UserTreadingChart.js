import React from "react";
import Tradechart from "./Tradechart";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import TradeNow from "./TradeNow";
export const UserTreadingChart = () => {
  const { auth } = useSelector((state) => state.auth);
  return (
    <>
      <div className="mb-10 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <p className="text-lg md:text-xl font-semibold text-gray-800">
            Treading Chart
          </p>
          <p className="text-sm md:text-base font-medium text-gray-700">
            Click the Trade Now button to start trading
          </p>
          <div>
            <TradeNow userId={auth?.id} />
          </div>
        </div>

        <Tradechart />

        <div className="h-16 md:h-0"></div>
      </div>
    </>
  );
};
