import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import { AiFillDelete } from "react-icons/ai";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import UserEntryFeeConfirmation from "./UserEntryFeeConfirmation";

import {
  getAllTopupByid,
  deleteTopup,
  clearErrors,
  clearMessage,
} from "../redux/topupSlice";
import { getAllPlans } from "../redux/planSlice";
import UserRetopupModel from "./UserRetopupModel";
import { getUser } from "../redux/userSlice";

export default function UserRetopup() {
  const dispatch = useDispatch();
  const { singletopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { auth } = useSelector((state) => state.auth);
  const { singleuser } = useSelector((state) => state.allusers);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);
  const [entryPlanModel, setEntryPlanModel] = useState(false);
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
      dispatch(getAllTopupByid(auth?.id));
      dispatch(getUser(auth?.id));
    }
    dispatch(getAllPlans());
  },[,auth?.id])

  const isClose = () => {
    setModalOpen(false);
    setEntryPlanModel(false)

  };

  function modelClose(){
    setOpenModel(false)
  }  
  function handleEntryPlan(){
    setEntryPlanModel(true)
  }

  return (
    <>
    {message && <SuccessAlert message={message} />}
    {error && <ErrorAlert error={error} />}
    <Loader isLoading={loading}/>
<div className="mx-5 sm:mx-2 px-2 my-5">
 <div className="w-full lg:flex flex-col md:flex-row justify-between items-center mb-3">
   <div>
     <h3 className="text-lg font-semibold text-gray-200">Top-Up History</h3>
     <p className="text-slate-200 text-lg">Overview of the Top-Up History.</p>
   </div>
   <div className="mt-3 md:mt-0 flex  items-start md:items-center gap-3">
     <div className="relative w-full md:w-72">
       <input
         className="bg-blue-900/50 w-full pr-11 h-10 pl-3 py-2  placeholder:text-slate-200 text-slate-200 text-lg border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-200 hover:border-slate-200 shadow-sm focus:shadow-md"
         placeholder="Search for invoice..."
       />
       <button
         className="absolute h-8 w-8 right-1 top-1 flex  justify-center items-center bg-blue-900 rounded"
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
       ReTop-Up
     </button>
   </div>
 </div>

 <div className="relative flex flex-col w-full h-full text-gray-300  border shadow-md rounded-lg bg-clip-border overflow-x-auto">
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
             <p className="text-lg font-normal leading-none text-white">Request</p>
           </th>
         </tr>
       </thead>
       <tbody className="bg-green-900/50">
         {
           singletopup?.length > 0 ? (
         singletopup
           ?.slice()
           .reverse()
           .filter((item) => item?.userto_id === item?.userby_id)
           .map((item, index) => (
             <tr key={index} className="even:bg-red-900/50  even:text:white text-gray-300">
               <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium text-gray-300 sm:pl-3">
                 {item?.userto_email}
               </td>
               <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-300">
                 ${item?.amount}
               </td>
               <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-300">
                 {item?.status}
               </td>
               <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-300">
                 {item?.createdAT
                           ? new Date(item?.createdAT).toLocaleDateString(
                               "en-US",
                               {
                                 year: "numeric",
                                 month: "short",
                                 day: "numeric",
                               }
                             )
                           : "N/A"}

               </td>
             </tr>
           ))):
           ( <tr>
             <td
               colSpan={6} 
               className="whitespace-nowrap py-4 text-center text-lg font-medium text-gray-300 bg-amber-900"
             >
               No data available
             </td>
           </tr>
           )}
       </tbody>
     </table>
   )}
 </div>
</div>

{modalOpen && (
 <Confirmation isClose={isClose} deletefunction={deleteTopup} id={deleteID} />
)}

{openModel && (
 <UserRetopupModel openModel={openModel} modelClose={modelClose} />
)}
{entryPlanModel && (
       <UserEntryFeeConfirmation
         isclose={isClose}
         user_id={auth?.id}
       />
     )}
   </>
  );
}
