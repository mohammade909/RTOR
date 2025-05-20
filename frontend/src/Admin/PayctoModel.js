import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { payToCto,  clearErrors, clearMessage,} from "../redux/ctoSlice";
export default function PayctoModel({openModel, isClose, payid }) {
    console.log(payid)
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.cto);
  const [amount, setAmount] = useState(0);
  const [gift, setGift] = useState(null);

  useEffect(() => {
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


  const handleSaveChanges = (e) => {
    e.preventDefault();
      const allValues = {
        id: payid,
        amount: amount,
        gift:gift,
      };
      dispatch(payToCto({ values: allValues }));
      isClose()
  };

  return (
    <Dialog open={openModel} onClose={isClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-black border px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="p-5">
                <div className="py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-5 text-gray-300 ">
                    Pay to cto
                  </h2>
                  <button onClick={isClose}>
                  <div class="group flex  cursor-pointer items-center justify-center mb-2 ">
                    <div class="space-y-2">
                      <span class="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                      <span class="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                    </div>
                  </div>
                  </button>
                </div>
                <form className="">
              <div className=" w-full ">
                
         
                <div className="mb-4 ">
                  <label className="block text-lg font-medium text-gray-300">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-300 bg-gray-800 px-3 py-2"
                    placeholder="Type user E-Mail . . ."
                    onChange={(e)=>setAmount(e.target.value)}

                  />
                </div>
                <div className="mb-4 ">
                  <label className="block text-lg font-medium text-gray-300">
                    Gift
                  </label>
                  <input
                    type="text"
                    name="gift"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-300 bg-gray-800 px-3 py-2"
                    placeholder="Type Gift detail . . ."
                    onChange={(e)=>setGift(e.target.value)}

                  />
                </div>
                <div className=" flex justify-center items-center pb-4 ">
                  <button
                    type="submit"
                    onClick={handleSaveChanges}
                    className="px-4 py-2 rounded text-white focus:outline-none w-full mt-3 border bg-gray-800 hover:bg-gray-900"
                  >
                    {loading ? <Spinner /> : "Pay"}
                  </button>
                </div>
              </div>
            </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
