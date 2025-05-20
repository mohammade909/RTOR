import React, { useState, useEffect } from "react";
import TradingCard from "./TradingCard";
import CryptoTracker from "./CryptoTracker";
import Profile from "./Profile";
import UserStats from "./UserStats";
import ModernStats from "./ModernStats";
import RewardsInitializationPopup from "./RewardInitilizing";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";
import UserTransaction from "./UserTransaction";
import Loader from "../BaseFile/comman/Loader";
import { getTreeData } from "../redux/referralSlice";
import { getAllDepositeByid } from "../redux/depositeSlice";
import { getAllWithdrawalByid } from "../redux/withdrawalSlice";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  User,
  BarChart2,
  DollarSign,
  Percent,
  Shield,
  Activity,
  Check,
  Copy,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import HotelRoomSlider from "./HotelRoomSlider";
import TradeNow from "./TradeNow";
function getActiveSinceInfo(createdAt) {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const options = { year: "numeric", month: "long" };
  const formattedDate = createdDate.toLocaleDateString("en-US", options);
  let months =
    (today.getFullYear() - createdDate.getFullYear()) * 12 +
    (today.getMonth() - createdDate.getMonth());
  months = months <= 0 ? 0 : months;

  return {
    formattedDate,
    monthsActive: months,
    displayText: `Active Since\n${formattedDate}\n${months} months`,
  };
}
export default function Dashboard() {
  const dispatch = useDispatch();
  const [activeTimeframe, setActiveTimeframe] = useState("3M");
  const [activeTab, setActiveTab] = useState("today");
  const { singlecto } = useSelector((state) => state.cto);
  const { singleDeposite } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { treeData } = useSelector((state) => state.referralTree);
  const [topGenerations, setTopGenerations] = useState([]);
  const [totalBusiness, setTotalBusiness] = useState();
  const { auth } = useSelector((state) => state.auth);
  const { singleuser, loading } = useSelector((state) => state.allusers);
  const [isCopied, setIsCopied] = useState(false);
  const chartData = [20, 45, 28, 80, 99, 43, 50, 65, 35, 88, 70, 81];
  const maxValue = Math.max(...chartData);
  const registerUrl = `https://www.r2rgloble.com/registration?referral=${singleuser?.refferal_code}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(registerUrl)
      .then(() => {
        alert("Referral link copied to clipboard!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy referral link: ", err);
      });
  };
  const limit = singleuser?.active_plan * 5;
  const usedLimit = (
    (singleuser?.roi_income ?? 0) +
    (singleuser?.level_month ?? 0) +
    Number(singleuser?.community_income) +
    (singleuser?.reward ?? 0) +
    Number(singleuser?.direct_income) +
    (singleuser?.total_salary ?? 0)
  ).toFixed(2);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getUser(auth?.id));
    }
  }, [auth?.id]);

  useEffect(() => {
    dispatch(getAllDepositeByid(singleuser?.id));
    dispatch(getAllWithdrawalByid(singleuser?.id));
    dispatch(getTreeData(singleuser?.refferal_code));
  }, [singleuser?.id]);

  const totalEarning = (
    (singleuser?.level_month ?? 0) +
    (singleuser?.roi_income ?? 0) +
    (singleuser?.reward ?? 0) +
    Number(singleuser?.direct_income) +
    (singleuser?.total_salary ?? 0)
  ).toFixed(2);

  function countTotalTeamWithActiveInactive(singleuser) {
    let totalTeam = 0;
    let activeCount = 0;
    let inactiveCount = 0;
    const stack = [singleuser];

    while (stack.length > 0) {
      const currentUser = stack.pop();
      totalTeam += 1;

      if (currentUser.is_active === "active") {
        activeCount += 1;
      } else if (currentUser.is_active === "inactive") {
        inactiveCount += 1;
      }
      if (currentUser.referrals && currentUser.referrals.length > 0) {
        stack.push(...currentUser.referrals);
      }
    }

    return { totalTeam, activeCount, inactiveCount };
  }

  const totalDirectActiveMembers = treeData?.filter(
    (user) => user.is_active === "active"
  ).length;
  const totalDirectInactiveMembers = treeData?.filter(
    (user) => user.is_active === "inactive"
  ).length;

  let totalTeamCount = 0;
  let totalActiveMembers = 0;
  let totalInactiveMembers = 0;

  treeData?.forEach((user) => {
    const { totalTeam, activeCount, inactiveCount } =
      countTotalTeamWithActiveInactive(user);
    totalTeamCount += totalTeam;
    totalActiveMembers += activeCount;
    totalInactiveMembers += inactiveCount;
  });

  const calculateBusinessForTeam = (user) => {
    let totalBusiness = user.active_plan || 0;

    if (user.referrals && user.referrals.length > 0) {
      user.referrals.forEach((referral) => {
        totalBusiness += calculateBusinessForTeam(referral); // Recursively calculate for all referrals
      });
    }

    return totalBusiness;
  };
  useEffect(() => {
    if (treeData) {
      const businessByLeg = calculateBusinessForLegs(treeData);
      const sortedLegs = Object.entries(businessByLeg)
        .map(([legId, totalBusiness]) => ({
          legId: parseInt(legId),
          totalBusiness,
        }))
        .sort((a, b) => b.totalBusiness - a.totalBusiness);
      const topTwoLegs = sortedLegs.slice(0, 2);
      const totalBusiness = Object.values(businessByLeg).reduce(
        (acc, value) => acc + value,
        0
      );
      const thirdLegTotalBusiness = sortedLegs
        .slice(2)
        .reduce((acc, leg) => acc + leg.totalBusiness, 0);
      const topGenerations = [
        ...topTwoLegs,
        { legId: "Other", totalBusiness: thirdLegTotalBusiness },
      ];
      setTopGenerations(topGenerations);
      setTotalBusiness(totalBusiness);
    }
  }, [treeData]);

  const calculateBusinessForLegs = (users) => {
    const result = {};

    users?.forEach((user) => {
      result[user.id] = calculateTeamBusiness(user);
    });

    return result;
  };

  const calculateTeamBusiness = (user) => {
    let totalBusiness = user.active_plan || 0;

    if (user.referrals && user.referrals.length > 0) {
      user.referrals.forEach((referral) => {
        totalBusiness += calculateTeamBusiness(referral);
      });
    }

    return totalBusiness;
  };

  let combinedArray = [];
  const depositsWithType =
    singleDeposite?.map((deposit) => ({ ...deposit, type: "deposit" })) || [];
  const withdrawalsWithType =
    singleWithdrawal?.map((withdrawal) => ({
      ...withdrawal,
      type: "withdrawal",
    })) || [];
  if (withdrawalsWithType.length > 0) {
    combinedArray = [...depositsWithType, ...withdrawalsWithType];
    combinedArray.sort((a, b) => new Date(a.createdAT) - new Date(b.createdAT));
  }
  const totalDeposits = depositsWithType?.reduce(
    (total, deposit) => total + (deposit.amount || 0),
    0
  );
  const totalWithdrawals = withdrawalsWithType?.reduce(
    (total, withdrawal) =>
      total + (withdrawal.amount || 0) + (withdrawal.deduction || 0),
    0
  );

  return (
    <div className=" ">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-orange-400 rounded-md p-4 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div className="bg-white/20 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                +22%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium"> Total Income</p>
              <p className="text-2xl font-bold">
                {" "}
                ${Number(totalEarning).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Sales Return Card */}
          <div className="bg-blue-900 rounded-md p-4 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div className="bg-white/20 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <div className="px-2 py-1 bg-red-500/80 rounded-full text-xs font-medium">
                -22%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium"> Direct Income</p>
              <p className="text-2xl font-bold">
                ${Number(singleuser?.direct_income).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Purchase Card */}
          <div className="bg-emerald-500 rounded-md p-4 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div className="bg-white/20 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                +22%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium"> Level Income</p>
              <p className="text-2xl font-bold">
                {" "}
                ${Number(singleuser?.level_month).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Purchase Return Card */}
          <div className="bg-blue-500 rounded-md p-4 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div className="bg-white/20 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </div>
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                +22%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium"> Community Bonus</p>
              <p className="text-2xl font-bold">
                {" "}
                ${Number(singleuser?.community_income)}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Profit Card */}
          <div className="bg-white rounded-md border border-gray-300 p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  ${Number(totalBusiness).toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  Total Business
                </p>
              </div>
              <div className="bg-cyan-50 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-cyan-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-emerald-600">
                +35% vs Last Month
              </p>
              <p className="text-sm font-medium text-blue-600">View All</p>
            </div>
          </div>
          {/* Invoice Due Card */}
          <div className="bg-white rounded-md border   border-gray-300 p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {" "}
                  ${Number(singleuser?.reward).toLocaleString()}
                </p>
                <p className="text-sm text-orange-500 font-medium">
                  {" "}
                  Reward Income{" "}
                </p>
              </div>
              <div className="bg-cyan-50 p-2 rounded-md ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-cyan-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-emerald-600">
                +35% vs Last Month
              </p>
              <p className="text-sm font-medium text-blue-600">View All</p>
            </div>
          </div>
          {/* Total Expenses Card */}
          <div className="bg-white rounded-md p-4  border border-gray-300 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  ${Number(totalWithdrawals).toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  {" "}
                  Total Withdrawal
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-emerald-600">
                +41% vs Last Month
              </p>
              <p className="text-sm font-medium text-blue-600">View All</p>
            </div>
          </div>
          {/* Total Payment Returns Card */}
          <div className="bg-white rounded-md p-4 shadow-md  border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  ${Number(totalDeposits).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {" "}
                  Total Deposit
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-purple-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-red-500">
                -20% vs Last Month
              </p>
              <p className="text-sm font-medium text-blue-600">View All</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Loader isLoading={loading} />
      </div>
      <RewardsInitializationPopup />
      <div className="mt-4">
        <div className="lg:flex gap-5 bg-gray-50">
          <div className="bg-white rounded-md border border-gray-300 shadow-sm p-5 lg:w-3/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <ShoppingCart size={20} className="text-orange-500" />
                </div>
                <span className="font-semibold text-gray-800">
                  Popular Rooms
                </span>
              </div>
           <TradeNow/>
            </div>
            <div className="flex gap-4 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 w-1/2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {" "}
                    Inactive Members
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {Number(totalDirectInactiveMembers).toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 w-1/2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Active Members</span>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {Number(totalActiveMembers).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 w-1/2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-pink-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Remaining Limit</span>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  ${Number(limit - usedLimit).toLocaleString()}
                </div>
              </div>
            </div>
            <div className=" overflow-hidden">
              <HotelRoomSlider />
            </div>
          </div>
          <div className="lg:w-2/5 flex flex-col  gap-4">
            <div className="bg-white rounded-md border border-gray-300 shadow-sm p-5 text-gray-800">
              <div className="flex items-center gap-2 mb-5">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-500 flex justify-center items-center">
                  <span className="font-bold">ⓘ</span>
                </div>
                <span className="font-semibold text-gray-800">
                  Overall Information
                </span>
              </div>

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center">
                  <div className="text-blue-500 mb-1">
                    <Users size={22} />
                  </div>
                  <span className="text-sm text-gray-600"> Rent Income</span>
                  <div className="font-bold">
                    {" "}
                    +{Number(singleuser?.roi_income).toLocaleString()}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center">
                  <div className="text-orange-500 mb-1">
                    <Users size={22} />
                  </div>
                  <span className="text-sm text-gray-600"> Active Plan</span>
                  <div className="font-bold">
                    {" "}
                    {Number(singleuser?.active_plan).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md border border-gray-200 shadow-md p-0 overflow-hidden flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-24 relative" />
              <div className="px-6 pb-6 pt-0 relative">
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <div className="h-full w-full rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={48} className="text-blue-600" />
                  </div>
                </div>
                <div className="pt-16 pl-6">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {singleuser?.fullname || "Satish"}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {singleuser?.email || "satish@gmail.com"}
                  </p>
                  {singleuser?.active_plan > 0 && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs text-white font-medium shadow-sm">
                        Pro Trader
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="  col-span-12 lg:col-span-5 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="font-semibold text-gray-800">
              Customers Overview
            </span>
            <div className="flex items-center text-sm">
              <span className="mr-1">Today</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex justify-center  p-4 ">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="white"
                  stroke="#eee"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#36B37E"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="198.5"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="63"
                  transform="rotate(80 50 50)"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 text-center mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {singleuser?.reffer_by}
              </div>
              <div className="text-orange-500">Reffer By</div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                {getActiveSinceInfo(singleuser?.created_at).monthsActive}
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-gray-800">
                {" "}
                {singleuser?.bep20?.substring(0, 10)}...
                {singleuser?.bep20?.substring(singleuser?.bep20?.length - 8)}
              </div>
              <div className="text-teal-500">Web3 Address</div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                ↑ 21%
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Your Referral Code
              </h2>
            </div>

            <div className="p-4">
              <p className="text-gray-500 mb-3 text-sm">
                Share your code and earn rewards instantly
              </p>
              <div className="flex  items-center rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 overflow-hidden">
                <div className="flex-1 px-5 py-4 text-gray-900 font-mono font-semibold text-base truncate">
                  {singleuser?.refferal_code || "Loading..."}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-5 py-4 flex items-center justify-center"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {isCopied && (
                <div className="flex items-center text-green-600 text-sm mt-3 animate-fade-in">
                  <Check size={16} className="mr-1" /> Copied to clipboard!
                </div>
              )}
              <div className="mt-4 flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m2-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
                  />
                </svg>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Invite friends to join and you’ll both get bonus trading
                  credits. Use your referral code above to start earning!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <aside className="w-full  overflow-y-auto rounded-md ">
          <div className="">
            <div className="flow-root mt-1">
              <div className="overflow-x-auto ">
                <div className="inline-block min-w-full py-2 align-middle">
                  <UserTransaction />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
