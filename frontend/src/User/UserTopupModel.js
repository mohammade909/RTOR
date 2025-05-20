// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../BaseFile/comman/Spinner";
// import { getUserbyemail } from "../redux/userSlice";
// import UserEntryFeeConfirmation from "./UserEntryFeeConfirmation";
// import { addTopup,  clearErrors, clearMessage,} from "../redux/topupSlice";
// export default function UserTopupModel({ openModel, modelClose }) {
//   const dispatch = useDispatch();
//   const { allplans } = useSelector((state) => state.allplans);
//   const { emailuser } = useSelector((state) => state.allusers);
//   const { auth } = useSelector((state) => state.auth);
//   const { loading, error, message } = useSelector((state) => state.alltopup);
//   const [investment_amount, setInvestment_amount] = useState(null);
//   const [amount, setAmount] = useState();
//   const [plan, setPlan] = useState();
//   const [userby, setUserby] = useState(auth?.refferal_code);
//   const [entryPlanModel, setEntryPlanModel] = useState(false);

//   useEffect(() => {
//       if (userby ) {
//         dispatch(getUserbyemail(userby));
//       }
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
// }, [dispatch, error, message ,auth?.id,userby]);

//   const handleSaveChanges = (e) => {
//     if (amount < 50 && plan?.id==2) {
//       alert(`Amount must be greater than 50`);
//       return;
//     }
//     e.preventDefault();
//     const form = e.target.closest("form");
//     if (form.checkValidity()) {
//       const allValues = {
//         userby_id: auth?.id,
//         userto_id: emailuser?.id,
//         investment_amount:plan?.id==1 ? 20 : amount,
//         id:plan?.id,
//       };
//       dispatch(addTopup({ values: allValues }));
//       modelClose()
//     } else {
//       form.reportValidity();
//     }
//   };
//   function handleEntryPlan(){
//     setEntryPlanModel(true)
//   }
//   const isClose = () => {
//     // setModalOpen(false);
//     setEntryPlanModel(false)

//   };
//   return (
//     <Dialog open={openModel} onClose={modelClose} className="relative z-50">
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//       />

//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className="relative transform overflow-hidden rounded-lg text-gray-900 bg-white border px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//           >
//             <div>
//               <div className="p-5">
//                 <div className="flex items-center justify-between py-4">
//                   <h2 className="mb-5 text-xl font-semibold ">
//                     Top-Up form
//                   </h2>
//                   <button onClick={modelClose} className="">
//                   <div class="group flex  cursor-pointer items-center justify-center mb-2 h-12 px-2 w-12">
//                     <div class="space-y-2">
//                       <span class="block h-1 w-10 origin-center rounded-full bg-blue-800 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
//                       <span class="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
//                     </div>
//                   </div>
//                   </button>
//                 </div>
//                 <form className="">
//               <div className="w-full ">
//                 <div className="mb-4 ">
//                   <label className="block text-lg font-medium ">
//                     User
//                   </label>
//                   <input
//                     type="text"
//                     name="email"
//                     value={userby}
//                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm "
//                     placeholder="type user E-Mail . . ."
//                     onChange={(e) => setUserby(e.target.value)}
//                   />
//                   <p
//                     className={
//                       emailuser?.username ? "text-green-500" : "text-red-500"
//                     }
//                   >
//                     {emailuser?.username
//                       ? emailuser.username
//                       : "Provide user email"}
//                   </p>
//                 </div>

//                 <div className="mb-4">
//                       <label className="block text-lg font-medium ">
//                         Plan
//                       </label>

//                       <select
//                         name="id"
//                         className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm "
//                         onChange={(e) => {
//                           const selectedPlan =
//                             allplans[e.target.selectedIndex - 1];
//                           setPlan(selectedPlan);
//                         }}
//                         required
//                       >
//                         <option value="">Select a plan</option>
//                         {allplans?.filter((item)=>item?.name!=="entry bot")?.map((plan, index) => (
//                           <option key={index} value={plan.id}>
//                             {plan.name} - ${plan.monthly_price} Activation Plan
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="mb-4">
//                       <label className="block text-lg font-medium ">
//                         Amount
//                       </label>
//                       <input
//                         type="number"
//                         name="amount"
//                         value={amount}
//                         required
//                         disabled={plan?.id==1 ? true:false}
//                          min="50"
//                         step="50"
//                         className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm "
//                         placeholder="Enter your Amount . . ."
//                         onChange={(e) => setAmount( e.target.value)}
//                       />
//                     </div>
//                 <div className="flex items-center justify-center pb-4 ">
//                   <button
//                     type="submit"
//                     disabled={!emailuser} // Disable if emailuser is falsy
//                     onClick={handleSaveChanges}
//                     className={`px-4 py-2 rounded text-white focus:outline-none w-full mt-3 border bg-green-800 hover:bg-gray-900 ${
//                       emailuser
//                         ? "bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 " // Styles for the enabled state
//                         : "bg-gray-400 cursor-not-allowed" // Styles for the disabled state
//                     }`}
//                   >
//                     {loading ? <Spinner /> : "Transfer"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//               </div>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//       {entryPlanModel && (
//               <UserEntryFeeConfirmation
//                 isclose={isClose}
//                 userby_id={auth?.id}
//                 user_id={emailuser?.id}
//               />
//             )}
//     </Dialog>
//   );
// }
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUser, getUserbyemail } from "../redux/userSlice";
import { getAllPlans } from "../redux/planSlice";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import Loader from "../BaseFile/comman/Loader";
import { addTopup, clearErrors, clearMessage } from "../redux/topupSlice";

export default function UserRetopupModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { allplans } = useSelector((state) => state.allplans);
  const { emailuser, singleuser } = useSelector((state) => state.allusers);
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.alltopup);

  const [userby, setUserby] = useState();
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getUser(auth?.id));

    if (userby && userby !== auth?.email) {
      dispatch(getUserbyemail(userby));
    }

    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
        window.location.reload();
      }, 3000);
      return () => clearInterval(errorInterval);
    }

    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
     
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message, auth?.id, userby]);

  // Get the available plans based on user's activation status
  const getAvailablePlans = () => {
    // If user is not active, only show entry plan (id: 4)
    if (singleuser?.is_active !== "active") {
      return allplans.filter(plan => plan.id === 4);
    }
    
    // If user is active, show all plans except entry plan,
    // but only plans higher than the user's current active plan
    const userActivePlanPrice = auth?.active_plan?.monthly_price || 0;
    return allplans.filter(plan => 
      plan.id !== 4 && plan.monthly_price > userActivePlanPrice
    );
  };

  const validatePlanSelection = (selectedPlan) => {
    if (!selectedPlan) {
      setValidationError("Please select a plan");
      return false;
    }

    // If user is active, ensure the selected plan is greater than current plan
    if (singleuser?.is_active === "active") {
      const userActivePlanPrice = auth?.active_plan?.monthly_price || 0;
      if (selectedPlan.monthly_price <= userActivePlanPrice) {
        setValidationError(
          "Selected plan must be greater than your current active plan"
        );
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handlePlanChange = (e) => {
    if (e.target.value === "") {
      setPlan(null);
      return;
    }

    const selectedPlanId = parseInt(e.target.value, 10);
    const selectedPlan = allplans.find(p => p.id === selectedPlanId);
    
    if (selectedPlan) {
      setPlan(selectedPlan);
      validatePlanSelection(selectedPlan);
    } else {
      setPlan(null);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!plan) {
      setValidationError("Please select a plan");
      return;
    }

    if (!validatePlanSelection(plan)) {
      return;
    }

    if (!amount) {
      setValidationError("Please enter an investment amount");
      return;
    }

    // Convert amount to a number for proper comparison
    const numAmount = Number(amount);

    // Check if investment amount is at least equal to the selected plan's monthly price
    if (numAmount < plan.monthly_price) {
      setValidationError(
        `Investment amount must be at least $${plan.monthly_price} to qualify for this plan`
      );
      return;
    }

    // Check if investment amount is within plan limits
    if (numAmount < plan.min) {
      setValidationError(`Amount must be at least $${plan.min}`);
      return;
    }
    
    if (plan.max !== null && numAmount > plan.max) {
      setValidationError(`Amount cannot exceed $${plan.max}`);
      return;
    }

    if (!termsAccepted) {
      setValidationError("You must accept the terms and conditions");
      return;
    }

    const form = e.target.closest("form");
    if (form.checkValidity()) {
      const allValues = {
        userby_id: auth?.id,
        id: plan?.id,
        investment_amount: amount,
        userto_id: auth?.id,
      };

      dispatch(addTopup({ values: allValues }));
      modelClose();
    } else {
      form.reportValidity();
    }
  };

  // Get available plans for display in dropdown
  const availablePlans = getAvailablePlans();

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />

      <Dialog open={openModel} onClose={modelClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all max-w-lg w-full mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                  <button
                    onClick={modelClose}
                    className="rounded-full bg-white bg-opacity-20 p-1 hover:bg-opacity-30 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-blue-100">
                  Take your experience to the next level
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <form className="space-y-6">
                  {validationError && (
                    <div
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <span className="block sm:inline">{validationError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Upgrade Plan
                    </label>
                    <div className="relative">
                      <select
                        name="id"
                        className="block w-full px-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        onChange={handlePlanChange}
                        value={plan?.id || ""}
                        required
                      >
                        <option value="">Choose a plan</option>
                        {availablePlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.monthly_price} Activation Plan
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {plan && (
                      <div className="mt-1 text-sm text-gray-600">
                        Required investment: At least ${plan.monthly_price}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount
                    </label>
                    <div
                      className={`relative rounded-lg shadow-md transition-all duration-200 ${
                        isFocused
                          ? "ring-2 ring-blue-500 border-blue-500"
                          : "border border-gray-300"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span
                          className={`text-xl font-semibold ${
                            isFocused ? "text-blue-500" : "text-gray-500"
                          }`}
                        >
                          $
                        </span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        required
                        min={plan?.monthly_price || "100"}
                        max={plan?.max || ""}
                        className="block w-full pl-8 pr-16 py-4 text-lg font-medium border-0 focus:ring-0 focus:outline-none rounded-lg bg-gray-50"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span
                          className={`text-sm font-medium ${
                            isFocused ? "text-blue-500" : "text-gray-500"
                          }`}
                        >
                          USD
                        </span>
                      </div>
                    </div>
                    {plan && (
                      <div className="mt-2 flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          Min: ${Math.max(plan.min, plan.monthly_price)}{" "}
                          {plan.max && `• Max: $${plan.max}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="text-sm text-gray-600 h-28 overflow-y-auto mb-2 pr-2">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Terms and Conditions
                      </h4>
                      <p className="mb-2">
                        By proceeding with this top-up, you agree to the
                        following:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Your investment amount is subject to the selected
                          plan's terms.
                        </li>
                        <li>
                          Upgrades must be to a higher plan than your current
                          one.
                        </li>
                        <li>
                          The minimum investment must meet or exceed the plan's
                          monthly price.
                        </li>
                        <li>
                          Funds will be available according to the plan's
                          schedule.
                        </li>
                        <li>
                          All transactions are final and subject to our refund
                          policy.
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={() => setTermsAccepted(!termsAccepted)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="terms"
                          className="font-medium text-gray-700"
                        >
                          I accept the Terms and Conditions
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        loading || !termsAccepted
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                      onClick={handleSaveChanges}
                      disabled={loading || !termsAccepted}
                    >
                      {loading ? <Spinner /> : "Confirm Upgrade"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
} 