import React from "react";

import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { FiLink2 } from "react-icons/fi";
import { FiCheck, FiCopy } from "react-icons/fi";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import UserTransaction from "./UserTransaction";
import { getTreeData } from "../redux/referralSlice";
import { getctoListByid } from "../redux/ctoSlice";
import { getUser } from "../redux/userSlice";
import { getAllDepositeByid } from "../redux/depositeSlice";
import { getAllWithdrawalByid } from "../redux/withdrawalSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import Loader from "../BaseFile/comman/Loader";

import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Check,
  Copy,
  Share2,
  Gift,
  Star,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  Globe,
  Calendar,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import RewardsInitializationPopup from "./RewardInitilizing";
import Tradechart from "./Tradechart";
import TradeNow from "./TradeNow";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singleuser } = useSelector((state) => state.allusers);
  const { singlecto } = useSelector((state) => state.cto);
  const { singleDeposite } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { loading, treeData } = useSelector((state) => state.referralTree);
  const [topGenerations, setTopGenerations] = useState([]);
  const [totalBusiness, setTotalBusiness] = useState();
  const [isCopied, setIsCopied] = useState(false);
  const thresholds = [2500, 7500, 17500, 37500, 87500, 187500, 387500, 887500];
  const [isHovered, setIsHovered] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    dispatch(getUser(auth?.id));
    dispatch(getAllDepositeByid(auth?.id));
    dispatch(getAllWithdrawalByid(auth?.id));
    dispatch(getTreeData(auth?.refferal_code));
  }, [auth?.id]);

  useEffect(() => {
    if (singleuser?.cto == "true") {
      dispatch(getctoListByid(auth?.id));
    }
  }, [singleuser, auth?.id]);

  const referralCode = singleuser?.refferal_code;
  let registerUrl;
  registerUrl = `https://www.goldfoxmarket.com/registration?referral=${referralCode}`;

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

      // Extract and sort legs by total business
      const sortedLegs = Object.entries(businessByLeg)
        .map(([legId, totalBusiness]) => ({
          legId: parseInt(legId),
          totalBusiness,
        }))
        .sort((a, b) => b.totalBusiness - a.totalBusiness);

      // Determine the top two legs
      const topTwoLegs = sortedLegs.slice(0, 2);

      // Sum up the total business of all legs
      const totalBusiness = Object.values(businessByLeg).reduce(
        (acc, value) => acc + value,
        0
      );

      // Calculate the third leg as the sum of all other legs
      const thirdLegTotalBusiness = sortedLegs
        .slice(2)
        .reduce((acc, leg) => acc + leg.totalBusiness, 0);

      // Combine top two legs and the third leg
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const weeklyData = {
    total: [80, 90, 70, 80, 110, 150, 120],
    thisYear: [70, 85, 60, 250, 100, 145, 110],
    lastYear: [60, 75, 80, 200, 130, 130, 90],
  };

  const statCards = [
    {
      title: "Total Expenses",
      value: "$134,032",
      change: "0.45%",
      trend: "up",
      chartColor: "bg-blue-500",
    },
    {
      title: "General Leads",
      value: "74,354",
      change: "3.84%",
      trend: "down",
      chartColor: "bg-pink-500",
    },
    {
      title: "Churn Rate",
      value: "6.02%",
      change: "0.72%",
      trend: "up",
      chartColor: "bg-pink-500",
    },
    {
      title: "New Users",
      value: "7,893",
      change: "11.05%",
      trend: "up",
      chartColor: "bg-orange-300",
    },
    {
      title: "Returning Users",
      value: "3,258",
      change: "1.69%",
      trend: "up",
      chartColor: "bg-purple-500",
    },
  ];

  // Generate mini-chart points
  const generateChartPoints = (length = 10) => {
    let points = [];
    let height = 20;

    for (let i = 0; i < length; i++) {
      points.push(10 + Math.random() * height);
    }

    return points;
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const cardData = [
    {
      description: "Total Referral",
      value: `${totalDirectActiveMembers + totalDirectInactiveMembers} Member`,
      icon: CursorArrowRaysIcon,
      bgColor: "bg-purple-300",
      percentage: "+22%",
      iconColor: "text-purple-500",
      href: "/user/directmember",
      percentage: "80",
      change: "0.78%",
      trend: "up",
      chartColor: "bg-pink-500",
      gredient: "bg-gradient-to-r from-[#182a91] to-[#751bc0] shadow-lg ",
    },
    // {
    //   id: 3,
    //   value: `$ ${singleuser?.roi_income}`,
    //   description: "ROI",
    //   borderColor: "border-green-100 ",
    //   icon: CursorArrowRaysIcon,
    //   bgColor: "bg-green-500",
    //   iconBgColor: "bg-green-400",
    //   gredient: "border-t bg-gradient-to-r from-green-900 to-gray-900",
    //   percentage: "25",
    //   href: "/user/transaction/roi_transaction/Invest",
    //   change: "3.84%",
    //   trend: "up",
    //   chartColor: "bg-pink-500",
    // },
    {
      description: "Active Sponser",
      initials: "AS",
      value: `${totalDirectActiveMembers} Member`,
      bgColor: "bg-blue-600",
      iconColor: "text-blue-500",
      percentage: "66",
      icon: CursorArrowRaysIcon,
      href: "/user/plan",
      percentage: "75",
      change: "0.72%",
      trend: "up",
      chartColor: "bg-orange-500",
      gredient: "bg-gradient-to-r from-[#182a91] to-blue-700 shadow-lg ",
    },
    {
      id: 4,
      description: "Inactive Sponser",
      value: `${totalDirectInactiveMembers} Member`,
      upadtePlan: "Need Support",
      borderColor: "border-red-800 ",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-red-500",
      iconBgColor: "bg-red-300",
      gredient: " border-t bg-gradient-to-r from-gray-900 to-red-900",
      percentage: "55",
      change: "0.72%",
      trend: "up",
      chartColor: "bg-pink-500",
    },
    {
      id: 5,

      description: "Reward Rank",
      value: `${singleuser?.reward_level} Level`,
      // value: `$ ${singleuser?.reward}`,
      // description: "Reward",
      upadtePlan: "Add More",
      borderColor: "border-yellow-500 ",
      percentage: "25",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-yellow-500",
      iconBgColor: "bg-yellow-300",
      gredient: "border-t bg-gradient-to-r from-yellow-900 to-gray-900",
      change: "11.05%",
      trend: "up",
      chartColor: "bg-orange-300",
    },
    {
      id: 1,
      name: "Total Team",
      description: "Total Team ",
      value: `${totalTeamCount} Member` || 0,
      icon: CursorArrowRaysIcon,
      iconColor: "text-indigo-500",
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-indigo-800",
      percentage: 55,
      percentage: "85",
      change: "0.98%",
      trend: "up",
      chartColor: "bg-orange-500",
      gredient:
        "bg-gradient-to-r from-indigo-900 to-gray-900 shadow-lg shadow-indigo-500/50",
    },
    {
      id: 4,
      description: "Status",
      value: singleuser?.status || " - ",
      icon: ClipboardDocumentIcon,
      iconColor: "text-orange-500",
      change: "1.2%",
      changeType: "increase",
      bgColor: "bg-orange-800",
      percentage: "71",
      change: "0.64%",
      trend: "up",
      chartColor: "bg-pink-500",
      percentage: 29,
      gredient:
        "bg-gradient-to-r from-orange-900 to-gray-900 shadow-lg shadow-red-500/50",
    },
    {
      id: 5,
      description: "Active Team",
      value: `${totalActiveMembers} Member`,
      icon: UsersIcon,
      iconColor: "text-green-500",
      change: "122",
      changeType: "increase",
      bgColor: "bg-green-800",
      percentage: 20,
      percentage: "55",
      change: "0.72%",
      trend: "up",
      chartColor: "bg-orange-500",
      gredient:
        "bg-gradient-to-r from-green-900 to-gray-900 shadow-lg shadow-green-500/50",
    },
    {
      id: 6,
      description: "Inactive Team",
      value: `${totalInactiveMembers} Member` || "0",
      icon: EnvelopeOpenIcon,
      iconColor: "text-blue-500",
      change: "5.4%",
      changeType: "increase",
      percentage: 51,
      bgColor: "bg-pink-800",
      percentage: "95",
      change: "0.52%",
      trend: "up",
      chartColor: "bg-pink-500",
      gredient:
        "bg-gradient-to-r from-gray-900 to-blue-900 shadow-lg shadow-blue-500/50",
    },
  ];
  // const cardDetails = [
  // {
  //   id: 7,
  //   value: `$ ${totalWithdrawals}`,
  //   description: "Total Withdrawal",
  //   upadtePlan: "Copy Link",
  //   percentage: "20",
  //   borderColor: "border-indigo-500 ",
  //   icon: CursorArrowRaysIcon,
  //   bgColor: "bg-indigo-500",
  //   iconBgColor: "bg-indigo-700",
  //   gredient: "border-t bg-gradient-to-r from-indigo-900 to-gray-900",
  // },

  // {
  //   id: 8,
  //   value: `$${totalBusiness}`,
  //   description: "Total Business",
  //   percentage: "75",
  //   borderColor: "border-purple-200 ",
  //   icon: CursorArrowRaysIcon,
  //   bgColor: "bg-[#f472b6]",
  //   iconBgColor: "bg-purple-700",
  //   gredient: "border-t bg-gradient-to-r from-purple-900 to-gray-900",
  // },
  // {
  //   id: 8,
  //   value: `$${singleuser?.reward}`,
  //   description: "Reward",
  //   percentage: "75",
  //   borderColor: "border-purple-500 ",
  //   icon: CursorArrowRaysIcon,
  //   bgColor: "bg-[#fca5a5]",
  //   iconBgColor: "bg-purple-700",
  //   gredient: "border-t bg-gradient-to-r from-purple-900 to-gray-900",
  // },
  // {
  //   id: 9,
  //   value: `${
  //     topGenerations?.[0]?.totalBusiness
  //       ? "$" + topGenerations?.[0]?.totalBusiness
  //       : 0
  //   }`,
  //   description: "Team A",
  //   percentage: "10",
  //   // upadtePlan: "Copy Link",
  //   icon: CursorArrowRaysIcon,
  //   borderColor: "border-orange-500 ",
  //   bgColor: "bg-orange-500",
  //   iconBgColor: "bg-orange-700",
  //   gredient: "border-t bg-gradient-to-r from-orange-900 to-gray-900",
  // },
  // {
  //   id: "10",
  //   value: `${
  //     topGenerations?.[1]?.totalBusiness
  //       ? "$" + topGenerations?.[1]?.totalBusiness
  //       : 0
  //   }`,
  //   description: "Team B",
  //   percentage: "13",
  //   // upadtePlan: "Copy Link",
  //   icon: CursorArrowRaysIcon,
  //   bgColor: "bg-sky-500",
  //   iconBgColor: "bg-sky-700",
  //   borderColor: "border-sky-500 ",
  //   gredient: "border-t bg-gradient-to-r from-sky-900 to-gray-900",
  // },
  // {
  //   id: 11,
  //   value: `${
  //     topGenerations?.[2]?.totalBusiness
  //       ? "$" + topGenerations?.[2]?.totalBusiness
  //       : 0
  //   } Business`,
  //   description: "Team Others",
  //   percentage: "48",
  //   icon: CursorArrowRaysIcon,
  //   bgColor: "bg-amber-500",
  //   borderColor: "border-amber-500 ",
  //   iconColor: "text-amber-500",
  //   gredient: "bg-gradient-to-r from-amber-900 to-gray-900",
  // },
  //   {
  //     id: 7,
  //     value: `${totalInactiveMembers} Member`,
  //     description: "Salary Income ",
  //     icon: ClipboardDocumentIcon,
  //     iconColor: "text-white",
  //     change: "5.4%",
  //     changeType: "increase",
  //     percentage: 51,
  //     bgColor: "bg-blue-500",
  //     gredient:
  //       "bg-gradient-to-r from-gray-900 to-blue-900 shadow-lg shadow-blue-500/50",
  //   },
  // ];

  const stat = [
    {
      id: 1,
      members: `$ ${singleuser?.direct_income}`,
      name: "Referral Income",
      borderColor: "border-green-100 ",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-green-500",
      iconBgColor: "bg-green-400",
      gredient: "border-t bg-gradient-to-r from-green-900 to-gray-900",
      percentage: "25",
      href: "/user/directmember",
      change: "0.45%",
      trend: "up",
      chartColor: "bg-blue-500",
    },
    {
      members: `$ ${singleuser?.level_month}` || 0,
      name: "Level Commission",

      initials: "IS",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-red-900",
      iconColor: "text-red-500",
      percentage: "99",
      href: "/user/transaction/invest_level_transaction/invest",
      gredient: "bg-gradient-to-r from-[#182a91] to-red-700 shadow-lg ",
    },

    {
      members: `$ ${totalWithdrawals}`,
      name: "Total Profit",
      href: "/user/addwithdrawal",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-green-900",
      iconColor: "text-green-500",
      percentage: "+3%",
      gredient: "bg-gradient-to-r from-[#182a91] to-green-700 shadow-lg ",
    },
    {
      id: 1,
      members: `$ ${singleuser?.active_plan}`,
      name: "Total Investment",
      borderColor: "border-blue-200 ",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-blue-500",
      iconBgColor: "bg-blue-400",
      gredient: "border-t bg-gradient-to-r from-gray-900 to-blue-900",
      percentage: "45",
      href: "/user/plan",
      change: "3.84%",
      trend: "up",
      chartColor: "bg-pink-500",
    },
  ];

  const incomedetail = [
    {
      id: 1,
      name: "Total Business",
      stat: `$${singleuser?.active_plan}`,
      description: "Total Business ",
      icon: CursorArrowRaysIcon,
      iconColor: "text-indigo-500",
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-indigo-800",
      percentage: 55,
      gredient:
        "bg-gradient-to-r from-indigo-900 to-gray-900 shadow-lg shadow-indigo-500/50",
    },
    {
      id: 2,
      name: "Reward",
      stat: `$${singleuser?.reward}`,
      description: "Salary Income ",
      icon: CursorArrowRaysIcon,
      iconColor: "text-indigo-500",
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-indigo-800",
      percentage: 55,
      gredient:
        "bg-gradient-to-r from-indigo-900 to-gray-900 shadow-lg shadow-indigo-500/50",
    },
    {
      id: 3,
      name: "Salary Income",
      stat: `$${singleuser?.salary}`,
      description: "Salary Income ",
      icon: CursorArrowRaysIcon,
      iconColor: "text-indigo-500",
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-indigo-800",
      percentage: 55,
      gredient:
        "bg-gradient-to-r from-indigo-900 to-gray-900 shadow-lg shadow-indigo-500/50",
    },
    {
      id: 6,
      stat:
        `$ ${(
          singleuser?.level_month +
          singleuser?.roi_income +
          singleuser?.direct_income +
          singleuser?.reward
        ).toFixed(2)}` || " - ",
      name: "Total Earning",
      title: "Total Earning",
      upadtePlan: "Add More",
      borderColor: "border-pink-500 ",
      percentage: "21",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-pink-500",
      iconBgColor: "bg-pink-700",
      href: "",
      gredient: "border-t bg-gradient-to-r from-pink-900 to-gray-900",
      change: "1.69%",
      trend: "up",
      chartColor: "bg-purple-500",
    },

    {
      id: 2,
      name: "Referral Code",
      title: "Referral Code",
      stat: singleuser?.refferal_code,
      icon: ClipboardDocumentIcon,
      iconColor: "text-red-500",
      change: "1.2%",
      changeType: "increase",
      percentage: 50,
      bgColor: "bg-red-800",
      gredient:
        "bg-gradient-to-r from-red-900 to-gray-900 shadow-lg shadow-red-500/50",
    },

    {
      id: 3,
      name: "Reffer By",
      title: "Referral Code",
      stat: singleuser?.reffer_by || " - ",
      icon: CursorArrowRaysIcon,
      iconColor: "text-yellow-500",
      change: "3.2%",
      changeType: "decrease",
      percentage: 24,
      bgColor: "bg-yellow-800",
      gredient:
        "bg-gradient-to-r from-[#182a91] to-yellow-900 shadow-lg shadow-yellow-500/50",
    },
  ];

  console.log(singleuser);
  return (
    <>
      <Loader isLoading={loading} />
      <div className=" text-gray-900  relative z-10 ">
        <div className="absolute inset-0 z-5  opacity-30"></div>
        <div className=" sm:px-0  relative z-10  lg:max-w-7xl  ">
          <RewardsInitializationPopup />

          <div className="lg:hidden mb-4  relative w-full lg:col-span-4 col-span-12  overflow-hidden rounded-lg bg-black border border-white/20 text-white">
            <div className="absolute inset-0 z-0">
              <img
                src="https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid&w=740"
                alt="Network background"
                fill
                className="object-cover opacity-70 h-full"
              />
            </div>
            <div className="relative z-10 p-6">
              <h1 className="text-2xl font-bold">Auto AI Trade</h1>
              <div className="mt-6 flex justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">Current</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-gray-300">End In</p>
                  <p className="text-lg font-medium"> Investment</p>
                </div>
              </div>
              <div className="w-40 text-xs ">
                <TradeNow userId={auth?.id} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-4 col-span-12 flex  overflow-hidden  justify-center items-center rounded-md bg-[#410f7b] shadow-2xl border border-gray-700">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full "
              >
                <div className="h-28 bg-gradient-to-r -top-4 from-teal-500/20 to-cyan-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-cyan-400"
                        style={{
                          width: `${Math.random() * 10 + 5}px`,
                          height: `${Math.random() * 10 + 5}px`,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5 + 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center -mt-12">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="ring-4 ring-cyan-500 rounded-full overflow-hidden h-24 w-24 bg-gray-100 shadow-lg"
                  >
                    <img
                      src="/ard.jpg"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="text-center mt-3">
                  <h2 className="text-2xl font-bold text-white">
                    {singleuser?.fullname}
                  </h2>
                </div>
                <div className="px-6 py-4 text-sm">
                  <motion.div
                    className="space-y-3 text-gray-200"
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-xs text-gray-400">Sponsor</p>
                        <p className="font-medium">BlackBitRock</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-xs text-gray-400">Mobile</p>
                        <p className="font-medium">{singleuser?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="font-medium">{singleuser?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-xs text-gray-400">Register Date</p>
                        <p className="font-medium">{singleuser?.created_at}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="px-6 py-3 bg-[#3b0777] -bottom-4 relative border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <button className="text-sm text-gray-200 hover:text-white transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-3 py-1 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-medium text-gray-900 hover:shadow-lg hover:from-cyan-600 hover:to-teal-600 transition-all">
                      View Dashboard
                    </button>
                  </div>
                </div>
              </motion.div>
              {/* <Tradechart/> */}
            </div>
            <div className="lg:col-span-8 col-span-12">
              <div className="grid lg:grid-cols-4 sm:grid-cols-2  grid-cols-1 gap-4  ">
                {stat.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative bg-white border shadow-sm border-gray-300 overflow-hidden group rounded-md transition-all duration-300 ${
                      isHovered === index ? "scale-105" : "scale-100"
                    }`}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {/* <div className="absolute inset-0 bg-[#161B21] opacity-90 rounded-md"></div> */}
                    {/* <div className="absolute inset-0.5 bg-gray-900/50 border border-white/20 rounded-sm backdrop-blur-sm z-10"></div> */}

                    <div className="relative z-20 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-lg  bg-gray-200 border border-white/20`}
                        >
                          <stat.icon className={`w-6 h-6 ${stat.iconColor} `} />
                        </div>
                        {/* <div
                          className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                            stat.positive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-600 text-red-800"
                          }`}
                        >
                          {stat.percentage}
                        </div> */}
                      </div>
                      <div className="mb-2">
                        <h3
                          className={`text-base ${stat.iconColor} font-medium  `}
                        >
                          {stat.members}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium mb-1">
                          {stat.name}
                        </p>
                      </div>
                      <Link
                        to={stat.href}
                        className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 mt-2 group"
                      >
                        View Details
                        <ArrowUpRight
                          size={14}
                          className="ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                        />
                      </Link>
                      {/* <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-indigo-600/20 blur-2xl"></div>
                      <div className="absolute -top-6 -left-6 h-16 w-16 rounded-full bg-purple-600/20 blur-2xl"></div> */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white shadow-sm border border-gray-300   rounded-md  overflow-hidden relative">
                <div className=" p-8 relative z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold  drop-shadow-lg relative">
                        Referral
                        <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-yellow-500 to-transparent rounded-full"></span>
                      </h2>
                      <p className="mt-4  text-opacity-80">
                        Your personal invitation code
                      </p>
                    </div>
                    <div className="p-3 bg-blue-200 bg-opacity-20 rounded-full border border-gray-300 shadow-sm">
                      <Gift size={24} className="" />
                    </div>
                  </div>
                  <div className="mt-4 bg-[#410f7b] border border-white border-opacity-20 rounded-md p-6 backdrop-blur-sm shadow-inner relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-black opacity-20 rounded-full blur-xl"></div>

                    <div className="text-center relative z-10">
                      <div className="flex justify-center items-center mb-2">
                        <div className="w-6 h-1 bg-gradient-to-r from-transparent to-cyan-300 rounded-full mr-2"></div>
                        <p className="text-cyan-100 text-opacity-90 uppercase tracking-wider text-sm font-medium">
                          Referral Code
                        </p>
                        <div className="w-6 h-1 bg-gradient-to-l from-transparent to-cyan-300 rounded-full ml-2"></div>
                      </div>

                      <p className="text-3xl font-bold tracking-wider text-white mt-2 mb-4">
                        {referralCode}
                      </p>
                      <div className="mt-6">
                        <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg px-4 py-3 text-white text-sm overflow-auto border border-white border-opacity-10 group hover:bg-opacity-20 transition-all">
                          <span className="truncate">{registerUrl}</span>
                          <button
                            onClick={handleCopy}
                            className={`ml-4 transition-all duration-300 p-2 rounded-full shadow-md border ${
                              isCopied
                                ? "bg-green-500/20 border-green-400 text-green-200"
                                : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                            }`}
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {isCopied && (
                          <p className="text-green-300 text-xs mt-1.5 text-center animate-pulse">
                            Link copied to clipboard!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4  lg:grid-cols-6 ">
            <div className="grid col-span-full">
              <div className="grid grid-cols-12 gap-4 mt-6 mb-4">
                <div className="lg:col-span-8 col-span-12">
                  <div className=" group relative flex flex-col border border-gray-300  rounded-md bg-white p-4  transition-all duration-300  shadow-sm">
                    {/* <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30"></div> */}
                    {/* <div className="absolute inset-px rounded-[11px] bg-slate-950"></div> */}

                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-200">
                            <svg
                              className="h-4 w-4 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          </div>
                        </div>
                        <span class="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
                          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Live
                        </span>
                      </div>

                      <div className=" grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6">
                        {incomedetail?.map((item) => (
                          <div className="rounded-md bg-white p-3 border border-gray-300">
                            <p className="text-xs font-medium text-slate-500">
                              Total Views
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <span className="text-xs font-medium text-emerald-500">
                              {item.stat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:block hidden relative w-full lg:col-span-4 col-span-12  overflow-hidden rounded-lg bg-black border border-white/20 text-white">
                  <div className="absolute inset-0 z-0">
                    <img
                      src="https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid&w=740"
                      alt="Network background"
                      fill
                      className="object-cover opacity-70 h-full"
                    />
                  </div>
                  <div className="relative z-10 p-6">
                    <h1 className="text-2xl font-bold">Auto AI Trade</h1>
                    <div className="mt-6 flex justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">Current</p>
                        <p className="text-2xl font-bold">$0.00</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-gray-300">End In</p>
                        <p className="text-lg font-medium"> Investment</p>
                      </div>
                    </div>
                    <div className="absolute right-6 -bottom-28">
                      <TradeNow userId={auth?.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {cardDetails.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.bgColor} p-4 border border-white/20 rounded-md `}
                  >
                    <div className={`text-sm text-white `}>
                      {" "}
                      {stat.description}{" "}
                    </div>
                    <div className={`text-base  text-green-100 font-semibold `}>
                      {" "}
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div> */}

          <div className="flex flex-col lg:flex-row gap-4 ">
            <div className="w-full lg:w-1/2 border border-gray-300 bg-white rounded-md shadow-sm p-6">
              <div className="">
                <Tradechart />
              </div>
            </div>
            <div className="w-full lg:w-1/2 border border-gray-300 bg-white rounded-md shadow-sm p-6">
              <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
                <h2 className="text-lg font-medium text-[#f29727]">
                  Overall Statistics
                </h2>
                <button className="flex items-center text-blue-300 text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-6 h-[450px] no-scrollbar overflow-auto">
                {cardData.map((stat, index) => (
                  <div key={index} className="flex flex-col ">
                    <div className="flex justify-between  items-center mb-2">
                      <span className="text-gray-600">{stat.description}</span>
                      <div className="flex h-6 items-center">
                        {generateChartPoints().map((point, i) => (
                          <div
                            key={i}
                            className={`w-1 mx-0.5 rounded-sm ${stat.chartColor}`}
                            style={{ height: `${point}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-gray-800 items-center ">
                      <div className="flex items-center">
                        <span className="text-base font-medium text-[#f29727]">
                          {stat.value}
                        </span>
                        <span
                          className={`ml-2 text-sm sm:flex items-center  hidden ${
                            stat.trend === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {stat.change}
                          {stat.trend === "up" ? (
                            <ArrowUpRight size={16} className="ml-1" />
                          ) : (
                            <ArrowDownRight size={16} className="ml-1" />
                          )}
                        </span>
                      </div>
                      <button className="text-sm text-gray-800 flex items-center">
                        See more <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="my-4">
            <aside className="w-full  overflow-y-auto rounded-md ">
              <h2 className="text-lg font-semibold relative z-10  text-gray-800 ">
                Transaction History
              </h2>
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
      </div>
      <div className="md:h-4 h-20"></div>
    </>
  );
};

export default UserDashboard;
