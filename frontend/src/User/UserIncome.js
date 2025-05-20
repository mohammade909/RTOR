import { 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  BanknotesIcon,
  UserIcon,
  UsersIcon,
  GiftIcon,
  ScaleIcon
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser, clearErrors, clearMessage } from "../redux/userSlice";
import { getTreeData } from "../redux/referralSlice";
import { getctoListByid } from "../redux/ctoSlice";
import { getTransactionById } from "../redux/transactionSlice";

export default function UserIncome() {
  const dispatch = useDispatch();
  const { singleuser, loading, error, message } = useSelector(
    (state) => state.allusers
  );
 

  const { auth } = useSelector((state) => state.auth);
  const { treeData } = useSelector((state) => state.referralTree);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getUser(auth?.id));
      dispatch(getTreeData(auth?.refferal_code));


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
  }, [dispatch, error, message, auth?.id]);


  function analyzeTeamData(treeData) {
    let totalMembers = 0;
    let activeMembers = 0;
    let totalActivePlanAmount = 0;
    let totalInvestmentPlanAmount = 0;

    let queue = Array.isArray(treeData) ? [...treeData] : [treeData];

    while (queue.length > 0) {
      let node = queue.shift();
      if (!node) continue;

      totalMembers++;
      if (node.is_active === "active") {
        activeMembers++;
        totalActivePlanAmount += node.active_plan || 0;
        totalInvestmentPlanAmount += node.investment_plan || 0;
      }

      if (node.referrals && node.referrals.length > 0) {
        queue.push(...node.referrals);
      }
    }

    return {
      totalMembers,
      activeMembers,
      totalActivePlanAmount,
      totalInvestmentPlanAmount,
    };
  }
  
  const {
    totalMembers,
    activeMembers,
    totalActivePlanAmount,
    totalInvestmentPlanAmount,
  } = analyzeTeamData(treeData);

  const limit =
    singleuser?.active_plan * 5;


  const earning = (
    (singleuser?.level_month ?? 0) +
    (singleuser?.roi_income ?? 0) +
    (singleuser?.reward ?? 0) +
    Number(singleuser?.direct_income) +
    Number(singleuser?.community_income) +
    (singleuser?.total_salary ?? 0)
  ).toFixed(2);

  // Define card data with icons and colors
  const cardData = [
    {
      name: "Total Earning",
      value: earning,
      bgColor: "from-purple-600 to-indigo-700",
      textColor: "text-white",
      icon: <CurrencyDollarIcon className="h-8 w-8 text-purple-200" />,
      highlight: true,
      gridSpan: "col-span-2",
    },
    {
      name: "Available Limit",
      value: (limit - earning).toFixed(2),
      bgColor: "from-emerald-500 to-teal-600",
      textColor: "text-white",
      icon: <ScaleIcon className="h-8 w-8 text-emerald-200" />,
    },
    {
      name: "Rent Earned",
      value: singleuser?.roi_income?.toFixed(2) || "0.00",
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-white",
      icon: <ChartBarIcon className="h-8 w-8 text-blue-200" />,
    },
    {
      name: "Refferal Income",
      value: singleuser?.direct_income || "0.00",
      bgColor: "from-amber-500 to-orange-600",
      textColor: "text-white",
      icon: <ArrowTrendingUpIcon className="h-8 w-8 text-amber-200" />,
    },
    {
      name: "Level Income",
      value: singleuser?.level_month?.toFixed(2) || "0.00",
      bgColor: "from-pink-500 to-rose-600",
      textColor: "text-white",
      icon: <BanknotesIcon className="h-8 w-8 text-pink-200" />,
    },
    {
      name: "Rewards",
      value: singleuser?.reward?.toFixed(2) || "0.00",
      bgColor: "from-yellow-500 to-amber-600",
      textColor: "text-white",
      icon: <GiftIcon className="h-8 w-8 text-yellow-200" />,
    },
    {
      name: "Total Members",
      value: totalMembers || 0,
      bgColor: "from-indigo-500 to-blue-600",
      textColor: "text-white",
      icon: <UsersIcon className="h-8 w-8 text-indigo-200" />,
    },
    {
      name: "Active Members",
      value: activeMembers || 0,
      bgColor: "from-green-500 to-emerald-600",
      textColor: "text-white",
      icon: <UserIcon className="h-8 w-8 text-green-200" />,
    },
    {
      name: "Total Team Business",
      value: (totalActivePlanAmount + totalInvestmentPlanAmount).toFixed(2) || "0.00",
      bgColor: "from-violet-600 to-purple-700",
      textColor: "text-white",
      icon: <UserGroupIcon className="h-8 w-8 text-violet-200" />,
      gridSpan: "col-span-2",
    },
  ];

  return (
    <div className="px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400 text-lg">Loading data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <div 
              key={index} 
              className={`${card.gridSpan || ""} rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
            >
              <div className={`bg-gradient-to-br ${card.bgColor} p-6 h-full`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${card.textColor} opacity-90`}>
                      {card.name}
                    </h3>
                    <div className={`mt-2 ${card.highlight ? "text-3xl" : "text-2xl"} font-bold ${card.textColor}`}>
                      {typeof card.value === 'number' ? 
                        (card.name.includes('Members') ? card.value : `$${card.value}`) 
                        : 
                        (card.name.includes('Members') ? card.value : `$${card.value}`)}
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    {card.icon}
                  </div>
                </div>
                
                {card.highlight && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex items-center text-sm text-white/80">
                      <span>Your total earnings across all income streams</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// import { 
//   ArrowTrendingUpIcon, 
//   CurrencyDollarIcon, 
//   UserGroupIcon, 
//   ChartBarIcon,
//   BanknotesIcon,
//   UserIcon,
//   UsersIcon,
//   GiftIcon,
//   ScaleIcon
// } from "@heroicons/react/24/outline";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { getUser, clearErrors, clearMessage } from "../redux/userSlice";
// import { getTreeData } from "../redux/referralSlice";
// import { getctoListByid } from "../redux/ctoSlice";
// import { getTransactionById } from "../redux/transactionSlice";

// export default function UserIncome() {
//   const dispatch = useDispatch();
//   const { singleuser, loading, error, message } = useSelector(
//     (state) => state.allusers
//   );
 
//   const { auth } = useSelector((state) => state.auth);
//   const { treeData } = useSelector((state) => state.referralTree);

//   useEffect(() => {
//     if (auth?.id) {
//       dispatch(getUser(auth?.id));
//       dispatch(getTreeData(auth?.refferal_code));
//     }

//     if (error) {
//       const errorInterval = setInterval(() => {
//         dispatch(clearErrors());
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }
//     if (message) {
//       const messageInterval = setInterval(() => {
//         dispatch(clearMessage());
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message, auth?.id]);

//   function analyzeTeamData(treeData) {
//     let totalMembers = 0;
//     let activeMembers = 0;
//     let totalActivePlanAmount = 0;
//     let totalInvestmentPlanAmount = 0;

//     let queue = Array.isArray(treeData) ? [...treeData] : [treeData];

//     while (queue.length > 0) {
//       let node = queue.shift();
//       if (!node) continue;

//       totalMembers++;
//       if (node.is_active === "active") {
//         activeMembers++;
//         totalActivePlanAmount += node.active_plan || 0;
//         totalInvestmentPlanAmount += node.investment_plan || 0;
//       }

//       if (node.referrals && node.referrals.length > 0) {
//         queue.push(...node.referrals);
//       }
//     }

//     return {
//       totalMembers,
//       activeMembers,
//       totalActivePlanAmount,
//       totalInvestmentPlanAmount,
//     };
//   }
  
//   const {
//     totalMembers,
//     activeMembers,
//     totalActivePlanAmount,
//     totalInvestmentPlanAmount,
//   } = analyzeTeamData(treeData);

//   const limit = singleuser?.active_plan * 5;

//   const earning = (
//     (singleuser?.level_month ?? 0) +
//     (singleuser?.roi_income ?? 0) +
//     (singleuser?.reward ?? 0) +
//     Number(singleuser?.direct_income) +
//     Number(singleuser?.community_income) +
//     (singleuser?.total_salary ?? 0)
//   ).toFixed(2);

//   // Define card data with icons and colors
//   const cardData = [
//     {
//       name: "Total Earning",
//       value: earning,
//       bgColor: "bg-gradient-to-br from-purple-600 to-indigo-800",
//       iconBg: "bg-white/20",
//       textColor: "text-white",
//       icon: <CurrencyDollarIcon className="h-8 w-8 text-white" />,
//       highlight: true,
//       gridSpan: "md:col-span-2",
//       growthText: "Overall performance",
//       growthValue: "+21% this month",
//       growthColor: "text-green-300",
//     },
//     {
//       name: "Available Limit",
//       value: (limit - earning).toFixed(2),
//       bgColor: "bg-gradient-to-br from-emerald-500 to-teal-700",
//       iconBg: "bg-emerald-400/30",
//       textColor: "text-white",
//       icon: <ScaleIcon className="h-8 w-8 text-white" />,
//       growthText: "Remaining capacity",
//       growthValue: "72% available",
//       growthColor: "text-emerald-200",
//     },
//     {
//       name: "Rent Earned",
//       value: singleuser?.roi_income?.toFixed(2) || "0.00",
//       bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
//       iconBg: "bg-blue-400/30",
//       textColor: "text-white",
//       icon: <ChartBarIcon className="h-8 w-8 text-white" />,
//       growthText: "Monthly growth",
//       growthValue: "+8.5%",
//       growthColor: "text-blue-200",
//     },
//     {
//       name: "Referral Income",
//       value: singleuser?.direct_income || "0.00",
//       bgColor: "bg-gradient-to-br from-amber-500 to-orange-700",
//       iconBg: "bg-amber-400/30",
//       textColor: "text-white",
//       icon: <ArrowTrendingUpIcon className="h-8 w-8 text-white" />,
//       growthText: "From last period",
//       growthValue: "+17.2%",
//       growthColor: "text-amber-200",
//     },
//     {
//       name: "Level Income",
//       value: singleuser?.level_month?.toFixed(2) || "0.00",
//       bgColor: "bg-gradient-to-br from-pink-500 to-rose-700",
//       iconBg: "bg-pink-400/30",
//       textColor: "text-white",
//       icon: <BanknotesIcon className="h-8 w-8 text-white" />,
//       growthText: "Milestone progress",
//       growthValue: "65% to next level",
//       growthColor: "text-pink-200",
//     },
//     {
//       name: "Rewards",
//       value: singleuser?.reward?.toFixed(2) || "0.00",
//       bgColor: "bg-gradient-to-br from-yellow-500 to-amber-700",
//       iconBg: "bg-yellow-400/30",
//       textColor: "text-white",
//       icon: <GiftIcon className="h-8 w-8 text-white" />,
//       growthText: "Achievement rate",
//       growthValue: "3 new rewards",
//       growthColor: "text-yellow-200",
//     },
//     {
//       name: "Total Members",
//       value: totalMembers || 0,
//       bgColor: "bg-gradient-to-br from-indigo-500 to-blue-700",
//       iconBg: "bg-indigo-400/30",
//       textColor: "text-white",
//       icon: <UsersIcon className="h-8 w-8 text-white" />,
//       growthText: "Network expansion",
//       growthValue: "+5 this week",
//       growthColor: "text-indigo-200",
//     },
//     {
//       name: "Active Members",
//       value: activeMembers || 0,
//       bgColor: "bg-gradient-to-br from-green-500 to-emerald-700",
//       iconBg: "bg-green-400/30",
//       textColor: "text-white",
//       icon: <UserIcon className="h-8 w-8 text-white" />,
//       growthText: "Activation rate",
//       growthValue: "86% of total",
//       growthColor: "text-green-200",
//     },
//     {
//       name: "Total Team Business",
//       value: (totalActivePlanAmount + totalInvestmentPlanAmount).toFixed(2) || "0.00",
//       bgColor: "bg-gradient-to-br from-violet-600 to-purple-800",
//       iconBg: "bg-violet-400/30",
//       textColor: "text-white",
//       icon: <UserGroupIcon className="h-8 w-8 text-white" />,
//       gridSpan: "md:col-span-2",
//       growthText: "Business volume",
//       growthValue: "+12.8% this month",
//       growthColor: "text-violet-200",
//     },
//   ];

//   // Calculate percentage for progress bars based on earnings vs limit
//   const totalEarningPercentage = Math.min(100, (parseFloat(earning) / parseFloat(limit || 1)) * 100);

//   // Loading animation
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex justify-center items-center">
//         <div className="flex flex-col items-center">
//           <div className="w-24 h-24 relative">
//             <div className="absolute top-0 left-0 right-0 bottom-0 animate-ping rounded-full bg-indigo-500 opacity-75"></div>
//             <div className="absolute top-3 left-3 right-3 bottom-3 rounded-full bg-indigo-600"></div>
//             <CurrencyDollarIcon className="absolute top-6 left-6 h-12 w-12 text-white" />
//           </div>
//           <p className="mt-6 text-indigo-800 text-xl font-semibold">Loading your financial dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
//           <p className="text-gray-600">Welcome back, {singleuser?.name || "User"}! Here's your financial overview.</p>
//         </div>

//         {/* Main Income Summary */}
//         <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//           <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold">Income Summary</h2>
//                 <p className="opacity-80">Current performance metrics</p>
//               </div>
//               <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
//                 <CurrencyDollarIcon className="h-8 w-8 text-white" />
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-between items-end">
//               <div>
//                 <div className="text-sm opacity-80">Total Earnings</div>
//                 <div className="text-4xl font-bold">${earning}</div>
//               </div>
//               <div>
//                 <div className="text-sm opacity-80">Limit</div>
//                 <div className="text-2xl font-semibold">${limit?.toFixed(2) || "0.00"}</div>
//               </div>
//             </div>
            
//             <div className="mt-4">
//               <div className="flex justify-between mb-1 text-sm">
//                 <span>Progress</span>
//                 <span>{totalEarningPercentage.toFixed(0)}%</span>
//               </div>
//               <div className="h-3 bg-white/20 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-gradient-to-r from-green-300 to-emerald-400 rounded-full transition-all duration-1000" 
//                   style={{ width: `${totalEarningPercentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {cardData.map((card, index) => (
//             <div 
//               key={index} 
//               className={`${card.gridSpan || ""} rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-gray-100`}
//             >
//               <div className={`${card.bgColor} p-6 h-full relative overflow-hidden`}>
//                 {/* Decorative elements */}
//                 <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5"></div>
//                 <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/5"></div>
                
//                 <div className="relative z-10">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className={`text-lg font-medium ${card.textColor} opacity-90`}>
//                         {card.name}
//                       </h3>
//                       <div className={`mt-2 ${card.highlight ? "text-4xl" : "text-3xl"} font-bold ${card.textColor} flex items-baseline`}>
//                         {!card.name.includes('Members') && <span className="text-lg mr-1">$</span>}
//                         {typeof card.value === 'number' ? 
//                           (card.name.includes('Members') ? card.value.toLocaleString() : parseFloat(card.value).toLocaleString()) 
//                           : 
//                           (card.name.includes('Members') ? card.value : card.value)}
//                       </div>
//                     </div>
//                     <div className={`${card.iconBg} rounded-xl p-3 backdrop-blur-sm`}>
//                       {card.icon}
//                     </div>
//                   </div>
                  
//                   <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
//                     <div className="text-sm text-white/80">
//                       {card.growthText}
//                     </div>
//                     <div className={`text-sm font-medium ${card.growthColor}`}>
//                       {card.growthValue}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Insights Section */}
//         <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Insights & Tips</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//               <div className="flex items-start">
//                 <div className="p-2 bg-blue-100 rounded-lg mr-3">
//                   <ChartBarIcon className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-blue-700">Earning Potential</h3>
//                   <p className="text-sm text-blue-600">You're at {totalEarningPercentage.toFixed(0)}% of your income limit. Explore ways to maximize your earnings!</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
//               <div className="flex items-start">
//                 <div className="p-2 bg-emerald-100 rounded-lg mr-3">
//                   <UserGroupIcon className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-emerald-700">Team Growth</h3>
//                   <p className="text-sm text-emerald-600">With {activeMembers} active members, your team is performing well. Consider strategies to increase activation rate.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }