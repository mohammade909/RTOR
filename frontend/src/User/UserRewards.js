import React, { useState, useEffect } from "react";
import {
  Trophy,
  Lock,
  CheckCircle,
  Clock,
  Gift,
  Star,
  Award,
  ChevronRight,
} from "lucide-react";
import {
  fetchUserRewards,
  fetchUserBusiness,
  claimReward,
  updateRewardStatus,
} from "../redux/rewardSlice";
import { useSelector, useDispatch } from "react-redux";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center space-x-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
      <Clock className="w-4 h-4 mr-1" />
      <span>{timeLeft.days}d </span>
      <span>{timeLeft.hours}h </span>
      <span>{timeLeft.minutes}m </span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, rewardAmount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl transform transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-gray-600 mb-6">
            You have successfully claimed your reward of{" "}
            <span className="font-bold text-green-600">${rewardAmount}</span>!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};

const LegProgressBar = ({ leg, index }) => {
  const percentage = (leg.totalBusiness / leg.required) * 100;
  const cappedPercentage = Math.min(percentage, 100);

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-gray-700">
          Leg {index + 1} ({leg.percentage}%)
        </span>
        <span className={leg.achieved ? "text-green-600" : "text-gray-600"}>
          {leg.totalBusiness}/{leg.required}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            leg.achieved ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${cappedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const RewardLevelCard = ({
  level,
  rewardAmount,
  isCompleted,
  startDate,
  endDate,
  currentBusiness,
  threshold,
  isActive,
  isForwarded,
  title,
  businessData,
  onClaimReward,
  handleCarryForward,
  rewardId,
}) => {
  const qualifies = businessData?.qualifies;
  const totalBusiness = businessData?.totalBusiness || 0;
  const legs = businessData?.legs || [];

  return (
    <div
      className={`relative p-5 border rounded-xl shadow-sm transition-all duration-300 ${
        isCompleted
          ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          : startDate
          ? "bg-gradient-to-br from-white to-blue-50 border-blue-200"
          : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
      } ${
        isActive ? "border-2 border-blue-400 shadow-md" : ""
      } hover:shadow-md`}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
          ACTIVE
        </div>
      )}
      {isForwarded && (
        <div className="absolute -top-2 -right-2 bg-blue-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Forwarded
        </div>
      )}

      <div className="sm:flex items-start sm:space-x-5 space-y-5">
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isCompleted
                ? "bg-green-100 text-green-600"
                : startDate
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="w-8 h-8" />
            ) : startDate ? (
              <Trophy className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              </div>
            </div>
            {isCompleted && <Trophy className="text-yellow-500 w-6 h-6" />}
          </div>

          <div className="flex items-center mb-3">
            <Gift className="w-4 h-4 text-emerald-500 mr-1" />
            <p className="text-sm font-semibold text-emerald-600">
              Reward: ${rewardAmount}
            </p>
          </div>

          {isActive && businessData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">
                    Business Performance
                  </h4>
                </div>
                <div className="text-sm font-medium text-blue-700">
                  {totalBusiness} total
                </div>
              </div>

              <div className="space-y-2">
                {legs.map((leg, index) => (
                  <LegProgressBar key={leg.legId} leg={leg} index={index} />
                ))}
              </div>

              <div className="mt-4 sm:flex justify-between items-center">
                <div
                  className={`text-sm font-medium mb-4 ${
                    qualifies ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {qualifies ? "Qualifies for reward" : "Not qualified yet"}
                </div>

                { qualifies &&
                  <div className="sm:flex justify-center items-center gap-4 sm:space-y-0 space-y-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClaimReward(rewardId, rewardAmount);
                      }}
                      class="overflow-hidden text-sm relative w-full sm:w-32 p-2 h-10 bg-green-600 text-white border-none rounded-md  font-semibold cursor-pointer  z-10 group"
                    >
                      Claim Reward
                      <span class="absolute w-36 h-28 -top-8 -left-2 bg-green-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
                      <span class="absolute w-36 h-28 -top-8 -left-2 bg-green-500 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
                      <span class="absolute w-36 h-28 -top-8 -left-2 bg-green-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
                      <span class="group-hover:opacity-100 text-sm group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
                        Reward Now
                      </span>
                    </button>
                    <button
                      onClick={() => handleCarryForward(totalBusiness)}
                      class="overflow-hidden w-full sm:w-32 p-2 h-10 bg-blue-600 text-white border-none rounded-md text-sm font-semibold cursor-pointer relative z-10 group"
                    >
                      Carry Forward
                      <span class="absolute w-36 h-32 -top-8 -left-2 bg-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"></span>
                      <span class="absolute w-36 h-32 -top-8 -left-2 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"></span>
                      <span class="absolute w-36 h-32 -top-8 -left-2 bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom"></span>
                      <span class="group-hover:opacity-100 text-sm group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-3 z-10">
                        {" "}
                        Carry Forward
                      </span>
                    </button>
                  </div>
                }
              </div>
            </div>
          )}

          {startDate && (
            <div className="flex flex-wrap gap-2 items-center mt-3">
              {threshold && (
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-700">
                    Goal: {currentBusiness} / {threshold}
                  </span>
                </div>
              )}

              {/* {endDate && <CountdownTimer endDate={endDate} />} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserRewardsComponent = ({
  rewards,
  businessData,
  user,
  showModal,
  claimedAmount,
  onCloseModal,
}) => {
  const dispatch = useDispatch();
  const userId = user?.id;
  const handleClaimReward = (rewardId, amount) => {
    // Get user ID from the auth state

    // Store the claimed amount in localStorage for persistence
    localStorage.setItem("claimedRewardAmount", amount);
    localStorage.setItem("showRewardModal", "true");

    // Pass both user ID and reward ID to the claim function
    dispatch(claimReward(userId));
  };
  const handleCarryForward = (business) => {
    dispatch(updateRewardStatus({ id: userId, data: { business } }));
  };

  return (
    <div className="max-w-7xl mx-auto mb-4 bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="flex items-center  justify-between  border-b p-5 border-gray-100">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 ">
            Starter Plan Rewards
          </h2>
          <p className="text-gray-500">Complete challenges to earn rewards</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-full">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>
      </div>
      <div className="p-5">
        {businessData && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-blue-800">Your Business Summary</h3>
              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Total: {businessData.totalBusiness}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {businessData.legs.map((leg) => (
                <div
                  key={leg.legId}
                  className="bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    Leg {leg.legId}
                  </div>
                  <div className="font-medium">{leg.totalBusiness}</div>
                  <div className="mt-1 text-xs">
                    <span
                      className={`font-medium ${
                        leg.achieved ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {leg.percentage}%
                    </span>
                    <span className="text-gray-500"> required</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {rewards.map((reward) => (
            <RewardLevelCard
              key={reward.id}
              rewardId={reward.id}
              level={reward.level}
              title={reward.title}
              rewardAmount={reward.reward_amount}
              isCompleted={reward.is_completed === 1}
              startDate={reward.start_date}
              endDate={reward.end_date}
              currentBusiness={reward.current_business}
              threshold={reward.threshold}
              isActive={reward.is_active == 1}
              isForwarded={reward.forworded == 1}
              businessData={reward.is_active == 1 ? businessData : null}
              onClaimReward={handleClaimReward}
              handleCarryForward={handleCarryForward}
            />
          ))}
        </div>

        <div className="mt-8 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <Gift className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-800 mb-1">
                Complete Your Journey
              </h3>
              <p className="text-sm text-indigo-700">
                🏆 Finish all levels to unlock the full Starter Plan reward
                package!
              </p>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showModal}
        onClose={onCloseModal}
        rewardAmount={claimedAmount}
      />
    </div>
  );
};

export default function RewardsPage() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { rewards, loading, successMessage, totalBusiness } = useSelector(
    (state) => state.rewards
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  // Check localStorage on component mount
  useEffect(() => {
    const showModalFromStorage = localStorage.getItem("showRewardModal");
    const amountFromStorage = localStorage.getItem("claimedRewardAmount");

    if (showModalFromStorage === "true") {
      setShowSuccessModal(true);
      setClaimedAmount(parseFloat(amountFromStorage) || 0);
    }
  }, []);

  // Fetch data on auth change
  useEffect(() => {
    if (auth) {
      dispatch(fetchUserRewards(auth?.id));
      dispatch(fetchUserBusiness(auth?.id));
    }
  }, [dispatch, auth]);

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    localStorage.removeItem("showRewardModal");
    localStorage.removeItem("claimedRewardAmount");
    window.location.reload();

    // Refresh data after closing the modal
    if (auth) {
      dispatch(fetchUserRewards(auth?.id));
      dispatch(fetchUserBusiness(auth?.id));
    }
  };

  // Show success modal when successMessage is updated
  useEffect(() => {
    if (successMessage) {
      // Check localStorage for claimed amount
      const amountFromStorage = localStorage.getItem("claimedRewardAmount");
      if (amountFromStorage) {
        setClaimedAmount(parseFloat(amountFromStorage));
        setShowSuccessModal(true);
      }
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <UserRewardsComponent
      rewards={rewards}
      businessData={totalBusiness}
      user={auth}
      showModal={showSuccessModal}
      claimedAmount={claimedAmount}
      onCloseModal={handleCloseModal}
    />
  );
}
