import {
  clearErrors,
  clearMessage,
  addROIWithdrawal,
  getAllWithdrawalByid,
} from "../redux/withdrawalSlice";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUser } from "../redux/userSlice";
import { calculateMaxWithdrawal } from "./UserWithdrawalModel";

export default function ROIWithdrawalConfirmation({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { singleuser } = useSelector((state) => state.allusers);
  const [values, setValues] = useState({});
  const [isMPINRequested, setIsMPINRequested] = useState(false);
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxAmount, setMaxAmount] = useState(null);
  const [principle, setPrinciple] = useState(false);

  useEffect(() => {
    dispatch(getUser(auth?.id));
    dispatch(getAllWithdrawalByid(auth?.id));

    if (error) {
      const errorInterval = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(errorInterval);
    }
  }, [dispatch, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMPINChange = (e) => {
    setMpin(e.target.value);
  };

  const proceedToMPIN = async () => {
    if (values.amount > maxAmount) {
      return window.alert("Amount exceeds Maximum Amount");
    }
    if (values.amount < 30) {
      return window.alert("Amount should be greater than $30");
    }
    // if (values.amount % 10 !== 0) {
    //   return window.alert("Amount should be a multiple of 10");
    // }
    setIsMPINRequested(true);
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify MPIN
      if (Number(mpin) === singleuser?.mpin) {
        const allValues = {
          ...values,
          user_id: auth?.id,
        };

        modelClose();
        await dispatch(addROIWithdrawal({ values: allValues }));
      } else {
        setError("Wrong MPIN! Please try again.");
      }
    } catch (err) {
      setError("An error occurred during verification");
      console.error("An error occurred:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleuser) {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const pastDays = Math.ceil(
        (currentDate - startOfMonth) / (1000 * 60 * 60 * 24)
      );

      const roiDayIncome = singleuser?.roi_day * pastDays;
      let adjustedIncome = singleuser?.non_working - roiDayIncome;

      const result = calculateMaxWithdrawal(
        singleuser,
        singleWithdrawal,
        currentDate,
        dispatch
      );

      adjustedIncome =- result.maxAmount;

      setMaxAmount(adjustedIncome > 0 ? adjustedIncome : 0);
    }
  }, [singleuser, singleWithdrawal]);

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
                    Rent Withdrawal
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
                    Your Withdrawable Rent Amount:{" "}
                    <span className="font-bold">${maxAmount}</span>
                  </p>
                </div>

                {!isMPINRequested ? (
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
                        placeholder="Enter amount"
                        onChange={handleChange}
                        required
                        min={10}
                        step={10}
                        max={maxAmount}
                        className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                      <p className="text-amber-700 text-sm">
                        <span className="font-bold">Note:</span> The minimum
                        withdrawal amount is $30, and there is an admin charge
                        of 5%. Withdrawals are processed within 72 hours.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!values.amount}
                      className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
                      bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={proceedToMPIN}
                    >
                      Proceed to Verification
                    </button>
                  </form>
                ) : (
                  <form className="space-y-6">
                    <div className="rounded-md bg-gray-50 p-4 mb-4">
                      <p className="text-gray-700">
                        Withdrawal Amount:{" "}
                        <span className="font-bold text-blue-600">
                          ${parseFloat(values.amount).toFixed(2)}
                        </span>
                      </p>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="mpin"
                        className="block text-sm font-medium leading-6 text-gray-700 mb-2"
                      >
                        Enter your MPIN to confirm
                      </label>
                      <input
                        id="mpin"
                        type="password"
                        name="mpin"
                        placeholder="Enter your MPIN"
                        value={mpin}
                        onChange={handleMPINChange}
                        required
                        className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        className="w-1/3 py-3 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => setIsMPINRequested(false)}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!mpin || loading}
                        className="w-2/3 py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
                        onClick={verifyAndSubmit}
                      >
                        {loading ? <Spinner /> : "Confirm Withdrawal"}
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
