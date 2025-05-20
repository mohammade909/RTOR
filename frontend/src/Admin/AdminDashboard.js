import { useState, useEffect } from "react";

import { getAllUsers, getUser } from "../redux/userSlice";
import { getAllDeposite } from "../redux/depositeSlice";
import { ScaleIcon } from "@heroicons/react/24/outline";
import Loader from "../BaseFile/comman/Loader";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AdminSetting from "./AdminSetting";
import { getAllWithdrawal } from "../redux/withdrawalSlice";
import Connect from "../metamask/Connect";
import {
  Users,            // Total User
  UserCheck,        // Active Member
  UserX,            // Inactive Member
  DollarSign,       // Active Plan Income
  UserMinus,        // Block Member
  UserPlus2,        // Unblock Member
  Coins,
   Briefcase, 
    UserPlus, 
    Clock,
      Clock3, 
      Banknote,
        Wallet,  
         Hourglass,
        TimerReset
              // Rent Income
} from "lucide-react";
export default function AdminDashboard() {
  const { admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { allusers, loading, error, message } = useSelector(
    (state) => state.allusers
  );
  const { alldeposite } = useSelector((state) => state.alldeposite);
  const { allwithdrawal } = useSelector((state) => state.allwithdrawal);
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllDeposite());
    dispatch(getAllWithdrawal());
  }, [admin?.id]);
  let totalCount = allusers?.length;
  let activeCount = allusers?.filter(
    (user) => user?.is_active == "active"
  ).length;
  let blockCount = allusers?.filter((user) => user?.status == "block").length;
  let activePlanSum = allusers
    ?.filter((user) => user.is_active)
    .reduce((sum, user) => sum + user.active_plan, 0);
  let activePlanroi = allusers
    ?.filter((user) => user.is_active)
    .reduce((sum, user) => sum + user.roi_income, 0);
  let totalbusiness = allusers?.reduce(
  (sum, user) =>
    sum +
    (Number(user.active_plan) || 0) +
    (Number(user.roi_income) || 0) +
    (Number(user.level_month) || 0) +
    (Number(user.reward) || 0) +
    (Number(user.direct_income) || 0) +
    (Number(user.salary) || 0),
  0
).toFixed(2);

  let inactiveCount = totalCount - activeCount;
  let unblockCount = totalCount - blockCount;

  const today = new Date().toISOString().slice(0, 10);

  // Filter users who joined today
  let joinedTodayCount = allusers?.filter((user) => {
    const createdAtDate = user?.created_at?.slice(0, 10); // Extract YYYY-MM-DD from created_at
    return createdAtDate === today;
  }).length;

  let pendingDepositsCount = alldeposite?.filter(
    (deposit) => deposit.status === "pending"
  ).length;
  let pendingaWithdrawalCount = allwithdrawal?.filter(
    (wd) => wd.status === "pending"
  ).length;

  let TotalDepositsAmount = alldeposite
    ?.filter(
      (deposit) =>
        deposit.status === "complete" || deposit.status === "TRN-ADM002"
    )
    .reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

  let TotalWithdrawalAmount = allwithdrawal
    ?.filter((wd) => wd.status === "complete" || wd.status === "TRN-ADM002")
    .reduce((sum, wd) => sum + (wd.amount || 0) + (wd.deduction || 0), 0);

  let TotalPendingDepositsAmount = alldeposite
    ?.filter((deposit) => deposit.status === "pending")
    .reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

  let TotalPendingWithdrawalAmount = allwithdrawal
    ?.filter((wd) => wd.status === "pending")
    .reduce((sum, wd) => sum + (wd.amount || 0) + (wd.deduction || 0), 0);

const cards = [
  {
    name: "Total User",
    to: "/admin/user/all",
    icon: Users,
    amount: totalCount,
    bgColor: "bg-blue-500",
    iconBgColor: "bg-blue-700",
    gredient: "bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg ",
    percentage: "76",
  },
  {
    name: "Active Member",
    to: "/admin/user/active",
    icon: UserCheck,
    amount: activeCount,
    bgColor: "bg-green-500",
    iconBgColor: "bg-green-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-blue-700 shadow-lg ",
    percentage: "36",
  },
  {
    name: "Inactive Member",
    to: "/admin/user/inactive",
    icon: UserX,
    amount: inactiveCount,
    bgColor: "bg-red-500",
    iconBgColor: "bg-red-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-red-700 shadow-lg ",
    percentage: "98",
  },
  {
    name: "Active Plan Income",
    to: "/admin/dashboard",
    icon: DollarSign,
    amount: `$${activePlanSum}`,
    bgColor: "bg-yellow-500",
    iconBgColor: "bg-yellow-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
    percentage: "76",
  },
  {
    name: "Block Member",
    to: "/admin/user/block",
    icon: UserMinus,
    amount: blockCount,
    bgColor: "bg-purple-500",
    iconBgColor: "bg-purple-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
    percentage: "69",
  },
  {
    name: "Unblock Member",
    to: "/admin/user/unblock",
    icon: UserPlus2,
    amount: unblockCount,
    bgColor: "bg-indigo-500",
    iconBgColor: "bg-indigo-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
    percentage: "66",
  },
  {
    name: "Rent Income",
    to: "/admin/user/unblock",
    icon: Coins,
    amount: activePlanroi,
    bgColor: "bg-green-500",
    iconBgColor: "bg-green-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
    percentage: "66",
  },
];


const cards2 = [
  {
    name: "Total Income",
    to: "/admin/income",
    icon: Briefcase,
    amount: "$" + totalbusiness,
    bgColor: "bg-indigo-500",
    iconBgColor: "bg-indigo-700",
    gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
  },
  {
    name: "Today Join",
    to: "/admin/user/all",
    icon: UserPlus,
    amount: joinedTodayCount,
    bgColor: "bg-blue-500",
    iconBgColor: "bg-blue-700",
    gredient: "bg-gradient-to-r from-blue-800 to-purple-900 shadow-lg ",
  },
  {
    name: "Pending Deposite",
    to: "/admin/deposite",
    icon: Clock,
    amount: pendingDepositsCount,
    bgColor: "bg-purple-500",
    iconBgColor: "bg-purple-700",
    gredient: "bg-gradient-to-r from-pink-800 to-teal-700 shadow-lg ",
  },
  {
    name: "Pending Withdrawal",
    to: "/admin/pendingwithdrawalrequest",
    icon: Clock3,
    amount: pendingaWithdrawalCount,
    bgColor: "bg-red-500",
    iconBgColor: "bg-red-700",
    iconColor: "text-blue-500",
    percentage: "66",
    gredient: "bg-gradient-to-r from-indigo-900 to-green-700 shadow-lg ",
  },
  {
    name: "Total Deposite",
    to: "/admin/deposite",
    icon: Banknote,
    amount: TotalDepositsAmount,
    bgColor: "bg-purple-500",
    iconBgColor: "bg-purple-700",
    iconColor: "text-blue-500",
    percentage: "66",
    gredient: "bg-gradient-to-r from-black to-pink-700 shadow-lg ",
  },
  {
    name: "Total Withdrawal",
    to: "/admin/pendingwithdrawalrequest",
    icon: Wallet,
    amount: TotalWithdrawalAmount?.toFixed(2),
    bgColor: "bg-red-500",
    iconBgColor: "bg-red-700",
    iconColor: "text-blue-500",
    percentage: "66",
    gredient: "bg-gradient-to-r from-amber-700 to-purple-700 shadow-lg ",
  },
  {
    name: "Pending Deposite",
    to: "/admin/deposite/pending",
    icon: Hourglass,
    amount: TotalPendingDepositsAmount,
    bgColor: "bg-purple-500",
    iconBgColor: "bg-purple-700",
    iconColor: "text-blue-500",
    percentage: "66",
    gredient: "bg-gradient-to-r from-orange-600 to-purple-700 shadow-lg ",
  },
  {
    name: "Pending Withdrawal",
    to: "/admin/pendingwithdrawalrequest/pending",
    icon: TimerReset,
    amount: TotalPendingWithdrawalAmount?.toFixed(2),
    bgColor: "bg-red-500",
    iconBgColor: "bg-red-700",
    iconColor: "text-blue-500",
    percentage: "66",
    gredient: "bg-gradient-to-r from-pink-800 to-red-700 shadow-lg ",
  },
];

  return (
    <>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Background gradient */}
        {/* <div className="absolute inset-0 bg-white "></div> */}

        <Loader isLoading={loading} />

        <div className="relative z-10 flex flex-col flex-1">
          <main className="flex-1 pb-8">
            <div className="mt-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Cards Section */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {cards.map((item, i) => (
                      <div
                        key={i}
                        className={`relative ${item.bgColor} rounded-md shadow-sm border border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]`}
                      >
                        <div className="flex items-center justify-between p-5">
                          <div
                            className={`flex items-center justify-center h-12 w-12 rounded-lg ${item.iconBgColor} shadow-sm`}
                          >
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-200 font-medium">
                              {item.name}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-100">
                              {item.amount}
                            </h2>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                          <p
                            className={`text-sm font-medium flex items-center ${
                              item.percentage.includes("+")
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {item.percentage.includes("+") ? (
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                                ></path>
                              </svg>
                            )}
                            {item.percentage} vs last month
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Divider */}
                <div className="my-6 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Other Information Section */}
                <section className="">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Other Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cards2?.map((card, i) => (
                      <div
                        key={i}
                        className={`relative ${card.bgColor} rounded-md shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]`}
                      >
                        {/* Gradient overlay */}
                        {/* <div
                          className={`absolute inset-0 opacity-10 ${card.iconBgColor}`}
                        ></div> */}

                        {/* Card content */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`flex items-center justify-center h-10 w-10 rounded-lg  ${card.iconBgColor} shadow-sm`}
                            >
                              <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-200 font-medium">
                                {card.name}
                              </p>
                              <h2 className="text-base font-semibold text-gray-100">
                                {card.amount}
                              </h2>
                            </div>
                          </div>

                          {/* View all link */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Link
                              to={card.to}
                              className={`text-sm font-medium flex items-center text-white`}
                            >
                              View all
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                ></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                {/* Divider */}
                <div className="my-10 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Admin Settings Section */}

                <AdminSetting />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
