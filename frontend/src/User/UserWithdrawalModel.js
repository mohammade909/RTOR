// import React, { useState, useEffect, useCallback } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../BaseFile/comman/Spinner";
// import { getUser } from "../redux/userSlice";
// import {
//   addWithdrawal,
//   autoTransfer,
//   clearErrors,
//   clearMessage,
// } from "../redux/withdrawalSlice";

// // Function to calculate maximum withdrawal amount
// export const calculateMaxWithdrawal = (
//   user,
//   transactions,
//   currentDate,
//   dispatch
// ) => {
//   // Constants
//   const MAX_SINGLE_WITHDRAWAL = 50; // Maximum amount per single withdrawal
//   const EARNING_MULTIPLIER = 5; // User can earn active_plan * 5
//   const WITHDRAWAL_PERCENTAGE = 0.5; // Can withdraw up to 50% of total limit

//   // Calculate the total earnings potential based on active plan
//   const totalLimit = user.active_plan * EARNING_MULTIPLIER;

//   // Calculate maximum withdrawable amount (50% of total limit)
//   const maxWithdrawableTotal = totalLimit * WITHDRAWAL_PERCENTAGE;

//   // Calculate six months from some reference date (assuming user registration or plan start date)
//   const planStartDate = new Date(
//     user.plan_start_date || user.registration_date
//   );
//   const sixMonthsLater = new Date(planStartDate);
//   sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

//   // Calculate total withdrawals made so far (only count successful ROI withdrawals)
//   const totalWithdrawals = transactions
//     .filter((item) => item.status !== "decline")
//     .reduce((acc, item) => acc + (item.amount || 0) + (item.deduction || 0), 0);

//   // Calculate remaining available withdrawal limit
//   const remainingWithdrawalLimit = Math.max(
//     0,
//     maxWithdrawableTotal - totalWithdrawals
//   );

//   // Determine maximum withdrawal amount for this transaction
//   // It cannot exceed MAX_SINGLE_WITHDRAWAL (50), the remaining limit, or the user's actual balance
//   let availableForWithdrawal = Math.min(
//     remainingWithdrawalLimit,
//     user.working // Cannot withdraw more than actual balance
//   );

//   // if (
//   //   ( Number(user?.working) !== 0) ||
//   //   (Number(user?.non_working )!== 0 && availableForWithdrawal == 0)
//   // ) {
//   //   dispatch(autoTransfer(user?.id));
//   // }

//   return {
//     canWithdrawFullBalance: true,
//     maxAmount: availableForWithdrawal,
//     remainingLimit: remainingWithdrawalLimit,
//     alreadyWithdrawn: totalWithdrawals,
//   };
//   // If current date is after six months, different rules may apply
//   // This is where you can implement the six-month rule if needed
//   // if (currentDate >= sixMonthsLater) {
//   //   // After six months, you might want to allow different behavior
//   //   // For now, keeping the same logic but separated for clarity
//   //   return {
//   //     canWithdrawFullBalance: false, // Still limited by the 50% rule
//   //     maxAmount: availableForWithdrawal,
//   //     remainingLimit: remainingWithdrawalLimit,
//   //     totalLimit: totalLimit,
//   //     alreadyWithdrawn: totalWithdrawals,
//   //   };
//   // } else {
//   //   return {
//   //     canWithdrawFullBalance: false,
//   //     maxAmount: availableForWithdrawal,
//   //     remainingLimit: remainingWithdrawalLimit,
//   //     totalLimit: totalLimit,
//   //     alreadyWithdrawn: totalWithdrawals,
//   //   };
//   // }
// };
// export default function UserWithdrawalModel({ openModel, modelClose }) {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { loading } = useSelector((state) => state.otp);
//   const { singleuser } = useSelector((state) => state.allusers);
//   const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
//   const [values, setValues] = useState({});
//   const [isMpinRequested, setIsMpinRequested] = useState(false);
//   const [mpin, setMpin] = useState("");
//   const [check, setCheck] = useState(null);
//   const [maxAmount, setMaxAmount] = useState(0);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [remainingBalance, setRemainingTotal] = useState(0);
//   const [totalWithdrawal, setTotalWithdrwal] = useState(0);
//   const [totalLimit, setTotalLimit] = useState(0);

//   // Calculate wallet balance and determine withdrawal permissions
//   useEffect(() => {
//     dispatch(getUser(auth?.id));
//     const currentDate = new Date();
//     const result = calculateMaxWithdrawal(
//       singleuser,
//       singleWithdrawal,
//       currentDate,
//       dispatch
//     );
//     setCheck(result.canWithdrawFullBalance);
//     setMaxAmount(result.maxAmount);
//     // You can also track and display the remaining total they can earn
//     setRemainingTotal(result.remainingFromTotal);
//     setTotalWithdrwal(result.alreadyWithdrawn);
//     setTotalLimit(result.remainingLimit);
//   }, [dispatch, auth?.id, singleuser]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setValues((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   }, []);

//   const validateAmount = useCallback(() => {
//     const amount = Number(values.amount);

//     if (amount > maxAmount) {
//       setErrorMessage("Amount exceeds maximum wallet balance");
//       return false;
//     }

//     if (amount < 30) {
//       setErrorMessage("Amount should be at least $30");
//       return false;
//     }

//     // if (amount % 10 !== 0) {
//     //   setErrorMessage("Amount should be a multiple of 10");
//     //   return false;
//     // }

//     setErrorMessage("");
//     return true;
//   }, [values.amount, maxAmount]);

//   const requestMpin = useCallback(() => {
//     if (!validateAmount()) return;
//     setIsMpinRequested(true);
//   }, [validateAmount]);

//   const verifyAndSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       setErrorMessage("");

//       try {
//         if (singleuser?.mpin !== Number(mpin)) {
//           setErrorMessage("Transaction aborted! Wrong M-Pin.");
//           return;
//         } else {
//           const allValues = {
//             ...values,
//             user_id: auth?.id,
//             check: check,
//           };

//           await dispatch(addWithdrawal({ values: allValues }));
//           modelClose();
//         }
//       } catch (error) {
//         console.error("An error occurred during verification:", error);
//         setErrorMessage("An error occurred. Please try again.");
//       }
//     },
//     [dispatch, auth?.id, mpin, values, check, modelClose, singleuser?.mpin]
//   );

//   return (
//     <Dialog open={openModel} onClose={modelClose} className="relative z-50">
//       <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex min-h-full items-center justify-center p-4">
//           <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
//             <div className="absolute top-0 right-0 pt-4 pr-4">
//               <button
//                 type="button"
//                 className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
//                 onClick={modelClose}
//               >
//                 <span className="sr-only">Close</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="bg-white px-6 py-6">
//               <div className="text-center sm:text-left">
//                 <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-1">
//                   Withdrawal Request
//                 </h3>
//                 <div className="flex items-center">
//                   <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                     Available Balance: ${maxAmount}
//                   </div>
//                   <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                     Amount Limit: ${totalLimit}
//                   </div>
//                   <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                     withdraw: ${totalWithdrawal}
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   {!isMpinRequested ? (
//                     <div className="space-y-6">
//                       <div className="bg-blue-50 p-4 rounded-md">
//                         <div className="flex">
//                           <div className="flex-shrink-0">
//                             <svg
//                               className="h-5 w-5 text-blue-400"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </div>
//                           <div className="ml-3 flex-1 md:flex md:justify-between">
//                             <p className="text-sm text-blue-700">
//                               Minimum Withdrawal: $35 Admin Fee: 10% Processing
//                               Time: 24-48 Hours
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="amount"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Withdrawal Amount
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <span className="text-gray-500 sm:text-sm">$</span>
//                           </div>
//                           <input
//                             type="number"
//                             name="amount"
//                             id="amount"
//                             className="focus:ring-indigo-500 py-3 border focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
//                             placeholder="0.00"
//                             aria-describedby="amount-currency"
//                             onChange={handleChange}
//                             min={10}
//                             step={10}
//                             max={maxAmount}
//                           />
//                           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                             <span
//                               className="text-gray-500 sm:text-sm"
//                               id="amount-currency"
//                             >
//                               USD
//                             </span>
//                           </div>
//                         </div>
//                         {errorMessage && (
//                           <p className="mt-2 text-sm text-red-600">
//                             {errorMessage}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <button
//                           type="button"
//                           className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                             values.amount
//                               ? "bg-indigo-600 hover:bg-indigo-700"
//                               : "bg-indigo-300"
//                           } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
//                           onClick={requestMpin}
//                           disabled={!values.amount}
//                         >
//                           Proceed to Verification
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       <div className="bg-yellow-50 p-4 rounded-md">
//                         <div className="flex">
//                           <div className="flex-shrink-0">
//                             <svg
//                               className="h-5 w-5 text-yellow-400"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </div>
//                           <div className="ml-3">
//                             <p className="text-sm text-yellow-700">
//                               Please enter your 6-digit M-PIN to complete your
//                               withdrawal of ${values.amount}.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="mpin"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           M-PIN Verification
//                         </label>
//                         <div className="mt-1">
//                           <input
//                             type="password"
//                             name="mpin"
//                             id="mpin"
//                             className="focus:ring-indigo-500 p-3 border focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                             placeholder="Enter your 6-digit M-PIN"
//                             value={mpin}
//                             onChange={(e) => setMpin(e.target.value)}
//                             maxLength={6}
//                           />
//                         </div>
//                       </div>

//                       {errorMessage && (
//                         <div className="rounded-md bg-red-50 p-4">
//                           <div className="flex">
//                             <div className="flex-shrink-0">
//                               <svg
//                                 className="h-5 w-5 text-red-400"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </div>
//                             <div className="ml-3">
//                               <h3 className="text-sm font-medium text-red-800">
//                                 {errorMessage}
//                               </h3>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div>
//                         <button
//                           type="button"
//                           className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                             mpin.length === 6 && !loading
//                               ? "bg-green-600 hover:bg-green-700"
//                               : "bg-green-300"
//                           } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
//                           onClick={verifyAndSubmit}
//                           disabled={mpin.length !== 6 || loading}
//                         >
//                           {loading ? (
//                             <span className="flex items-center">
//                               <Spinner />
//                               <span className="ml-2">Processing...</span>
//                             </span>
//                           ) : (
//                             "Complete Withdrawal"
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-center">
//                         <button
//                           type="button"
//                           className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
//                           onClick={() => setIsMpinRequested(false)}
//                         >
//                           Go back and change amount
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }








import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUser } from "../redux/userSlice";
import {
  addWithdrawal
} from "../redux/withdrawalSlice";
import { sendOTP, verifyOTP, clearOtpErrors, clearOtpMessage } from "../redux/otpSlice";

// Function to calculate maximum withdrawal amount
export const calculateMaxWithdrawal = (
  user,
  transactions,
  currentDate,
  dispatch
) => {
  // Constants
  const MAX_SINGLE_WITHDRAWAL = 50; // Maximum amount per single withdrawal
  const EARNING_MULTIPLIER = 4; // User can earn active_plan * 4
  const WITHDRAWAL_PERCENTAGE = 0.5; // Can withdraw up to 50% of total limit

  // Calculate the total earnings potential based on active plan
  const totalLimit = user.active_plan * EARNING_MULTIPLIER;

  // Calculate maximum withdrawable amount (50% of total limit)
  const maxWithdrawableTotal = totalLimit * WITHDRAWAL_PERCENTAGE;

  // Calculate six months from some reference date (assuming user registration or plan start date)
  const planStartDate = new Date(
    user.plan_start_date || user.registration_date
  );
  const sixMonthsLater = new Date(planStartDate);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  // Calculate total withdrawals made so far (only count successful ROI withdrawals)
  const totalWithdrawals = transactions
    .filter((item) => item.status !== "decline")
    .reduce((acc, item) => acc + (item.amount || 0) + (item.deduction || 0), 0);

  // Calculate remaining available withdrawal limit
  const remainingWithdrawalLimit = Math.max(
    0,
    maxWithdrawableTotal - totalWithdrawals
  );

  // Determine maximum withdrawal amount for this transaction
  // It cannot exceed MAX_SINGLE_WITHDRAWAL (50), the remaining limit, or the user's actual balance
  let availableForWithdrawal = Math.min(
    // Added missing constant usage
    remainingWithdrawalLimit,
    user.working // Cannot withdraw more than actual balance
  );

  return {
    canWithdrawFullBalance: true,
    maxAmount: availableForWithdrawal,
    remainingLimit: remainingWithdrawalLimit,
    alreadyWithdrawn: totalWithdrawals,
    totalLimit: totalLimit,
    remainingFromTotal: totalLimit - totalWithdrawals
  };
};

export default function UserWithdrawalModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, otpErr, success } = useSelector((state) => state.otp);
  const { singleuser } = useSelector((state) => state.allusers);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const [values, setValues] = useState({});
  const [check, setCheck] = useState(null);
  const [maxAmount, setMaxAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingBalance, setRemainingTotal] = useState(0);
  const [totalWithdrawal, setTotalWithdrwal] = useState(0);
  const [totalLimit, setTotalLimit] = useState(0);
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [otp, setOtp] = useState("");

  // Calculate wallet balance and determine withdrawal permissions
  useEffect(() => {
    dispatch(getUser(auth?.id));
    if (singleuser && singleWithdrawal) {
      const currentDate = new Date();
      // const result = calculateMaxWithdrawal(
      //   singleuser,
      //   singleWithdrawal,
      //   currentDate,
      //   dispatch
      // );
      // setCheck(result.canWithdrawFullBalance);
      setMaxAmount(singleuser?.working);
      // Track and display the remaining total they can earn
      // setRemainingTotal(result.remainingFromTotal);
      // setTotalWithdrwal(result.alreadyWithdrawn);
      // setTotalLimit(result.remainingLimit);
    }
  }, [dispatch, auth?.id, singleuser, singleWithdrawal]);

  // Handle OTP errors and success messages
  useEffect(() => {
    if (otpErr) {
      const errorInterval = setInterval(() => {
        dispatch(clearOtpErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
 
    if (success) {
      const messageInterval = setInterval(() => {
        dispatch(clearOtpMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, otpErr, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const requestOTP = async () => {
    // if (values.amount > maxAmount) {
    //   return window.alert("Amount exceeds Maximum Amount");
    // }
    // if (values.amount < 10) {
    //   return window.alert("Amount should be greater than 10");
    // }
    // if (values.amount % 10 !== 0) {
    //   return window.alert("Amount should be multiple of 10");
    // }
    dispatch(sendOTP({ userId: auth?.id, email: singleuser?.email }));
    setIsOTPRequested(true);
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(verifyOTP({ userId: auth?.id, otp }));
      if (response?.payload?.success) {
        console.log("Verification succeeded");
        const allValues = {
          ...values,
          user_id: auth?.id,
          check: check,
        };
        modelClose();
        await dispatch(addWithdrawal({ values: allValues }));
      } else {
        console.log("Verification failed");
      }
    } catch (error) {
      console.error("An error occurred during verification:", error);
    }
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={modelClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-white px-6 py-6">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-1">
                  Withdrawal Request
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Available Balance: ${maxAmount}
                  </div>
                </div>
                    
                <div className="mt-6">
                  {!isOTPRequested ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">
                              Minimum Withdrawal: $35 Admin Fee: 10% Processing
                              Time: 24-48 Hours
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            className="focus:ring-indigo-500 py-3 border focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            aria-describedby="amount-currency"
                            onChange={handleChange}
                            min={10}
                            step={10}
                            max={maxAmount}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="amount-currency"
                            >
                              USD
                            </span>
                          </div>
                        </div>
                        {errorMessage && (
                          <p className="mt-2 text-sm text-red-600">
                            {errorMessage}
                          </p>
                        )}
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={!values.amount}
                          className="w-full mt-4 p-2 bg-gray-800 hover:bg-gray-900 text-white rounded disabled:opacity-50"
                          onClick={requestOTP}
                        >
                          Request OTP
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full mb-4">
                        <label
                          htmlFor="otp"
                          className="absolute -top-2 left-2 bg-black px-1 text-xs font-medium text-gray-300"
                        >
                          OTP
                        </label>
                        <input
                          id="otp"
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={handleOTPChange}
                          required
                          className="block w-full p-4 rounded-md border-0 text-gray-300 bg-black shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={otp.length !== 6 || loading}
                        className="w-full mt-4 p-2 bg-gray-800 hover:bg-gray-900 text-white rounded disabled:opacity-50"
                        onClick={verifyAndSubmit}
                      >
                        {loading ? <Spinner /> : "Submit Withdrawal"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}