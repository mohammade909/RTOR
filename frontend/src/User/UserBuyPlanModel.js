import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { getUserbyemail } from "../redux/userSlice";
import { addTopup,  clearErrors, clearMessage,} from "../redux/topupSlice";
export default function UserBuyPlanModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { allplans } = useSelector((state) => state.allplans);
  const { emailuser } = useSelector((state) => state.allusers);
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.alltopup);
  const [values, setValues] = useState({});
  const [userby, setUserby] = useState();

  useEffect(() => {
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
}, [dispatch, error, message ,auth?.id,userby]);




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
        userby_id: auth?.id,
        userto_id: emailuser?.id,
      };
      console.log(allValues);
      dispatch(addTopup({ values: allValues }));
      modelClose()
    } else {
      form.reportValidity();
    }
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="p-5">
                <div className="py-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    Top-Up form
                  </h2>
                </div>
                <form className="flex justify-between">
              <div className="flex w-full gap-8 justify-gap-around">
                <div className="w-1/4 mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    User
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="type user E-Mail . . ."
                    onChange={(e) => setUserby(e.target.value)}
                  />
                  <p
                    className={
                      emailuser?.username ? "text-green-500" : "text-red-500"
                    }
                  >
                    {emailuser?.username
                      ? emailuser.username
                      : "Provide user email"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Plan
                  </label>

                    <select
                      name="id"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a plan</option>
                      {allplans?.map((plan, index) => (
                        <option key={index} value={plan.id}>
                          {plan.name} - ${plan.monthly_price} Activation Plan
                        </option>
                      ))}
                    </select>
                </div>

                <div className="flex items-center justify-center pb-4 ">
                  <button
                    type="submit"
                    disabled={!emailuser} // Disable if emailuser is falsy
                    onClick={handleSaveChanges}
                    className={`px-4 py-2 rounded text-white focus:outline-none ${
                      emailuser
                        ? "bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600" // Styles for the enabled state
                        : "bg-gray-400 cursor-not-allowed" // Styles for the disabled state
                    }`}
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
  );
}
