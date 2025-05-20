import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import { AiFillDelete } from "react-icons/ai";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import TransferModel from "./TransferModel";

import {
  getTransferById,
  clearErrors,
  clearMessage,
} from "../redux/transferSlice";
import TopUpAnother from "./TopUpAnother";

export default function Transfer() {
  const dispatch = useDispatch();
  const { transfer, loading, error, message } = useSelector(
    (state) => state.transfer
  );
  const { auth } = useSelector((state) => state.auth);
  const [openModel, setOpenModel] = useState(null);
  const [openModel2, setOpenModel2] = useState(null);
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


  useEffect(()=>{
    if (auth?.id) {
      dispatch(getTransferById(auth?.id));
    }
  },[,auth?.id])

  function modelClose(){
    setOpenModel(false)
    setOpenModel2(false)
  }  


  return (
    <>
     {message && <SuccessAlert message={message} />}
     {error && <ErrorAlert error={error} />}

<div className="mx-5 sm:mx-2">
  <div className="w-full lg:flex flex-col md:flex-row justify-between items-center mb-3 lg:pl-3">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Transfer History</h3>
      <p className="text-slate-400 text-lg">Overview of the Transfer History.</p>
    </div>
    <div className="mt-3 md:mt-0 flex  items-start md:items-center gap-3">
      <div className="relative w-full md:w-72">
        <input
          className="bg-black w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-300 text-lg border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="Search for invoice..."
        />
        <button
          className="absolute h-8 w-8 right-1 top-1 flex items-center bg-gray-900 rounded"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-5 h-5 text-slate-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
      
      <button
        type="button"
        onClick={() => setOpenModel(true)}
        className="w-full md:w-auto bg-gray-800 px-3 py-2 text-center text-lg font-semibold text-white rounded shadow-sm hover:bg-rose-800 focus:outline-none"
      >
        Transfer Fund
      </button>
      <button
        type="button"
        onClick={() => setOpenModel2(true)}
        className="w-full md:w-auto bg-gray-800 px-3 py-2 text-center text-lg font-semibold text-white rounded shadow-sm hover:bg-rose-800 focus:outline-none"
      >
        TopUp Friend
      </button>
    </div>
  </div>

  <div className="relative flex flex-col w-full h-full text-gray-800  border shadow-md rounded-lg bg-clip-border overflow-x-auto">
    {loading ? (
      <Loader />
    ) : (
      <table className="w-full text-left table-auto min-w-full border ">
       <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
         <tr>
            <th className="p-4 border-b border-slate-200 ">
              <p className="text-lg font-normal leading-none text-white">E-Mail</p>
            </th>
            <th className="p-4 border-b border-slate-200 ">
              <p className="text-lg font-normal leading-none text-white">Amount</p>
            </th>
            <th className="p-4 border-b border-slate-200 ">
              <p className="text-lg font-normal leading-none text-white">Status</p>
            </th>
            <th className="p-4 border-b border-slate-200  w-56">
              <p className="text-lg font-normal leading-none text-white">Description</p>
            </th>
            <th className="p-4 border-b border-slate-200  w-56">
              <p className="text-lg font-normal leading-none text-white">At</p>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">

          {transfer?.map((item, index) => (
               <tr key={index} className=" text-gray-800">
               <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium text-gray-800 sm:pl-3">
                 {item?.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                  ${item?.amount}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                  {item?.status}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                  {item?.description}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                  {item?.created_at}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
</div>


{openModel && (
  <TransferModel openModel={openModel} modelClose={modelClose} />
)}

{openModel2 && (
  <TopUpAnother openModel={openModel2} modelClose={modelClose} />
)}
 
 
    </>
  );
}
