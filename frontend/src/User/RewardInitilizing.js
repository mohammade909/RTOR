import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { initializeRewards, fetchUserRewards } from "../redux/rewardSlice";
import { Gift, Sparkles, Award, Star, Crown, ChevronRight } from "lucide-react";

const RewardsInitializationPopup = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, rewards } = useSelector((state) => state.rewards);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (auth && rewards.length === 0) {
      setIsPopupOpen(true);
    }
  }, [auth, rewards]);

  useEffect(() => {
    if (auth) {
      dispatch(fetchUserRewards(auth.id));
    }
  }, [auth]);

  const handleInitializeRewards = async () => {
    if (!loading) {
      try {
        await dispatch(initializeRewards(auth?.id)).unwrap();
        setIsPopupOpen(false);
      } catch (error) {
        console.error("Error initializing rewards:", error);
      }
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <AnimatePresence>
      {rewards.length === 0 && isPopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Light beams in background */}
          <div className="absolute inset-0 overflow-hidden opacity-70 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            className="relative max-w-md w-full overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            {/* Card background with gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-0.5">
              <div className="absolute inset-0 bg-black opacity-5 rounded-2xl"></div>
            </div>

            {/* Card content */}
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 text-center">
              
              {/* Close button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800 rounded-full p-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Glowing elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

              {/* Header icon */}
              <div className="relative mb-8 pt-2">
                <motion.div 
                  className="relative z-10 mx-auto"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.5
                  }}
                >
                  <div className="relative w-24 h-24 mx-auto">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-lg opacity-70"></div>
                    
                    {/* Icon container */}
                    <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full shadow-lg">
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Decorative stars */}
                <motion.div 
                  className="absolute top-4 left-1/4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Star className="w-6 h-6 text-yellow-300" fill="currentColor" />
                </motion.div>
                <motion.div 
                  className="absolute top-0 right-1/4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-2">
                  Unlock Your Rewards
                </h2>
                
                <p className="text-lg text-gray-300 font-medium mb-2">
                  Join our exclusive rewards program
                </p>
                
                <p className="text-gray-400 mb-8">
                  Activate now to unlock premium features, earn special bonuses, and access exclusive opportunities tailored just for you.
                </p>

                {/* Benefits */}
                <div className="mb-8 space-y-3">
                  <motion.div 
                    className="flex items-center px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="mr-3 p-1.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 text-left">Earn bonuses on referrals</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="mr-3 p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 text-left">Access exclusive opportunities</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <div className="mr-3 p-1.5 rounded-full bg-gradient-to-br from-pink-500 to-pink-600">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 text-left">Unlock premium features</p>
                  </motion.div>
                </div>

                {/* Action button */}
                <motion.button
                  onClick={handleInitializeRewards}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="w-full relative overflow-hidden group"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-lg"></div>
                  
                  {/* Button shine effect */}
                  <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  
                  {/* Button content */}
                  <div className="relative py-3.5 px-6 rounded-lg flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        <span className="font-bold text-gray-900">Activating...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-gray-900">Activate Rewards</span>
                        <ChevronRight className="ml-2 w-5 h-5 text-gray-900" />
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardsInitializationPopup;