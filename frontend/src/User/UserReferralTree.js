

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTreeData } from "../redux/referralSlice";
import Loader from "../BaseFile/comman/Loader";

// Helper function to calculate total business
const calculateTotalBusiness = (user) => {
  let totalBusiness = Number(user.active_plan) || 0;
  if (Array.isArray(user?.referrals) && user?.referrals.length > 0) {
    user?.referrals?.forEach((referral) => {
      totalBusiness += calculateTotalBusiness(referral);
    });
  }
  return totalBusiness;
};

// TreeNode Component with improved responsiveness
const TreeNode = ({ user, expandedNodes, toggleExpand }) => {
  const totalBusiness = calculateTotalBusiness(user);
  const isActive = user?.is_active === "active" || user?.is_active === true;
  
  return (
   <>
   <div className="">
   <li className="flex relative flex-row items-center  ">
      <div 
        onClick={(e) => {
          e.preventDefault();
          toggleExpand(user.id);
        }}
        className="transition-all duration-300 transform cursor-pointer hover:scale-105 w-full max-w-xs sm:max-w-sm"
      >
        <div className={`relative rounded-xl overflow-hidden shadow-2xl border-2 ${isActive ? 'border-emerald-500' : 'border-rose-400'}`}>
          <div className={`absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 rounded-full m-1 md:m-2 ${isActive ? 'bg-emerald-500' : 'bg-rose-400'}`}></div>
          
          <div className="flex flex-col p-2 md:p-4 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="relative">
                <img
                  src="/default.png"
                  alt={user?.username}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 shadow-lg border-slate-600"
                />
                {isActive && (
                  <div className="absolute right-0 bottom-0 w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full border border-white"></div>
                )}
              </div>
              <div className="ml-2 md:ml-3 text-white">
                <h3 className="text-xs font-bold sm:text-sm md:text-base">{user?.username}</h3>
                <p className="max-w-xs text-xs truncate text-slate-300">{user?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-1 md:mt-2 text-xs">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs">Self Investment</span>
                <span className="font-semibold text-emerald-400">${user?.active_plan || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs">Total Network</span>
                <span className="font-semibold text-sky-400">${totalBusiness}</span>
              </div>
              <div className="flex flex-col col-span-2 mt-1">
                <span className="text-slate-400 text-xs">Referral Code</span>
                <div className="p-1 font-mono text-xs text-amber-300 break-all rounded-md bg-slate-700/50">{user?.refferal_code}</div>
              </div>
            </div>
            
            {user.referrals && user.referrals.length > 0 && (
              <div className="flex justify-center mt-2 md:mt-3">
                <button 
                  className={`text-xs rounded-full px-2 py-1 md:px-3 border transition-colors ${
                    expandedNodes[user.id] 
                      ? 'bg-indigo-900 text-indigo-200 border-indigo-700' 
                      : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center">
                    {expandedNodes[user.id] ? 'Hide' : 'Show'} {user.referrals.length} Referral{user.referrals.length !== 1 ? 's' : ''}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-3 w-3 md:h-4 md:w-4 ml-1 transition-transform duration-300 ${expandedNodes[user.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vertical connector line */}
      {expandedNodes[user.id] && user.referrals && user.referrals.length > 0 && (
        <div className="w-px h-6 md:h-8 bg-slate-500/50"></div>
      )}

      {/* Children nodes */}
      {expandedNodes[user.id] && user.referrals && user.referrals.length > 0 && (
        <div className="relative">
          {/* Horizontal connector line */}
          <div className="absolute top-0 left-1/2 w-full h-px transform -translate-x-1/2 bg-slate-500/50"></div>
          
          <ul className="flex relative gap-2 xs:gap-3 sm:gap-4 md:gap-6 justify-center items-start pt-6 md:pt-8">
            {user.referrals.map((childUser) => (
              <li key={childUser.id} className="mb-4 md:mb-6">
                <TreeNode
                  user={childUser}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
   </div>
   </>
  );
};

// Main Component
const UserReferralTree = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state.auth);
  const { treeData, loading } = useSelector((state) => state.referralTree);
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    if (auth?.refferal_code) {
      dispatch(getTreeData(auth?.refferal_code));
    }
  }, [auth?.refferal_code, dispatch]);

  // Toggle expand/collapse for a node
  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="overflow-auto px-2 py-4 md:py-6 min-h-screen  sm:px-4">
      <Loader isLoading={loading} />
      
      {/* User Profile Card */}
      <div className="flex justify-center items-center mb-6 md:mb-10">
        <div className="p-3 md:p-4 lg:p-5 w-full max-w-xs bg-[#2e5799] rounded-2xl border shadow-2xl    border-b border-blue-500">
          <div className="flex flex-col items-center">
            <div className="relative mb-3 md:mb-4">
              <div className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-2xs md:text-xs ${
                auth?.is_active 
                  ? 'bg-emerald-500 text-emerald-100' 
                  : 'bg-rose-500 text-rose-100'
              }`}>
                {auth?.is_active ? "Active" : "Inactive"}
              </div>
              <img
                src="/default.png"
                alt={auth?.username}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 shadow-lg border-slate-700"
              />
            </div>
            
            <div className="text-center text-white">
              <h2 className="text-lg md:text-xl font-bold">{auth?.username}</h2>
              <p className="mb-2 text-xs md:text-sm text-slate-300">{auth?.email}</p>
              <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm rounded-full bg-slate-800 text-slate-300">
                ID: {auth?.id}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 w-full">
              <div className="p-2 text-center rounded-lg bg-blue-700">
                <p className="text-2xs md:text-xs text-slate-200">Investment</p>
                <p className="font-bold text-xs md:text-base text-emerald-400">${auth?.active_plan || 0}</p>
              </div>
              <div className="p-2 text-center rounded-lg bg-blue-700">
                <p className="text-2xs md:text-xs text-slate-200">Referrals</p>
                <p className="font-bold text-xs md:text-base text-sky-400">{auth?.referrals?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tree visualization - with improved scrolling and sizing */}
      <div className="">
        <div className="">
          {treeData?.length > 0 ? (
            <ul className="flex w-full gap-5 ">
              {treeData?.map((user) => (
                <TreeNode
                  key={user.id}
                  user={user}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                />
              ))}
            </ul>
          ) : !loading && (
            <div className="py-6 md:py-10  mx-2 text-center text-white rounded-lg border bg-[#2e5799] p-4 border-b border-blue-500 sm:mx-auto sm:max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mb-1 text-lg md:text-xl font-medium">No Referral Data</h3>
              <p className="text-sm md:text-base text-slate-400">You don't have any referrals in your network yet</p>
              
              <div className="mt-4 md:mt-6">
                <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-white bg-indigo-600 rounded-lg shadow-lg transition-colors duration-300 hover:bg-indigo-700">
                  Share Your Referral Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="p-2 md:p-3 mx-auto mt-3 md:mt-4 max-w-md text-center text-sm md:text-base text-rose-400 rounded-lg bg-rose-900/20">
          <div className="flex justify-center items-center mb-1 md:mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          {error}
        </div>
      )}
    </div>
  );
};

export default UserReferralTree;










