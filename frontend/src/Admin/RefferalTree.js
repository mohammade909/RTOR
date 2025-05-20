import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTreeData } from "../redux/referralSlice";
import "../User/ReferralTree.css"; // Import your CSS file here
import { useParams } from "react-router-dom";
// TreeNode Component


const calculateTotalBusiness = (user) => {
  let totalBusiness = Number(user.active_plan) || 0;
  if (Array.isArray(user?.referrals) && user?.referrals.length > 0) {
    user?.referrals?.forEach((referral) => {
      totalBusiness += calculateTotalBusiness(referral);
    });
  }
  return totalBusiness;
};


const TreeNode = ({ user, expandedNodes, toggleExpand, isWhite }) => {
  const bgColor = isWhite ? "#FFFFFF" : "#D1D5DB"; // White or Gray based on index
  const borderColor = isWhite ? "border-gray-400" : "border-gray-300"; // Alternating borders
  return (
    <li className="relative flex flex-col items-center">
      {/* Before condition */}
      <div className="before-condition text-lg text-gray-500">
        {/* Before: {user.beforeCondition || "N/A"} */}
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleExpand(user.id);
        }}
        className={`border ${borderColor} py-2 px-4 rounded hover:bg-blue-100 flex items-center`}
        style={{ backgroundColor: bgColor }} // Use the defined background color
      >
        <div className="relative">
          <img
            src="/default.png" // Placeholder image
            alt={user?.username}
            className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
          />
          {user?.referrals && user?.referrals.length > 0 && (
            <div className="absolute w-0 h-full bg-gray-300 left-1/2 transform -translate-x-1/2 top-10"></div>
          )}
        </div>
        <div className="ml-2">
          <div className="font-semibold">{user?.username}</div>
          <div>Email: {user?.email}</div>
          <div>Status: {user?.is_active ? "Active" : "Inactive"}</div>
          <div className="font-semibold">Self business : ${user?.active_plan}</div>
          <div className="font-semibold">Refferal : ${user?.refferal_code}</div>
          <div className="font-semibold">Total business : ${calculateTotalBusiness(user)}</div>
        </div>
      </a>

      <div className="after-condition text-lg text-gray-500">
      </div>

      {expandedNodes[user.id] &&
        user.referrals &&
        user.referrals.length > 0 && (
          <ul className="flex justify-center pt-4 relative space-x-8">
            {user.referrals.map((childUser, index) => (
              <li key={childUser.id} className="mb-4 mx-2">
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

// RefferalTree Component
const RefferalTree = () => {
const { referral_code } =useParams()
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state.auth);
  const { treeData } = useSelector((state) => state.referralTree);
  const [expandedNodes, setExpandedNodes] = useState({}); // Track which nodes are expanded

  useEffect(() => {
    if (referral_code) {
      dispatch(getTreeData(referral_code));
    }
  }, [referral_code, dispatch]);

  // Toggle expand/collapse for a node
  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the current state
    }));
  };

  return (
    <div className="py-12 overflow-auto genealogy-scroll whitespace-nowrap min-h-screen text-center bg-gray-900">
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <img
            src="/default.png" // Placeholder image
            alt={auth?.username}
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>
        <div className="ml-2 text-white">
          <div className="font-semibold">{auth?.username}</div>
          <div>ID: {auth?.id}</div>
          <div>Email: {auth?.email}</div>
          <div>Status: {auth?.is_active ? "Active" : "Inactive"}</div>
        </div>
      </div>

      <div className="tree inline-block">
        <ul className="flex justify-center pt-5 space-x-8">
          {treeData?.map((user, index) => {
            return (
              <>
                {/* <p className="text-white">{user.referrals.length > 0 ?"has-referrals" : "not-referrals"}</p> */}
                <TreeNode
                  key={user.id}
                  user={user}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                  isWhite={index % 2 === 0} // Pass the alternating color state
                />
              </>
            );
          })}
        </ul>
      </div>

      {error && <p>{error}</p>}
      {treeData?.length === 0 && (
        <div className="text-white text-center">No More Tree</div>
      )}
    </div>
  );
};

export default RefferalTree;

