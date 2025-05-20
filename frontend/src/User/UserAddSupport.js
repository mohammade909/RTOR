import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { AiFillDelete } from "react-icons/ai";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import { clearErrors, clearMessage } from "../redux/supportSlice";
import { getSingleSupport, deleteSupport } from "../redux/supportSlice";
import UserSupportModel from "./UserSupportModel";
export default function UserAddSupport() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singlesupport, loading, error, message } = useSelector(
    (state) => state.allsupport
  );
  const [allSupportMessage, setAllSupportMessage] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModel, setOpenModel] = useState(null);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getSingleSupport(auth?.id));
      setAllSupportMessage(singlesupport);
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
  }, [dispatch, error, message, auth?.id]);

  const handleSearch = (e) => {
    setAllSupportMessage(
      singlesupport?.filter((p) => p.email?.includes(e.target.value))
    );
    setSearchQuery(e.target.value);
  };

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
<div className="my-3 p-4 relative z-10 border border-gray-300 bg-white">
{/* <div className="absolute inset-0 bg-black opacity-20"></div> */}
  <div className="flex-col  w-full mb-3 ">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 ">Get Support</h3>
      <p className="text-lg text-slate-700">Overview of the current Support.</p>
    </div>
    <div className=" flex flex-col items-start gap-3 mt-3 md:mt-0 md:flex-row md:items-center">
      <div className="relative w-full ">
        <input
           className="w-full h-10 py-2 pl-3 text-lg transition duration-200 border rounded shadow-sm text-gray-800 bg-white pr-11 placeholder:text-slate-400  border-slate-400 ease focus:outline-none focus:border-slate-400 focus:shadow-md"
          placeholder="Search..."
        />
        <button
          className="absolute flex items-center justify-center w-8 h-8 text-gray-900 rounded right-1 top-1"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-5 h-5 text-gray-700"
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
        className="w-full px-3 py-2 text-lg font-semibold text-center text-gray-100 bg-[#2f7060f1] rounded shadow-sm md:w-auto hover:bg-blue-900 focus:outline-none"
      >
        Support
      </button>
    </div>
  </div>

  <div className="relative flex flex-col w-full h-full mb-4 overflow-x-auto text-gray-200 shadow-md bg-clip-border">
    <table className="w-full min-w-full text-left border table-auto ">
      <thead className="text-gray-300  bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
        <tr>
          <th className="p-4 text-base font-medium leading-none border-b border-slate-200">ID</th>
          <th className="p-4 text-base font-medium leading-none border-b border-slate-200">Email</th>
          <th className="p-4 text-base font-medium leading-none border-b border-slate-200">Title</th>
          <th className="p-4 text-base font-medium leading-none border-b e border-slate-200">Message</th>
          <th className="p-4 text-base font-medium leading-none text-center border-b border-slate-200">Send At</th>
          {/* <th className="w-16 p-4 text-base font-normal leading-none text-center text-white border-b border-slate-200">Action</th> */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {allSupportMessage?.length > 0 ? (
        allSupportMessage?.map((item, index) => (
          <tr key={index} className="text-gray-800 even:bg-[#eeeeeeb3] even:text:white">
            <td className="py-4 pl-4 pr-3 text-base font-medium whitespace-nowrap">{item?.id}</td>
            <td className="px-3 py-4 text-base whitespace-nowrap">{item?.email}</td>
            <td className="px-3 py-4 text-base whitespace-nowrap">{item?.title}</td>
            <td className="px-3 py-4 text-base whitespace-nowrap">{item?.message}</td>
            <td className="px-3 py-4 text-base text-center whitespace-nowrap">{item?.createdAt
                            ? new Date(item?.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}</td>
            {/* <td className="px-3 py-4 text-base text-center text-gray-400 whitespace-nowrap">
             
            </td> */}
          </tr>
        )) ): (
          <tr>
              <td
                colSpan={6} 
                className="py-4 text-base font-medium text-center  whitespace-nowrap text-gray-800 "
              >
                No data available
              </td>
            </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

{modalOpen && (
  <Confirmation
    isClose={isClose}
    deletefunction={deleteSupport}
    id={deleteID}
  />
)}
{openModel && (
  <UserSupportModel openModel={openModel} modelClose={modelClose} />
)}

    </>
  );
}
