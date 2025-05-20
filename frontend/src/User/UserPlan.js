import { useState, useEffect } from "react";
import Loader from "../BaseFile/comman/Loader";
import { CheckIcon } from "@heroicons/react/20/solid";
import Spinner from "../BaseFile/comman/Spinner";
import UserPlanConfirmation from "./UserPlanConfirmation";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import UserEntryFeeConfirmation from "./UserEntryFeeConfirmation";
import { getAllPlans } from "../redux/planSlice";
import { getUser } from "../redux/userSlice";
import { clearErrors, clearMessage } from "../redux/depositeSlice";
import { useDispatch, useSelector } from "react-redux";
import {Link} from  'react-router-dom'
export default function UserPlan() {
  const dispatch = useDispatch();
  const { allplans, loading } = useSelector((state) => state.allplans);
  const {
    error,
    message,
    loading: topUpLoading,
  } = useSelector((state) => state.alltopup);
  const { auth } = useSelector((state) => state.auth);
  const { singleuser } = useSelector((state) => state.allusers);

  const [planConfirm, setPlanConfirm] = useState(false);
  const [plan, setPlan] = useState();
  const [entryPlanModel, setEntryPlanModel] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
    if (auth?.id) {
      const id = auth?.id;
      dispatch(getUser(id));
    }
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message, clearErrors, clearMessage]);

  function handleBuyPlan(plan) {
    setPlan(plan);
    setPlanConfirm(true);
  }
  function isclose() {
    setPlan(null);
    setPlanConfirm(false);
    setEntryPlanModel(false);
  }

  function handleEntryPlan() {
    setEntryPlanModel(true);
  }

  // const compoundPlan = allplans?.find((item) => item.name === "Compound Plan");

  const getPlanStyle = (planName) => {
    switch (planName.toLowerCase()) {
      case "entry":
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-500",
          badgeColor: "bg-blue-100 text-blue-800",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          iconColor: "text-blue-500",
        };
      case "silver":
        return {
          bgColor: "bg-cyan-50",
          borderColor: "border-cyan-400",
          badgeColor: "bg-cyan-100 text-cyan-800",
          buttonColor: "bg-cyan-600 hover:bg-cyan-700",
          iconColor: "text-cyan-500",
        };
      case "gold":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          badgeColor: "bg-yellow-100 text-yellow-800",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          iconColor: "text-yellow-600",
        };
      case "platinum":
        return {
          bgColor: "bg-purple-50",
          borderColor: "border-purple-500",
          badgeColor: "bg-purple-100 text-purple-800",
          buttonColor: "bg-purple-600 hover:bg-purple-700",
          iconColor: "text-purple-600",
        };
      default:
        return {
          bgColor: "bg-white",
          borderColor: "border-gray-300",
          badgeColor: "bg-gray-100 text-gray-800",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          iconColor: "text-blue-500",
        };
    }
  };

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <div className="">
          <div className="max-w-7xl mx-auto">
            {/* Header with modern styling */}
            <div className="text-left mb-4">
              <h1 className="text-xl font-semibold mb-1 text-transparent  bg-clip-text bg-gradient-to-r from-[#F4A950] to-[#2c7180]">
                Premium Investment Plans
              </h1>
              {/* <div className="h-1 w-24 bg-gradient-to-r from-[#F4A950] to-[#2c7180] mx-auto mb-6"></div> */}
              <p className="text-gray-800 text-sm max-w-2xl">
                Take control of your financial future with our expertly crafted
                investment strategies
              </p>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10  mb-8">
              {singleuser?.entry_fees == 0
                ? allplans
                    ?.filter((item) => item.name == "agreement")
                    .map((plan) => (
                      <div key={plan.id} className="relative group">
                        <div className="relative h-full overflow-hidden shadow-sm border-t-0 border border-gray-200">
                          {/* Top Clip Shape */}
                          <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-24 relative">
                              <div
                                className="absolute bottom-[16px] left-0 w-full h-20 bg-white"
                                style={{
                                  clipPath: "ellipse(50% 100% at 50% -15%)",
                                }}
                              ></div>
                          </div>

                          {/* Header */}
                          <div className="bg-gradient-to-r from-amber-600 to-amber-400 px-8 pt-0 pb-4">
                           <div className="absolute top-[50px] left-1/2 -translate-x-1/2 ">
                                <div className="bg-gray-800 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                                   {plan.name}
                                </div>
                              </div>
                            {/* <div className="flex justify-between items-start">
                              <h2 className="text-xl font-semibold capitalize tracking-wider mb-2 text-white">
                                {plan.name}
                              </h2>
                              <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-7 w-7 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div> */}
                            <div className="flex items-end ">
                              <span className="text-3xl font-semibold text-white">
                                ${plan.monthly_price}
                              </span>
                              {plan.id !== 4 && (
                                <span className="ml-2 text-sm text-white opacity-80">
                                  minimum investment
                                </span>
                              )}
                            </div>
                            <p className="mt-3 text-white text-opacity-90">
                              {plan.description || "Premium investment plan"}
                            </p>
                          </div>
                          <div className="p-8 bg-gray-800">
                            <ul className="space-y-4">
                              <li className="flex justify-between items-center bg-gray-700 bg-opacity-40 rounded-lg p-3">
                                <span className="text-gray-300">
                                 Daily Rent
                                </span>
                                <span className="font-semibold text-amber-400 text-lg">
                                  {plan.ROI_overall}%
                                </span>
                              </li>
                              <li className="flex justify-between items-center bg-gray-700 bg-opacity-40 rounded-lg p-3">
                                <span className="text-gray-300">Bonus</span>
                                <span className="font-semibold text-amber-400 text-lg">
                                  {plan.bonus}%
                                </span>
                              </li>
                              {/* <li className="flex justify-between items-center bg-gray-700 bg-opacity-40 rounded-lg p-4">
                                <span className="text-gray-300">
                                  Plan Period
                                </span>
                                <span className="font-semibold text-amber-400 text-lg">
                                  {plan.plan_period} months
                                </span>
                              </li> */}
                              {plan.id !== 4 && (
                                <li className="flex justify-between items-center bg-gray-700 bg-opacity-40 rounded-lg p-3">
                                  <span className="text-gray-300">
                                    Investment Range
                                  </span>
                                  <span className="font-semibold text-amber-400 text-lg">
                                    ${plan.min} - ${plan.max.toLocaleString()}
                                  </span>
                                </li>
                              )}
                            </ul>
                            <button
                              onClick={() => handleEntryPlan()}
                              className="w-full mt-8 py-3 px-4 rounded-lg font-bold text-lg transition-all overflow-hidden relative group/btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                            >
                              <span className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition duration-500"></span>
                              <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                  <Spinner />
                                ) : (
                                  <>
                                    Activate Plan{" "}
                                    <span className="group-hover/btn:translate-x-1 transition-transform">
                                      →
                                    </span>
                                  </>
                                )}
                              </span>
                            </button>
                            <div className="mt-6 pt-4 border-t border-gray-700">
                              <p className="text-xs text-gray-400">
                                <Link  to="/agreement-terms-condition" className="font-semibold text-yellow-400 ">
                                  Terms & Conditions:
                                </Link >{" "}
                                Participants must be at least 18 years old to
                                enroll in any marketing plan.
                              </p>
                            </div>
                          </div>

                          {/* Bottom Clip Shape */}
                          {/* <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-24 relative">
                            <div
                              className="absolute top-0 left-0 w-full h-8 bg-gray-800"
                              style={{
                                clipPath: "ellipse(50% 100% at 50% 0%)",
                              }}
                            ></div>
                          </div> */}
                        </div>
                      </div>
                    ))
                : allplans
                    ?.filter((item) => item.name !== "agreement")
                    .map((plan) => {
                      const isStarter = plan.name.toLowerCase() === "starter";
                      const isGolden = plan.name.toLowerCase() === "gold";
                      const isPlatinum = plan.name.toLowerCase() === "platinum";
                      const isSilver = plan.name.toLowerCase() === "silver";

                      // Set theme colors based on plan type
                      let bgColor = "bg-gray-600";
                      let borderColor = "border-gray-500";
                      let textColor = "text-gray-100";
                      let accentColor = "text-gray-200";
                      let btnGradient = "from-gray-500 to-gray-600";
                      let headerGradient = "from-gray-500 to-gray-600";
                      let ribbon = null;

                      if (isGolden) {
                        bgColor = "bg-yellow-600";
                        borderColor = "border-yellow-500";
                        textColor = "text-yellow-100";
                        accentColor = "text-yellow-300";
                        btnGradient = "from-yellow-500 to-yellow-600";
                        headerGradient = "from-yellow-500 to-yellow-400";
                        ribbon = "Most Popular";
                      } else if (isPlatinum) {
                        bgColor = "bg-purple-600";
                        borderColor = "border-purple-500";
                        textColor = "text-purple-100";
                        accentColor = "text-purple-300";
                        btnGradient = "from-purple-500 to-purple-600";
                        headerGradient = "from-purple-500 to-purple-400";
                      } else if (isSilver) {
                        bgColor = "bg-gray-500";
                        borderColor = "border-gray-400";
                        textColor = "text-gray-100";
                        accentColor = "text-gray-200";
                        btnGradient = "from-gray-400 to-gray-500";
                        headerGradient = "from-gray-400 to-gray-300";
                      } else if (isStarter) {
                        bgColor = "bg-blue-600";
                        borderColor = "border-blue-500";
                        textColor = "text-blue-100";
                        accentColor = "text-blue-300";
                        btnGradient = "from-blue-500 to-blue-600";
                        headerGradient = "from-blue-500 to-blue-400";
                      }

                      const calculateEarnings = () => {
                        if (plan.ROI_day === 0) return 0;
                        const dailyEarning =
                          (plan.monthly_price * plan.ROI_day) / 100;
                        return (dailyEarning * 30 ).toFixed(
                          2
                        );
                      };

                      return (
                        <div key={plan.id} className="relative group h-full">
                          {/* Card Container with Shadow */}
                          <div className="relative h-full flex flex-col border-t-0 border border-gray-200 overflow-hidden shadow-sm">
                            {/* Top Clip Shape */}
                            <div className={`${bgColor} h-24 relative`}>
                              <div
                                className="absolute bottom-[16px] left-0 w-full h-20 bg-white"
                                style={{
                                  clipPath: "ellipse(50% 100% at 50% -15%)",
                                }}
                              ></div>
                            </div>

                            {/* Ribbon (if popular) */}
                            {ribbon && (
                              <div className="absolute top-[50px] left-1/2 -translate-x-1/2 ">
                                <div className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                                  {ribbon}
                                </div>
                              </div>
                            )}

                            {/* Header */}
                            <div
                              className={`relative bg-gradient-to-b ${headerGradient} px-8 p-4 text-center flex-grow-0`}
                            >
                              <h3 className="text-2xl absolute -top-[80px] left-1/2 -translate-x-1/2 font-bold text-gray-800 capitalize mb-2">
                                {plan.name}
                              </h3>

                              <div className="flex justify-center items-baseline">
                                <span className="text-4xl font-bold text-white">
                                  ${plan.monthly_price}
                                </span>
                                <span className="text-white text-opacity-70 ml-1">
                                  /month
                                </span>
                              </div>

                              <p className="text-white text-opacity-80 mt-2 text-sm">
                                {plan.description || "Investment Plan"}
                              </p>
                            </div>

                            {/* Features */}
                            <div className="flex-grow flex flex-col bg-white p-6">
                              {/* Potential Earnings */}
                              <div className="py-3 px-4 bg-gray-100 rounded-lg mb-6 text-center">
                                <p className="text-sm text-gray-500 mb-1">
                                  Potential Earnings
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  ${calculateEarnings()}
                                </p>
                              </div>

                              {/* Features List */}
                              <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                  <div
                                    className={`${bgColor} p-1 rounded-full mr-3`}
                                  >
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Daily Rent:{" "}
                                    </span>
                                    <span
                                      className={`font-medium text-gray-900`}
                                    >
                                      {plan.ROI_day}%
                                    </span>
                                  </div>
                                </li>
                                <li className="flex items-center">
                                  <div
                                    className={`${bgColor} p-1 rounded-full mr-3`}
                                  >
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Total Rooms:{" "}
                                    </span>
                                    <span
                                      className={`font-medium text-gray-900`}
                                    >
                                      {plan?.monthly_price === 100
                                        ? 1
                                        : plan?.monthly_price === 300
                                        ? 3
                                        : plan?.monthly_price === 500
                                        ? 5
                                        : 10}
                                    </span>
                                  </div>
                                </li>
                                <li className="flex items-center">
                                  <div
                                    className={`${bgColor} p-1 rounded-full mr-3`}
                                  >
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Sponsor Bonus:{" "}
                                    </span>
                                    <span
                                      className={`font-medium text-gray-900`}
                                    >
                                      ${plan.Sponser_bonus}
                                    </span>
                                  </div>
                                </li>
                                {/* <li className="flex items-center">
                                  <div
                                    className={`${bgColor} p-1 rounded-full mr-3`}
                                  >
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Plan Period:{" "}
                                    </span>
                                    <span
                                      className={`font-medium text-gray-900`}
                                    >
                                      {plan.plan_period} months
                                    </span>
                                  </div>
                                </li> */}
                                <li className="flex items-center">
                                  <div
                                    className={`${bgColor} p-1 rounded-full mr-3`}
                                  >
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Age must be:{" "}
                                    </span>
                                    <span
                                      className={`font-medium text-gray-900`}
                                    >
                                      18+
                                    </span>
                                  </div>
                                </li>
                              </ul>

                              {/* Button */}
                              <div className="mt-auto">
                                <button
                                  onClick={() => handleBuyPlan(plan)}
                                  className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-all relative overflow-hidden bg-gradient-to-r ${btnGradient} hover:shadow-lg text-white`}
                                >
                                  <span className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                      <Spinner />
                                    ) : (
                                      <>
                                        Invest Now{" "}
                                        <span className="group-hover:translate-x-1 transition-transform">
                                          →
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Bottom Clip Shape */}
                            {/* <div className={`${bgColor} h-24 relative`}>
                              <div
                                className="absolute top-0 left-0 w-full h-20 bg-white"
                                style={{
                                  clipPath: "ellipse(55% 100% at 50% 0%)",
                                }}
                              ></div>
                            </div> */}
                          </div>
                        </div>
                      );
                    })}
            </div>

            {/* Investment Plans Grid Layout */}
          </div>
        </div>
      )}

      {planConfirm && (
        <UserPlanConfirmation
          isclose={isclose}
          plan={plan}
          user_id={auth?.id}
        />
      )}
      {entryPlanModel && (
        <UserEntryFeeConfirmation isclose={isclose} user_id={auth?.id} />
      )}
    </>
  );
}
