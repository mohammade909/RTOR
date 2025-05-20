import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import Loader from "../BaseFile/comman/Loader";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Spinner from "../BaseFile/comman/Spinner";

import {
  getAllPlans,
  clearErrors,
  deletePlan,
  clearMessage,
} from "../redux/planSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AdminPlan() {
  const dispatch = useDispatch();
  const { allplans, loading, error, message } = useSelector(
    (state) => state.allplans
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [deleteID, setdeleteID] = useState();

  useEffect(() => {
    dispatch(getAllPlans());
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

  function isClose() {
    setModalopen(false);
  }
  function handleDelete(id) {
    setdeleteID(id);
    if (deleteID) {
      console.log(id);
      setModalopen(true);
    }
  }

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
          bgColor: "bg-gray-50",
          borderColor: "border-gray-400",
          badgeColor: "bg-gray-100 text-gray-800",
          buttonColor: "bg-gray-600 hover:bg-gray-700",
          iconColor: "text-gray-500",
        };
      case "golden":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          badgeColor: "bg-yellow-100 text-yellow-800",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          iconColor: "text-yellow-600",
        };
      case "premium":
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
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
      

        <div className="bg-gray-100 min-h-screen py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Investment Plans
              </h1>
              <p className="text-lg text-gray-600">
                Select the perfect plan for your investment goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allplans?.map((plan) => {
                const style = getPlanStyle(plan.name);

                // Calculate potential earnings based on daily ROI
                const calculateEarnings = () => {
                  if (plan.ROI_day === 0) return 0;
                  const dailyEarning =
                    (plan.monthly_price * plan.ROI_day) / 100;
                  return (dailyEarning * 30 * plan.plan_period).toFixed(2);
                };

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl overflow-hidden shadow-xl border-t-4 ${style.borderColor} ${style.bgColor} transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1`}
                  >
                    {/* Popular badge for golden plan */}
                    {plan.name.toLowerCase() === "golden" && (
                      <div className="absolute top-0 right-0 mt-4 mr-4">
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                          POPULAR
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="pt-8 pb-4 px-6 text-center">
                      <h3 className="text-2xl font-bold capitalize mb-1">
                        {plan.name}
                      </h3>
                      <div className="flex justify-center items-end">
                        <span className="text-4xl font-bold">
                          ${plan.monthly_price}
                        </span>
                        <span className="text-gray-500 ml-1">/month</span>
                      </div>
                      <p className="text-gray-500 mt-2 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-gray-200"></div>

                    {/* Features List */}
                    <div className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <svg
                            className={`w-5 h-5 ${style.iconColor} mr-2`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="text-gray-600">Daily Rent: </span>
                            <span className="font-medium">{plan.ROI_day}%</span>
                          </div>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className={`w-5 h-5 ${style.iconColor} mr-2`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="text-gray-600">Overall Rent: </span>
                            <span className="font-medium">
                              {plan.ROI_overall}%
                            </span>
                          </div>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className={`w-5 h-5 ${style.iconColor} mr-2`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="text-gray-600">
                              Sponsor Bonus:{" "}
                            </span>
                            <span className="font-medium">
                              ${plan.Sponser_bonus}
                            </span>
                          </div>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className={`w-5 h-5 ${style.iconColor} mr-2`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="text-gray-600">Plan Period: </span>
                            <span className="font-medium">
                              {plan.plan_period} months
                            </span>
                          </div>
                        </li>
                        {plan.ROI_day > 0 && (
                          <li className="flex items-center">
                            <svg
                              className={`w-5 h-5 ${style.iconColor} mr-2`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <span className="text-gray-600">
                                Potential Earnings:{" "}
                              </span>
                              <span className="font-medium text-green-600">
                                ${calculateEarnings()}
                              </span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="p-6 pt-0">
                      <button
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${style.buttonColor} shadow-md`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {modalopen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deletePlan}
          id={deleteID}
        />
      )}
    </>
  );
}