import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUserbyemail } from "../redux/userSlice";
import { getAllPlans } from "../redux/planSlice";

import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { addTopup ,clearErrors, clearMessage} from "../redux/topupSlice";
export default function UserRetopupModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { allplans } = useSelector((state) => state.allplans);
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.alltopup);
  const [values, setValues] = useState({});
  const [userby, setUserby] = useState();
  const [amount, setAmount] = useState();
  const [plan, setPlan] = useState();


  useEffect(() => {
    dispatch(getAllPlans());

    if (userby && userby !== auth?.email) {
      dispatch(getUserbyemail(userby));
    }
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
  }, [dispatch, error, message,auth?.id,userby]);


  const handleSaveChanges = (e) => {
    if (amount < plan?.min && plan?.id==2) {
      alert(
        `Amount must be greater than 50`
      );
      return;
    }
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      const allValues = {
        userby_id: auth?.id,
        id: plan?.id,
        amount: plan?.id==1 ? 20 : amount,
        userto_id: auth?.id,

      };
      console.log(allValues)
      dispatch(addTopup({ values: allValues }));
      modelClose();
    } else {
      form.reportValidity();
    }
  };

  return (
    <>
    {message && <SuccessAlert message={message} />}
    {error && <ErrorAlert error={error} />}
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg border bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="p-5">
                <div className="py-4 flex justify-between items-center">
                  <h2 className="text-xl  font-semibold mb-5 text-gray-300 ">
                    ReTop-Up form
                  </h2>
                  <button onClick={modelClose}>
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
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-300">
                        Plan
                      </label>

                      <select
                        name="id"
                        className="mt-1 block w-full  p-2 bg-gray-800 border-gray-300 text-gray-300 rounded-md shadow-sm  "
                        onChange={(e) => {
                          const selectedPlan =
                            allplans[e.target.selectedIndex - 1];
                          setPlan(selectedPlan);
                        }}
                        required
                      >
                        <option value="">Select a plan</option>
                        {allplans?.filter((item)=>item?.name!=="entry bot")?.map((plan, index) => (
                          <option key={index} value={plan.id}>
                            {plan.name} - ${plan.monthly_price} Activation Plan
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-300">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={amount}
                        required
                        disabled={plan?.id==1 ? true:false}
                         min="50"
                        step="50"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-800 text-gray-300"
                        placeholder="Enter your Amount . . ."
                        onChange={(e) => setAmount( e.target.value)}
                      />
                    </div>
                    <div className=" flex justify-center items-center pb-4">
                      <button
                        type="submit"
                        className="w-full py-2  mt-6 bg-gray-800 hover:bg-gray-900 border  text-white rounded "
                        onClick={handleSaveChanges}
                      >
                        {loading ? <Spinner /> : "TopUp"}
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
    </>
  );
}
