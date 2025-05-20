import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { addSupport, clearErrors, clearMessage } from "../redux/supportSlice";
export default function UserSupportModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.allsupport);
  const [values, setValues] = useState({});

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
      console.log(values);

      const allValues = {
        ...values,
        user_id: auth?.id,
      };
      dispatch(addSupport({ values: allValues }));
      modelClose();
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
          className="relative transform overflow-hidden rounded-lg text-gray-100 bg-[#0f1b61a8] border px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          <div>
            <div className="p-2">
              <div className="">
                <h2 className="mb-5 text-xl font-semibold ">
                  Get Support
                </h2>
              </div>
              <form>
                <div className="grid grid-cols-1 gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="inline-block px-1 mb-1 text-sm font-medium "
                    >
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="E-Mail"
                      onChange={handleChange}
                      required
                      className="block w-full p-4 rounded-md text-gray-100 bg-[#7e66c5b3]  border-0 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300   focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                    />
                  </div>
                  <div className="w-full ">
                    <label
                      htmlFor="Title"
                      className="inline-block px-1 mb-1 text-sm font-medium "
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="title"
                      onChange={handleChange}
                      required
                      className="block w-full p-4 rounded-md border-0 py-2  text-gray-100 bg-[#7e66c5b3]   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300   focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                    />
                  </div>
                  <div className="w-full ">
                    <label
                      htmlFor="comment"
                      className="inline-block px-1 mb-1 text-sm font-medium "
                    >
                      Message
                    </label>
                    <div className="">
                      <textarea
                        id="message"
                        type="text"
                        name="message"
                        placeholder="message"
                        onChange={handleChange}
                        required
                        rows={3}
                        className="block w-full text-gray-100 bg-[#7e66c5b3]  p-4 rounded-md border-0 py-1.5   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300   focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-red-800 rounded hover:bg-red-900 focus:outline-none focus:bg-indigo-600"
                    onClick={modelClose}
                  >
                  Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-[#569182c7] rounded hover:bg-[#396d60c7] focus:outline-none focus:bg-indigo-600"
                    onClick={handleSaveChanges}
                  >
                    {loading ? <Spinner /> : "Submit"}
                  </button>
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
