// import {
//   clearErrors,
//   clearMessage,
//   addROIWithdrawal,
//   getAllWithdrawalByid,
// } from "../redux/withdrawalSlice";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../BaseFile/comman/Spinner";
// import { getUser } from "../redux/userSlice";

// export default function PrincipleWithdrawal({ openModel, modelClose }) {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
//   const { singleuser } = useSelector((state) => state.allusers);
//   const [values, setValues] = useState({});
//   const [isMPINRequested, setIsMPINRequested] = useState(false);
//   const [mpin, setMpin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [maxAmount, setMaxAmount] = useState(null);
//   const [principle, setPrinciple] = useState(false);

//   useEffect(() => {
//     dispatch(getUser(auth?.id));
//     dispatch(getAllWithdrawalByid(auth?.id));

//     if (error) {
//       const errorInterval = setTimeout(() => {
//         setError("");
//       }, 3000);
//       return () => clearTimeout(errorInterval);
//     }
//   }, [dispatch, error]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleMPINChange = (e) => {
//     setMpin(e.target.value);
//   };

//   const proceedToMPIN = async () => {
//     if (values.amount > maxAmount) {
//       return window.alert("Amount exceeds Maximum Amount");
//     }
//     // if (values.amount < 30) {
//     //   return window.alert("Amount should be greater than $30");
//     // }
//     // if (values.amount % 10 !== 0) {
//     //   return window.alert("Amount should be a multiple of 10");
//     // }
//     setIsMPINRequested(true);
//   };

//   const verifyAndSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Verify MPIN
//       if (Number(mpin )=== singleuser?.mpin) {
//         const allValues = {
//           ...values,
//           user_id: auth?.id,
//         };
        
//         modelClose();
//         await dispatch(addROIWithdrawal({ values: allValues }));
//       } else {
//         setError("Wrong MPIN! Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred during verification");
//       console.error("An error occurred:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
  

//     setMaxAmount(singleuser?.compound_income);
//   }, [singleuser, principle]);

//   return (
//     <>
//       <Dialog open={openModel} onClose={modelClose} className="relative z-50">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//         />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <DialogPanel
//               transition
//               className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//             >
//               <div className="p-5">
//                 <div className="py-4 flex justify-between items-center border-b border-gray-200 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     Principle Withdrawal
//                   </h2>
//                   <button onClick={modelClose}>
//                     <div className="group flex cursor-pointer items-center justify-center">
//                       <div className="space-y-2">
//                         <span className="block h-1 w-10 origin-center rounded-full bg-gray-400 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
//                         <span className="block h-1 w-8 origin-center rounded-full bg-blue-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
                
//                 <div className="bg-blue-50 p-4 rounded-lg mb-6">
//                   <p className="text-blue-800 font-medium text-sm">
//                     Your Withdrawable Amount: <span className="font-bold">${maxAmount}</span>
//                   </p>
//                 </div>

//                 {!isMPINRequested ? (
//                   <form className="space-y-6">
//                     <div className="relative">
//                       <label
//                         htmlFor="amount"
//                         className="block text-sm font-medium leading-6 text-gray-700 mb-2"
//                       >
//                         Amount
//                       </label>
//                       <input
//                         id="amount"
//                         type="number"
//                         name="amount"
//                         placeholder="Enter amount"
//                         onChange={handleChange}
//                         required
//                         min={10}
//                         step={10}
//                         max={maxAmount}
//                         className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
//                       <p className="text-amber-700 text-sm">
//                         <span className="font-bold">Note:</span> The minimum withdrawal amount is $30, and there is an admin charge of 5%. Withdrawals are processed within 72 hours.
//                       </p>
//                     </div>
                    
//                     <button
//                       type="button"
//                       disabled={!values.amount}
//                       className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
//                       bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                       disabled:bg-gray-300 disabled:cursor-not-allowed"
//                       onClick={proceedToMPIN}
//                     >
//                       Proceed to Verification
//                     </button>
//                   </form>
//                 ) : (
//                   <form className="space-y-6">
//                     <div className="rounded-md bg-gray-50 p-4 mb-4">
//                       <p className="text-gray-700">
//                         Withdrawal Amount: <span className="font-bold text-blue-600">${parseFloat(values.amount).toFixed(2)}</span>
//                       </p>
//                     </div>
                    
//                     <div className="relative">
//                       <label
//                         htmlFor="mpin"
//                         className="block text-sm font-medium leading-6 text-gray-700 mb-2"
//                       >
//                         Enter your MPIN to confirm
//                       </label>
//                       <input
//                         id="mpin"
//                         type="password"
//                         name="mpin"
//                         placeholder="Enter your MPIN"
//                         value={mpin}
//                         onChange={handleMPINChange}
//                         required
//                         className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     {error && (
//                       <div className="rounded-md bg-red-50 p-4">
//                         <p className="text-red-600 text-sm">{error}</p>
//                       </div>
//                     )}
                    
//                     <div className="flex space-x-4">
//                       <button
//                         type="button"
//                         className="w-1/3 py-3 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                         onClick={() => setIsMPINRequested(false)}
//                       >
//                         Back
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={!mpin || loading}
//                         className="w-2/3 py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
//                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                         disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
//                         onClick={verifyAndSubmit}
//                       >
//                         {loading ? <Spinner /> : "Confirm Withdrawal"}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// }


// import {
//   clearErrors,
//   clearMessage,

//   getAllWithdrawalByid,
//   WithdrawalPrinciple,
// } from "../redux/withdrawalSlice";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../BaseFile/comman/Spinner";
// import { getUser } from "../redux/userSlice";

// export default function PrincipleWithdrawal({ openModel, modelClose }) {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
//   const { singleuser } = useSelector((state) => state.allusers);
//   const [values, setValues] = useState({
    
//   });
//   const [isMPINRequested, setIsMPINRequested] = useState(false);
//   const [mpin, setMpin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [maxAmount, setMaxAmount] = useState(null);
//   const [principle, setPrinciple] = useState(false);
//   const [acknowledged, setAcknowledged] = useState(false);

//   useEffect(() => {
//     dispatch(getUser(auth?.id));
//     dispatch(getAllWithdrawalByid(auth?.id));

//     if (error) {
//       const errorInterval = setTimeout(() => {
//         setError("");
//       }, 3000);
//       return () => clearTimeout(errorInterval);
//     }
//   }, [dispatch, error]);


//   const handleMPINChange = (e) => {
//     setMpin(e.target.value);
//   };

//   const proceedToMPIN = async () => {
//     if (values.amount > maxAmount) {
//       return window.alert("Amount exceeds Maximum Amount");
//     }
//     // if (values.amount < 30) {
//     //   return window.alert("Amount should be greater than $30");
//     // }
//     // if (values.amount % 10 !== 0) {
//     //   return window.alert("Amount should be a multiple of 10");
//     // }
//     setIsMPINRequested(true);
//   };

//   const verifyAndSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Verify MPIN
//       if (Number(mpin) === singleuser?.mpin) {
//         const allValues = {
//           ...values,
//           amount:maxAmount,
//           user_id: auth?.id,
//         };
        
//         modelClose();
//         await dispatch(WithdrawalPrinciple({ values: allValues }));
//       } else {
//         setError("Wrong MPIN! Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred during verification");
//       console.error("An error occurred:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setMaxAmount(singleuser?.business);
//   }, [singleuser, principle]);

//   return (
//     <>
//       <Dialog open={openModel} onClose={modelClose} className="relative z-50">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//         />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <DialogPanel
//               transition
//               className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//             >
//               <div className="p-5">
//                 <div className="py-4 flex justify-between items-center border-b border-gray-200 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     Principle Withdrawal
//                   </h2>
//                   <button onClick={modelClose}>
//                     <div className="group flex cursor-pointer items-center justify-center">
//                       <div className="space-y-2">
//                         <span className="block h-1 w-10 origin-center rounded-full bg-gray-400 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
//                         <span className="block h-1 w-8 origin-center rounded-full bg-blue-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
                
//                 <div className="bg-blue-50 p-4 rounded-lg mb-6">
//                   <p className="text-blue-800 font-medium text-sm">
//                     Your Withdrawable Amount: <span className="font-bold">${maxAmount}</span>
//                   </p>
//                 </div>

//                 {!isMPINRequested ? (
//                   <form className="space-y-6">
//                     <div className="relative">
//                       <label
//                         htmlFor="amount"
//                         className="block text-sm font-medium leading-6 text-gray-700 mb-2"
//                       >
//                         Amount
//                       </label>
//                       <input
//                         id="amount"
//                         type="number"
//                         name="amount"
//                         disabled
//                         placeholder="Enter amount"
//                         value={maxAmount}
//                         required
//                         min={10}
//                         step={10}
//                         max={maxAmount}
//                         className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                
//                     <div className="bg-red-50 border border-red-200 p-4 rounded-md">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0">
//                           <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-red-800">Important Warning</h3>
//                           <div className="mt-2 text-sm text-red-700">
//                             <p>Withdrawing principle amount has the following consequences:</p>
//                             <ul className="list-disc space-y-1 pl-5 mt-1">
//                               <li>Your account will become <strong>inactive</strong></li>
//                               <li>25% admin charges will be deducted</li>
//                               <li>You will not receive any trade income or commissions</li>
//                               <li>To restore benefits, you will need to purchase a new plan</li>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-4 flex items-center">
//                         <input
//                           id="acknowledge"
//                           name="acknowledge"
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                           onChange={() => setAcknowledged(!acknowledged)}
//                         />
//                         <label htmlFor="acknowledge" className="ml-2 block text-sm text-gray-700">
//                           I understand and accept these conditions
//                         </label>
//                       </div>
//                     </div>
                    
//                     <button
//                       type="button"
//                       disabled={!acknowledged}
//                       className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
//                       bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                       disabled:bg-gray-300 disabled:cursor-not-allowed"
//                       onClick={proceedToMPIN}
//                     >
//                       Proceed to Verification
//                     </button>
//                   </form>
//                 ) : (
//                   <form className="space-y-6">
//                     <div className="rounded-md bg-gray-50 p-4 mb-4">
//                       <p className="text-gray-700">
//                         Withdrawal Amount: <span className="font-bold text-blue-600">${parseFloat(maxAmount).toFixed(2)}</span>
//                       </p>
//                       <p className="text-gray-700 mt-2">
//                         Admin Charge (25%): <span className="font-bold text-red-500">${(parseFloat(maxAmount) * 0.25).toFixed(2)}</span>
//                       </p>
//                       <p className="text-gray-700 mt-2">
//                         Net Amount: <span className="font-bold text-green-600">${(parseFloat(maxAmount) * 0.75).toFixed(2)}</span>
//                       </p>
//                     </div>
                    
//                     <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
//                       <p className="text-yellow-800 text-sm font-medium">
//                         By proceeding, you confirm that you understand your account will become inactive and you will not receive any benefits until you purchase a new plan.
//                       </p>
//                     </div>
                    
//                     <div className="relative">
//                       <label
//                         htmlFor="mpin"
//                         className="block text-sm font-medium leading-6 text-gray-700 mb-2"
//                       >
//                         Enter your MPIN to confirm
//                       </label>
//                       <input
//                         id="mpin"
//                         type="password"
//                         name="mpin"
//                         placeholder="Enter your MPIN"
//                         value={mpin}
//                         onChange={handleMPINChange}
//                         required
//                         className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     {error && (
//                       <div className="rounded-md bg-red-50 p-4">
//                         <p className="text-red-600 text-sm">{error}</p>
//                       </div>
//                     )}
                    
//                     <div className="flex space-x-4">
//                       <button
//                         type="button"
//                         className="w-1/3 py-3 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                         onClick={() => setIsMPINRequested(false)}
//                       >
//                         Back
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={!mpin || loading}
//                         className="w-2/3 py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
//                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                         disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
//                         onClick={verifyAndSubmit}
//                       >
//                         {loading ? <Spinner /> : "Confirm Withdrawal"}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// }



import {
  getAllWithdrawalByid,
  WithdrawalPrinciple,
  addROIWithdrawal
} from "../redux/withdrawalSlice";
import { sendOTP, verifyOTP,clearOtpErrors,clearOtpMessage } from "../redux/otpSlice"; 
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUser } from "../redux/userSlice";

export default function PrincipleWithdrawal({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { singleuser } = useSelector((state) => state.allusers);
  const { otpErr, success } = useSelector((state) => state.allwithdrawal);
  
  const [values, setValues] = useState({
    amount: 0
  });

  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxAmount, setMaxAmount] = useState(null);
  const [principle, setPrinciple] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    dispatch(getUser(auth?.id));
    dispatch(getAllWithdrawalByid(auth?.id));
    
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
  }, [dispatch, auth?.id, otpErr, success]);

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
    // if(values.amount > maxAmount) {
    //   return window.alert("Amount exceed Maximum Amount");
    // }
    // if(values.amount < 35 || maxAmount < 35) {
    //   return window.alert("Amount should be greater than 35.");
    // }
    // if(values.amount % 10 !== 0) {
    //   return window.alert("Amount should be multiple of 10");
    // }
    dispatch(sendOTP({ userId: auth?.id, email: singleuser?.email }));
    setIsOTPRequested(true);
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await dispatch(verifyOTP({ userId: auth?.id, otp }));
      if (response?.payload?.success) {
        const allValues = {
          amount:singleuser?.business,
          user_id: auth?.id,
        };
        modelClose(); 
        await dispatch(WithdrawalPrinciple({ values: allValues }));
      } else {
        setError("Verification failed");
        console.log("Verification failed");
      }
    } catch (error) {
      setError("An error occurred during verification");
      console.error("An error occurred during verification:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMaxAmount(singleuser?.business);
  }, [singleuser]);

  return (
    <>
      <Dialog open={openModel} onClose={modelClose} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="p-5">
                <div className="py-4 flex justify-between items-center border-b border-gray-200 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Principle Withdrawal
                  </h2>
                  <button onClick={modelClose}>
                    <div className="group flex cursor-pointer items-center justify-center">
                      <div className="space-y-2">
                        <span className="block h-1 w-10 origin-center rounded-full bg-gray-400 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                        <span className="block h-1 w-8 origin-center rounded-full bg-blue-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 font-medium text-sm">
                    Your Withdrawable Amount: <span className="font-bold">${singleuser?.business}</span>
                  </p>
                </div>

                {!isOTPRequested ? (
                  <form className="space-y-6">
                    <div className="relative">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium leading-6 text-gray-700 mb-2"
                      >
                        Amount
                      </label>
                      <input
                        id="amount"
                        type="number"
                        name="amount"
                        disabled
                        placeholder="Enter amount"
                        value={singleuser?.business}
                        required
                        min={10}
                        step={10}
                        max={singleuser?.business}
                        className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Important Warning</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>Withdrawing principle amount has the following consequences:</p>
                            <ul className="list-disc space-y-1 pl-5 mt-1">
                              <li>Your account will become <strong>inactive</strong></li>
                              <li>20% admin charges will be deducted</li>
                              <li>You will not receive any trade income or commissions</li>
                              <li>To restore benefits, you will need to purchase a new plan</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <input
                          id="acknowledge"
                          name="acknowledge"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={() => setAcknowledged(!acknowledged)}
                        />
                        <label htmlFor="acknowledge" className="ml-2 block text-sm text-gray-700">
                          I understand and accept these conditions
                        </label>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      disabled={!acknowledged}
                      className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
                      bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={requestOTP}
                    >
                      Proceed to Verification
                    </button>
                  </form>
                ) : (
                  <form className="space-y-6">
                    <div className="rounded-md bg-gray-50 p-4 mb-4">
                      <p className="text-gray-700">
                        Withdrawal Amount: <span className="font-bold text-blue-600">${parseFloat(maxAmount).toFixed(2)}</span>
                      </p>
                      <p className="text-gray-700 mt-2">
                        Admin Charge (20%): <span className="font-bold text-red-500">${(parseFloat(maxAmount) * 0.20).toFixed(2)}</span>
                      </p>
                      <p className="text-gray-700 mt-2">
                        Net Amount: <span className="font-bold text-green-600">${(parseFloat(maxAmount) * 0.80).toFixed(2)}</span>
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                      <p className="text-yellow-800 text-sm font-medium">
                        By proceeding, you confirm that you understand your account will become inactive and you will not receive any benefits until you purchase a new plan.
                      </p>
                    </div>
                    
                    <div className="relative w-full">
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
                    
                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={(otp.length !== 6 || loading)}
                        className="w-full mt-4 p-2 bg-gray-800 hover:bg-gray-900 text-white rounded"
                        onClick={verifyAndSubmit}
                      >
                        {loading ? <Spinner /> : "Submit Withdrawal"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}