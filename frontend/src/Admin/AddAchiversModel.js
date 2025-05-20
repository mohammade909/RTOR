import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { addAchivers, clearErrors, clearMessage } from "../redux/achiversSlice";
export default function AddAchiversModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.achivers);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [userby, setUserby] = useState();

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


  const handleSubmit = (event) => {
    event.preventDefault();
    if (file == null) {
      window.alert("upload file");
      return;
    }
   
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("username", userby);
    dispatch(addAchivers(formData));
    modelClose();
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
            className="relative transform overflow-hidden rounded-lg text-gray-900 bg-gradient-to-bl from-red-300 via-fuchsia-300 to-pink-300 border px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="p-5">
                <div className="flex items-center justify-between py-4">
                  <h2 className="mb-5 text-xl font-semibold ">
                    Achivers form
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
                <div className="">
                  <div className="w-full">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-1">
                      <div className="mb-4 ">
                  <label className="block text-lg font-medium ">
                    User name
                  </label>
                  <input
                    type="text"
                    name="text"
                    className="block w-full px-3 py-2 mt-1 text-gray-900 border-gray-300 rounded-md shadow-sm"
                    placeholder="type user name . . ."
                    onChange={(e) => setUserby(e.target.value)}
                  />
                </div>

                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block text-lg font-medium "
                          >
                            description
                          </label>
                          <input
                            id="description"
                            type="text"
                            name="description"
                            className="block w-full px-3 py-2 mt-1 text-lg border-gray-300 rounded-md shadow-sm focus:ring-opacity-50"
                            placeholder="Type user description..."
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                          />
                        </div>
                        <div className="">
                          <div className="relative">
                            <input
                              id="file"
                              type="file"
                              name="image"
                              onChange={(e)=>setFile(e.target.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-4">
                        <button
                          type="button"
                          className="w-1/2 px-4 py-2 text-lg text-white bg-blue-500 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          onClick={() =>
                            document.getElementById("file").click()
                          }
                        >
                          Upload
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 px-4 py-2 text-lg text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                        >
                          {loading ? <Spinner /> : "Add"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
