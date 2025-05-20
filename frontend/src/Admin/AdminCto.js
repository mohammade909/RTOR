import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { CiDollar } from "react-icons/ci";
import {
  getctoList,
  checkCto,
  deleteCto,
  clearErrors,
  clearMessage,
} from "../redux/ctoSlice";
import PayctoModel from "./PayctoModel";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../BaseFile/comman/Loader";
import { Confirmation } from "../BaseFile/comman/Confirmation";
const AdminCto = () => {
  const dispatch = useDispatch();
  const { allcto, loading, message, error } = useSelector((state) => state.cto);
  const [deleteID, setDeleteID] = useState();
  const [payId, setPayId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);


  useEffect(() => {
    dispatch(getctoList());
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
  const handlePay = (id) => {
    setPayId(id);
    setOpenModel(true);
  };
  const isClose = () => {
    setModalOpen(false);
  };

  return (
    <>
         {message && <SuccessAlert message={message} />}
         {error && <ErrorAlert error={error} />}
      <div className="p-4 mt-4 text-gray-900 bg-gradient-to-bl from-red-300 via-fuchsia-300 to-pink-300">
        <div className="flex items-center justify-between w-full pl-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold ">
              Pyemnt Settings Detail
            </h3>
            <p className="text-lg ">
              Overview of the Cto History.
            </p>
          
          </div>
          <div className="flex justify-center gap-3 ml-3">
          <button className="px-5 py-2 text-white rounded-sm bg-green-800/50 hover:bg-green-800" onClick={()=>dispatch(checkCto())}>
              CheckCto
            </button>
            <div className="relative flex items-center w-full max-w-sm gap-5">
              <div className="relative">
                <input
                  className="w-full h-10 py-2 pl-3 text-lg transition duration-200 border rounded shadow-sm pr-11 placeholder:text-slate-900 text-slate-200 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md"
                  placeholder="Search for invoice..."
                />
                <button
                  className="absolute flex items-center w-8 h-8 px-2 my-auto rounded right-1 top-1"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-900"
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

        <div className={`${loading ? "h-[260px] items-center" : "h-full"}`}>
          {loading ? (
            <Loader />
          ) : (
            <div className="">
              <div className="flow-root ">
                <div className="overflow-x-auto ">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-2">
                    <h1 className="text-xl font-medium ">
                    Cto List History
                    </h1>
                    <table className="z-10 w-full mt-6 text-left whitespace-nowrap">
                      <thead className="text-lg leading-6 border-b border-white/10">
                        <tr>
                          <th
                            scope="col"
                            className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                          >
                            Paid
                          </th>
                          <th
                            scope="col"
                            className="py-2 pl-0 pr-4 font-semibold text-right sm:pr-8 sm:text-left lg:pr-20"
                          >
                            Gift
                          </th>
                          <th
                            scope="col"
                            className="py-2 pl-0 pr-4 font-semibold text-right sm:pr-8 sm:text-left lg:pr-20"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="py-2 pl-0 pr-4 font-semibold text-right sm:pr-8 sm:text-left lg:pr-20"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="py-2 pl-0 pr-4 font-semibold text-right sm:pr-8 sm:text-left lg:pr-20"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="py-2 pl-0 pr-4 font-semibold text-right sm:pr-8 sm:text-left lg:pr-20"
                          >
                            Monthly
                          </th>
                          <th
                            scope="col"
                            className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-3 "
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                      {allcto?.map((item,index)=>(
                          <tr key={index}>
                            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                              <div className="">
                                <div className="font-mono text-lg leading-6 ">
                                  {item?.username}
                                </div>
                              </div>
                            </td>
                            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                              <div className="">
                                <div className="font-mono text-lg leading-6 ">
                                  {item?.useremail}
                                </div>
                              </div>
                            </td>{" "}
                            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                              <div className="">
                                <div className="font-mono text-lg leading-6 ">
                                  {item?.paid}
                                </div>
                              </div>
                            </td>
                              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                                <div className="">
                                  <div className="font-mono text-lg leading-6 ">
                                    {item?.gift}
                                  </div>
                                </div>
                              </td>
                              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                                <div className="">
                                  <div className="font-mono text-lg leading-6 ">
                                    {item?.status}
                                  </div>
                                </div>
                              </td>
                              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                                <div className="">
                                  <div className="font-mono text-lg leading-6 ">
                                    {item?.category}
                                  </div>
                                </div>
                              </td>
                            <td className="hidden py-4 pl-0 pr-4 sm:table-cell">
                              <div className="">
                                <div className="px-2 py-1 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
                                  {item?.amount}
                                </div>
                              </div>
                            </td>
                            <td className="hidden py-4 pl-0 pr-4 sm:table-cell">
                              <div className="">
                                <div className="px-2 py-1 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
                                  {item?.monthly_amount}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pl-0 pr-4 text-lg leading-6 text-right sm:table-cell sm:pr-3">
                              <div className="z-0 flex space-x-4">
                                <>
                                  <AiFillDelete
                                    className="w-4 h-4 text-red-400 cursor-pointer"
                                    onClick={() => handleDelete(item?.id)}
                                    title="Delete"
                                  />
                                  <CiDollar
                                    className="w-4 h-4 text-red-400 cursor-pointer"
                                    onClick={() => handlePay(item?.id)}
                                    title="Pay"
                                  />
                                </>
                              </div>
                            </td>
                          </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {modalOpen && (
          <Confirmation
            isClose={isClose}
            deletefunction={deleteCto}
            id={deleteID}
          />
        )}
        {openModel && (
          <PayctoModel
          openModel={openModel}
            isClose={()=>setOpenModel(false)}
            payid={payId}
          />
        )}
      
      </div>
    </>
  );
};

export default AdminCto;
