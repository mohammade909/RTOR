import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUser } from "../redux/userSlice";
import { addWithdrawal, clearErrors, clearMessage } from "../redux/withdrawalSlice";
import CompoundConfirmation from "./CompoundConfirmation";

export default function UserWithdrawalModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.allwithdrawal);
  const { singleuser } = useSelector((state) => state.allusers);
  const [values, setValues] = useState({});
  const [compuntConfirmation, setCompuntConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getUser(auth?.id));
    if (error) {
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
  }, [dispatch, error, message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      const allValues = {
        ...values,
        user_id: auth?.id,
      };
      console.log(allValues);
      dispatch(addWithdrawal({ values: allValues }));
      modelClose();
    } else {
      form.reportValidity();
    }
  };
 const handleCompound= ()=>{
  setCompuntConfirmation(true);
  modelClose()
 }
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
            className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="p-5">
                <div className="py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-5 text-gray-300 ">
                    Withdrawal form (Your Wallet : {singleuser?.wallet})

                  </h2>
                  <button onClick={modelClose}>
                    <div className="group flex cursor-pointer items-center justify-center mb-2 ">
                      <div className="space-y-2">
                        <span className="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                        <span className="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                      </div>
                    </div>
                  </button>
                </div>
                <form>
                  <div className="relative w-full">
                    <label
                      htmlFor="amount"
                      className="absolute -top-2 left-2 inline-block bg-black px-1 text-xs font-medium text-gray-300"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      name="amount" 
                      placeholder="amount"
                      onChange={handleChange}
                      required
                      min='25'
                      max={singleuser?.wallet}
                      className="block w-full p-4 rounded-md border-0 py-1.5 text-gray-300 bg-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                    />
                  </div>
                  <p className="text-gray-200 text-[12px] mt-2">
                    T & B C: The minimum withdrawal amount is $25, and there is an admin charge of 10%. Withdrawals are processed within 72 hours
                  </p>
                  <div className="flex justify-between mt-4">
                  
                    <button
                      type="submit"
                      className="w-full p-2 bg-gray-800 hover:bg-gray-900 border text-white rounded ml-2"
                      onClick={handleSaveChanges}
                    >
                      {loading ? <Spinner /> : "Send Withdrawal Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    {compuntConfirmation && (<CompoundConfirmation  isclose= {()=>setCompuntConfirmation(false)} id={auth?.id} />)}
    </>
  );
}

