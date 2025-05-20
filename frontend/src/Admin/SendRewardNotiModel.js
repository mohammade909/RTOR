import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { rewardNotification, clearErrors, clearMessage } from "../redux/userSlice";

export default function SendRewardNotiModel({ userId,isClose}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("active");
  const [amount, setAmount] = useState();
  const { loading ,error,message} = useSelector((state) => state.allusers);

  const handleSaveChanges = (e) => {

    const updatedData={userId,title,amount}
    dispatch(rewardNotification(updatedData));
    isClose();
  };
  return (
    <>
      <Dialog open={open} onClose={isClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-auto md:min-h-screen mt-20 md:mt-0 items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl capitalize">Send Reward Notification</h2>
                
              </div>
              <form
                action="#"
                method="POST"
                className="mx-auto mt-4 max-w-xl sm:mt-4"
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 ">
                  <div>
                      <label
                        htmlFor="title"
                        className="block text-lg font-semibold leading-6 text-gray-300"
                      >
                        Title
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="title"
                          name="title"
                          type="text"
                          onChange={(e) => setTitle(e.target.value)}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-300 bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                        />
                        
                      </div>
                    </div>
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-lg font-semibold leading-6 text-gray-300"
                    >
                      Amount
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        onChange={(e)=>setAmount(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-300 bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                      />
                    </div>
                  </div>
                 

                </div>
                <div className="mt-6">
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      onClick={handleSaveChanges}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={isClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      {loading ? <Spinner /> : "Cancel"}
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
