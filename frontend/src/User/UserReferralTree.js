import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTreeData } from "../redux/referralSlice";
import "./ReferralTree.css";
import Loader from "../BaseFile/comman/Loader";

// Recursive function to calculate total business
const calculateTotalBusiness = (user) => {
  let totalBusiness = Number(user.active_plan) || 0;
  if (Array.isArray(user?.referrals) && user?.referrals.length > 0) {
    user.referrals.forEach((referral) => {
      totalBusiness += calculateTotalBusiness(referral);
    });
  }
  return totalBusiness;
};

// Recursive function to calculate total referrals
const calculateTotalReferrals = (user) => {
  if (!Array.isArray(user?.referrals) || user.referrals.length === 0) {
    return 0;
  }

  return user?.referrals?.reduce(
    (total, ref) => total + 1 + calculateTotalReferrals(ref),
    0
  );
};

const TreeNode = ({ user, expandedNodes, toggleExpand, isWhite }) => {
  const handleDoubleClick = (e) => {
    e.preventDefault();
    toggleExpand(user.id);
  };

  return (
    <li className="relative flex flex-col items-center">
      <div className="node-container relative group">
        <div
          className="bg-white text-gray-800 border border-gray-300 shadow-sm py-2 px-4 rounded hover:bg-gray-100 transition-all duration-200 flex flex-col items-center cursor-pointer"
          onClick={handleDoubleClick}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <img src="/logo.png" alt={user?.username} className="w-20" />
              {user?.is_active && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              )}
            </div>
            <div className="font-semibold mt-1">{user?.username}</div>

            <div className="text-xs text-gray-500 mt-1">
              Total Referrals: {calculateTotalReferrals(user)}
            </div>

            {user?.referrals?.length > 0 && (
              <div className="absolute w-0.5 h-4 bg-gray-300 left-1/2 transform -translate-x-1/2 top-full"></div>
            )}
          </div>

          {/* Hover details */}
          <div className="details-card absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-3 rounded-lg shadow-lg z-10 w-64 text-left border border-gray-300 hidden group-hover:block">
            <div className="text-gray-800 text-sm">
              <div className="text-gray-600">{user?.email}</div>
              <div className="mt-1">
                Status: <span className="font-medium">{user?.is_active ? "Active" : "Inactive"}</span>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <div className="bg-gray-100 px-2 py-1 rounded flex justify-between">
                  <span>Self investment:</span>
                  <span>${user?.active_plan || 0}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded flex justify-between">
                  <span>Referral code:</span>
                  <span>{user?.refferal_code}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded flex justify-between">
                  <span>Total network:</span>
                  <span>${calculateTotalBusiness(user)}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded flex justify-between">
                  <span>Total referrals:</span>
                  <span>{calculateTotalReferrals(user)}</span>
                </div>
              </div>
              <div className="flex justify-center mt-2 text-xs text-gray-500">
                {expandedNodes[user.id]
                  ? "Double-click to collapse"
                  : "Double-click to expand"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {expandedNodes[user.id] &&
        user.referrals &&
        user.referrals.length > 0 && (
          <ul className="flex justify-center pt-6 relative">
            {user.referrals.map((childUser, index) => (
              <li key={childUser.id} className="mb-4">
                <TreeNode
                  user={childUser}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                  isWhite={index % 2 === 0}
                />
              </li>
            ))}
          </ul>
        )}
    </li>
  );
};

const UserReferralTree = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state.auth);
  const { loading, treeData } = useSelector((state) => state.referralTree);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [rootClickTimeout, setRootClickTimeout] = useState(null);

  useEffect(() => {
    if (auth?.refferal_code) {
      dispatch(getTreeData(auth?.refferal_code));
    }
  }, [auth?.refferal_code, dispatch]);

  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRootNodeClick = () => {
    if (rootClickTimeout) {
      clearTimeout(rootClickTimeout);
      setRootClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        setShowUserDetails(!showUserDetails);
        setRootClickTimeout(null);
      }, 300);
      setRootClickTimeout(timeout);
    }
  };

  return (
    <div className="py-12 px-24 overflow-auto genealogy-scroll whitespace-nowrap min-h-screen text-center">
      <div className="flex justify-center items-center mb-10">
        <div
          className="bg-white text-gray-800 p-4 rounded-md relative cursor-pointer group border border-gray-300 shadow-sm"
          onClick={handleRootNodeClick}
        >
          <div className="relative justify-center flex mb-1">
            <div className="absolute -top-10 rounded-t-lg bg-gray-800 text-white px-3 py-1 text-xs">
              {auth?.is_active ? "Active" : "Inactive"}
            </div>
            <img src="/logo.png" alt={auth?.username} className="w-20" />
          </div>

          <div className="font-medium text-sm mt-1">{auth?.username}</div>

          <div className="text-xs text-gray-500 mt-1">
            Total Referrals:{" "}
            {treeData?.reduce((acc, u) => acc + 1 + calculateTotalReferrals(u), 0)}
          </div>

          {/* {showUserDetails && (
            <div className="text-xs text-center mt-1">ID: {auth?.id}</div>
          )} */}

          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-4 rounded-lg shadow-lg z-10 w-72 text-left border border-gray-300 hidden group-hover:block">
            <div className="text-gray-800">
              <div className="font-semibold text-lg">ID: {auth?.id}</div>
              <div className="text-sm text-gray-600">{auth?.email}</div>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <div className="bg-gray-100 px-3 py-2 rounded">
                  <span>Status: </span>
                  <span className="font-medium">
                    {auth?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded">
                  <span>Referral code: </span>
                  <span>{auth?.refferal_code}</span>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500">
                <div>Hover to view details</div>
                <div>Double-click to expand/collapse</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Loader isLoading={loading} />

      <div className="tree inline-block">
        <ul className="flex justify-center pt-5">
          {treeData?.map((user, index) => (
            <TreeNode
              key={user.id}
              user={user}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              isWhite={index % 2 === 0}
            />
          ))}
        </ul>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {treeData?.length === 0 && (
        <div className="text-gray-600 text-center mt-8 text-lg">
          No referrals found in your network
        </div>
      )}
    </div>
  );
};

export default UserReferralTree;
