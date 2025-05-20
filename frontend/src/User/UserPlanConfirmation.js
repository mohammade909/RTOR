import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { 
  CheckCircleIcon, 
  InformationCircleIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { addTopup, clearErrors, clearMessage } from "../redux/topupSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserPlanConfirmation({ isclose, plan, user_id }) {
  const [open, setOpen] = useState(true);
  const [amount, setAmount] = useState(plan?.monthly_price || 0);
  const [error, setValidationError] = useState("");
  const dispatch = useDispatch();
  const { error: apiError, message } = useSelector((state) => state.alltopup);
  
  const minAmount = plan?.min_price || 0;
  const maxAmount = plan?.max_price || 10000;

  useEffect(() => {
    if (apiError) {
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
  }, [dispatch, apiError, message]);

  const validateAmount = (value) => {
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      setValidationError("Please enter a valid number");
      return false;
    }
    
    if (numValue < minAmount) {
      setValidationError(`Amount must be at least ${minAmount}`);
      return false;
    }
    
    if (numValue > maxAmount) {
      setValidationError(`Amount cannot exceed ${maxAmount}`);
      return false;
    }
    
    if (numValue % 100 !== 0) {
      setValidationError("Amount must be in multiples of 100");
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    if (!validateAmount(amount)) {
      return;
    }
    
    const allValues = {
      id: plan?.id,
      userby_id: user_id,
      userto_id: user_id,
      amount: plan?.monthly_price,
    };
    
    dispatch(addTopup({ values: allValues }));
    isclose();
  };

  return (
    <Dialog open={open} onClose={isclose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-gradient-to-b from-blue-50 to-white px-6 py-6">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <CheckCircleIcon className="h-10 w-10 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              
              <div className="text-center">
                <DialogTitle as="h3" className="text-xl font-bold text-gray-900">
                  Confirm Plan Purchase
                </DialogTitle>
                
                <div className="mt-4">
                  <p className="text-gray-600">
                    You're about to purchase the <span className="font-semibold text-blue-600">{plan?.name}</span> plan
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveChanges} className="mt-6">
                <div className="space-y-6">
                  <div>
                    {/* <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Customize Amount
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="block w-full rounded-md border-gray-300 pl-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter amount"
                      />
                    </div> */}
                    
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    
                    <div className="mt-3 flex items-start">
                      <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-500">
                          Amount must be between ${plan?.min} and ${plan?.max}, in multiples of $100.
                        </p>
                      </div>
                    </div>
                  </div>

                  {apiError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm text-red-700">{apiError}</p>
                    </div>
                  )}
                  
                  {message && (
                    <div className="rounded-md bg-green-50 p-4">
                      <p className="text-sm text-green-700">{message}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row-reverse gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Confirm Purchase
                    </button>
                    <button
                      type="button"
                      onClick={isclose}
                      className="inline-flex w-full justify-center rounded-md bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}