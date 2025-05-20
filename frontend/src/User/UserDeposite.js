import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../BaseFile/comman/Loader";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { getQrLink } from "../redux/qrSlice";
import { AiFillDelete } from "react-icons/ai";
import {
  getAllDepositeByid,
  deleteDeposite,
  clearErrors,
  clearMessage,
} from "../redux/depositeSlice";
import UserDepositeModel from "./UserDepositeModel";
import WalletConnection from "./WalletConnection";
import DepositForm from "./DepositForm";
// import USDTransactions from "./UserUSDTransacations";

const UserDepostie = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singleDeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getQrLink());
    dispatch(getAllDepositeByid(auth?.id));
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
  }, [dispatch, error, message, auth?.id]);

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };

  function modelClose() {
    setOpenModel(false);
  }
  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />
      <div className=" ">
        <DepositForm transactions={singleDeposite} user={auth} />
        <div className="flex-col my-4">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-700">
              Deposit History
            </h3>
            <p className="text-sm text-gray-700">
              Overview of the Deposit History.
            </p>
          </div>
          <div className="w-full mt-3">
            <div className="relative flex max-w-full gap-2">
              <div className="relative flex-grow w-full">
                <input
                  className="w-full h-10 py-2 pl-3 text-sm transition duration-200 border rounded shadow-sm bg-white pr-11 placeholder:text-slate-400 text-slate-400 border-slate-300 ease focus:outline-none focus:border-slate-400  focus:shadow-md"
                  placeholder="Search for invoice..."
                />
                <button
                  className="absolute flex items-center w-8 h-8 px-2 my-auto bg-gray-300 rounded right-1 top-1"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-auto rounded-xl shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-auto border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      SR
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      Request Date
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {singleDeposite?.length > 0 ? (
                    singleDeposite
                      ?.slice()
                      .reverse()
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-150 hover:bg-blue-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                              #{index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10">
                                <div className="flex items-center justify-center w-full h-full bg-blue-100 rounded-full">
                                  <span className="font-medium text-blue-600">
                                    {item?.email?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              ${item?.amount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full 
                      ${
                        item?.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : item?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                            >
                              {item?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {item?.createdAT ? (
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {new Date(item?.createdAT).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(item?.createdAT).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <button
                              className={`px-4 py-2 rounded-md text-white transition-all 
                        ${
                          item?.status === "pending"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                              disabled={item?.status !== "pending"}
                            >
                              {item?.status === "pending"
                                ? "Accept"
                                : "Completed"}
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No deposits found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            There are currently no deposit requests available.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="object-contain max-w-full max-h-screen"
            />
            <button
              onClick={handleClosePreview}
              className="absolute p-2 text-xl text-white bg-black rounded-full top-2 right-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteDeposite}
          id={deleteID}
        />
      )}

      {openModel && (
        <UserDepositeModel openModel={openModel} modelClose={modelClose} />
      )}
    </>
  );
};

export default UserDepostie;
