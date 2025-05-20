import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Zap,
  BarChart2,
  Activity,
  Eye,
  Clock,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { getTreeData } from "../redux/referralSlice";
import { getUser } from "../redux/userSlice";
import { getAllDepositeByid } from "../redux/depositeSlice";
import { getAllWithdrawalByid } from "../redux/withdrawalSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function UserStats({ user }) {
  const [activeTab, setActiveTab] = useState("today");
  const dispatch = useDispatch();
  const { singlecto } = useSelector((state) => state.cto);
  const { singleDeposite } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { loading, treeData } = useSelector((state) => state.referralTree);
  const [topGenerations, setTopGenerations] = useState([]);
  const [totalBusiness, setTotalBusiness] = useState();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    dispatch(getAllDepositeByid(user?.id));
    dispatch(getAllWithdrawalByid(user?.id));
    dispatch(getTreeData(user?.refferal_code));
  }, [user?.id]);

  const totalEarning = (
    (user?.level_month ?? 0) +
    (user?.roi_income ?? 0) +
    (user?.reward ?? 0) +
    Number(user?.direct_income) +
    (user?.total_salary ?? 0)
  ).toFixed(2);



  function countTotalTeamWithActiveInactive(user) {
    let totalTeam = 0;
    let activeCount = 0;
    let inactiveCount = 0;
    const stack = [user];

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
    <div className="">
      {/* <div className="">
        <div className="flex justify-between items-center mb-4">
          <h2 className="sm:text-xl text-lg font-semibold text-white">
            Performance Analytics
          </h2>
          <div className="flex space-x-1">
            <button className="p-2 rounded-md bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition">
              <Zap className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-emerald-400 text-xs font-medium">
                Total Income
              </span>
              <div className="bg-emerald-500/30 p-1.5 rounded-md">
                <DollarSign className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(totalEarning).toLocaleString()}
                </p>
                
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600/20 to-violet-700/20 p-4 rounded-2xl border border-violet-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-violet-400 text-xs font-medium">
                Direct Income
              </span>
              <div className="bg-violet-500/30 p-1.5 rounded-md">
                <Users className="w-3 h-3 text-violet-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(user?.direct_income).toLocaleString()}
                </p>
                
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 p-4 rounded-2xl border border-blue-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-400 text-xs font-medium">
                Level Income
              </span>
              <div className="bg-blue-500/30 p-1.5 rounded-md">
                <Activity className="w-3 h-3 text-blue-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(user?.level_month).toLocaleString()}
                </p>
               
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 p-4 rounded-2xl border border-amber-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-amber-400 text-xs font-medium">
                Community Bonus
              </span>
              <div className="bg-amber-500/30 p-1.5 rounded-md">
                <ShoppingCart className="w-3 h-3 text-amber-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(user?.community_income)}
                </p>
                
              </div>
             
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-emerald-400 text-xs font-medium">
                Total Business
              </span>
              <div className="bg-emerald-500/30 p-1.5 rounded-md">
                <DollarSign className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(totalBusiness).toLocaleString()}
                </p>
                
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600/20 to-violet-700/20 p-4 rounded-2xl border border-violet-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-violet-400 text-xs font-medium">
                Reward Income 
              </span>
              <div className="bg-violet-500/30 p-1.5 rounded-md">
                <Users className="w-3 h-3 text-violet-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">
                  ${Number(
                    user?.reward
                  ).toLocaleString()}
                </p>
                
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 p-4 rounded-2xl border border-blue-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-400 text-xs font-medium">
                Total Withdrawal
              </span>
              <div className="bg-blue-500/30 p-1.5 rounded-md">
                <Activity className="w-3 h-3 text-blue-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">${Number(totalWithdrawals).toLocaleString()}</p>
                
              </div>
              
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 p-4 rounded-2xl border border-amber-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-amber-400 text-xs font-medium">
                Total Deposit
              </span>
              <div className="bg-amber-500/30 p-1.5 rounded-md">
                <ShoppingCart className="w-3 h-3 text-amber-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">${Number(totalDeposits).toLocaleString()}</p>
                
              </div>

              
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 p-4 rounded-2xl border border-indigo-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-indigo-400 text-xs font-medium">
                Inactive Members
              </span>
              <div className="bg-indigo-500/30 p-1.5 rounded-md">
                <Activity className="w-3 h-3 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">{Number(totalDirectInactiveMembers).toLocaleString()}</p>
                
              </div>
             
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-700/20 p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-cyan-400 text-xs font-medium">
                Active Members
              </span>
              <div className="bg-cyan-500/30 p-1.5 rounded-md">
                <ShoppingCart className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-2xl font-bold">{Number(totalActiveMembers).toLocaleString()}</p>
                
              </div>

             
            </div>
          </div>
        </div>
      </div> */}






    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-orange-400 rounded-md p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
              +22%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium"> Total Income</p>
            <p className="text-2xl font-bold"> ${Number(totalEarning).toLocaleString()}</p>
          </div>
        </div>

        {/* Total Sales Return Card */}
        <div className="bg-blue-900 rounded-md p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div className="px-2 py-1 bg-red-500/80 rounded-full text-xs font-medium">
              -22%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium"> Direct Income</p>
            <p className="text-2xl font-bold">${Number(user?.direct_income).toLocaleString()}</p>
          </div>
        </div>

        {/* Total Purchase Card */}
        <div className="bg-emerald-500 rounded-md p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
              +22%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium"> Level Income</p>
            <p className="text-2xl font-bold"> ${Number(user?.level_month).toLocaleString()}</p>
          </div>
        </div>

        {/* Total Purchase Return Card */}
        <div className="bg-blue-500 rounded-md p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
              +22%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium"> Community Bonus Return</p>
            <p className="text-2xl font-bold">  ${Number(user?.community_income)}</p>
          </div>
        </div>
      </div>

      {/* Bottom Row - Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Profit Card */}
        <div className="bg-white rounded-md border  border border-gray-300 p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xl font-bold text-gray-800">${Number(totalBusiness).toLocaleString()}</p>
              <p className="text-sm text-emerald-600 font-medium">Total Business</p>
            </div>
            <div className="bg-cyan-50 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-emerald-600">+35% vs Last Month</p>
            <p className="text-sm font-medium text-blue-600">View All</p>
          </div>
        </div>

        {/* Invoice Due Card */}
        <div className="bg-white rounded-md border   border-gray-300 p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xl font-bold text-gray-800"> ${Number(
                    user?.reward
                  ).toLocaleString()}
                </p>
              <p className="text-sm text-orange-500 font-medium"> Reward Income </p>
            </div>
            <div className="bg-cyan-50 p-2 rounded-md ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-emerald-600">+35% vs Last Month</p>
            <p className="text-sm font-medium text-blue-600">View All</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-md p-4  border border-gray-300 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xl font-bold text-gray-800">${Number(totalWithdrawals).toLocaleString()}</p>
              <p className="text-sm text-emerald-600 font-medium">   Total Withdrawal</p>
            </div>
            <div className="bg-red-50 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-emerald-600">+41% vs Last Month</p>
            <p className="text-sm font-medium text-blue-600">View All</p>
          </div>
        </div>

        {/* Total Payment Returns Card */}
        <div className="bg-white rounded-md p-4 shadow-md  border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xl font-bold text-gray-800">${Number(totalDeposits).toLocaleString()}</p>
              <p className="text-sm text-blue-600 font-medium"> Total Deposit</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-red-500">-20% vs Last Month</p>
            <p className="text-sm font-medium text-blue-600">View All</p>
          </div>
        </div>
      </div>
      
      {/* Settings Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-orange-400 text-white p-4 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </div>

    </div>
  );
}
