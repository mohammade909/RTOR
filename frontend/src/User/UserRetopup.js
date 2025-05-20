import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import { AiFillDelete } from "react-icons/ai";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import {
  deleteTopup,
  getAllTopupByid,
  clearErrors,
  clearMessage,
} from "../redux/topupSlice";
import { getAllPlans } from "../redux/planSlice";
import UserRetopupModel from "./UserRetopupModel";

export default function UserRetopup() {
  const dispatch = useDispatch();
  const { singletopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { auth } = useSelector((state) => state.auth);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);

  useEffect(() => {
    dispatch(getAllPlans());
    if (auth?.id) {
      dispatch(getAllTopupByid(auth?.id));
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
  }, [dispatch, error, message]);

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
  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />
      <div className=" ">
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0  animate-gradient-x"></div>
          <div className="m-0.5 rounded-md p-4 relative  border border-gray-200 shadow-md z-10">
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:space-y-0 space-y-4 gap-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-pink-600 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 ">
                    Transaction History
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Manage your account top-ups and transfers
                  </p>
                </div>
              </div>
              <div>
              <div className=" flex gap-2">
                <div className="relative flex-grow md:max-w-full max-w-xs">
                  <input
                    className="w-full bg-gray-100 border py-2.5 text-sm pl-12 pr-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Search transactions..."
                  />
                  <div className="absolute top-2.5 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenModel(true)}
                  className="group relative overflow-hidden rounded-md bg-blue-600 px-4 py-2 font-semibold"
                >
                  <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-blue-600 to-yellow-600 transition-transform duration-300 group-hover:translate-y-0"></span>
                  <span className="relative flex items-center justify-center text-sm">
                    Top-Up
                  </span>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" overflow-hidden ">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 border-b border-blue-500">
                  <tr className="text-gray-100 text-sm">
                    <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {singletopup
                    ?.slice()
                    .reverse()
                    .map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-yellow-100 font-bold">
                              {item?.userto_email?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium ">
                                {item?.userto_email}
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
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        item?.status === "Completed"
                          ? "bg-yellow-100 text-yellow-800"
                          : item?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                          >
                            {item?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-sm ">
                          {item?.createdAT}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteTopup}
          id={deleteID}
        />
      )}
      {openModel && (
        <UserRetopupModel openModel={openModel} modelClose={modelClose} />
      )}
    </>
  );
}
