import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../BaseFile/comman/Loader";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { AiFillDelete } from "react-icons/ai";
import {
  getAllAchivers,
  deleteAchivers,
  clearErrors,
  clearMessage,
} from "../redux/achiversSlice";
import AddAchiversModel from "./AddAchiversModel";

const AdminAchiver = () => {
  const dispatch = useDispatch();
  const { allachivers, loading, error, message } = useSelector((state) => state.achivers);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getAllAchivers());
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
  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/achivers/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
{message && <SuccessAlert message={message} />}
{error && <ErrorAlert error={error} />}
<div className="my-5 lg:mx-3 sm:mx-3 p-4 ">
  <div className="flex-col items-center justify-between w-full mb-3 lg:flex sm:flex sm:flex-row lg:pl-3 sm:pl-3">
    <div className="mb-2 sm:mb-0">
      <h3 className="text-lg font-semibold text-gray-800">Achivers</h3>
      <p className="text-lg text-gray-800">Overview of the Achivers.</p>
    </div>
    <div className="w-full lg:ml-3 sm:ml-3 sm:w-auto">
      <div className="relative flex max-w-full gap-2 sm:gap-5 sm:max-w-sm">
        <div className="relative flex-grow">
          <input
            className="w-full h-10 py-2 pl-3 text-lg transition text-gray-800 bg-white duration-200 border border-gray-300 rounded shadow-sm pr-11 placeholder:text-slate-400  ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md"
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
        <button
          type="button"
          onClick={() => setOpenModel(true)}
          className="block px-5 py-2 text-lg font-semibold text-center text-gray-100 bg-[#2a84ec] rounded-md shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add
        </button>
      </div>
    </div>
  </div>

  <div className="relative flex flex-col w-full h-full py-1 mb-4 rounded-lg shadow-md bg-clip-border">
    {loading ? (
      <Loader />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border table-auto min-w-max text-gray-100 bg-black">
          <thead>
            <tr>
              <th className="p-2 border-b md:p-4 border-slate-700 ">
                <p className="text-xs font-normal leading-none md:text-base">Name</p>
              </th>
              <th className="p-2 border-b md:p-4 border-slate-700 ">
                <p className="text-xs font-normal leading-none md:text-base">Description</p>
              </th>
              <th className="p-2 border-b md:p-4 border-slate-700 ">
                <p className="text-xs font-normal leading-none md:text-base">Recipt</p>
              </th>
              <th className="p-2 border-b md:p-4 border-slate-700 ">
                <p className="text-xs font-normal leading-none md:text-base">Request</p>
              </th>
              <th className="p-2 border-b md:p-4 border-slate-700 ">
                <p className="text-xs font-normal leading-none md:text-base">Action</p>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white ">
            {allachivers?.slice().reverse().map((item, index) => (
              <tr key={index}  className="text-gray-800 even:bg-[#c8c8c8b3] ">
                <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap md:py-4 md:text-base">
                  ${item?.username}
                </td>
                <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap md:py-4 md:text-base">
                  {item?.description}
                </td>
                <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap md:py-4 md:text-base">
                  <div className="flex items-center space-x-2">
                    {item?.image && (
                      <button
                        onClick={() => handleImageClick(item?.image)}
                        className="text-blue-400 hover:underline"
                      >
                        {item?.image?.slice(0, 10)}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap md:py-4 md:text-base">
                  {item?.created_at}
                </td>
                <td className="px-3 py-2 text-xs text-gray-300 cursor-pointer whitespace-nowrap md:py-4 md:text-base">
                  <AiFillDelete onClick={()=>handleDelete(item?.id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

{previewImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4b1725ab] bg-opacity-70">
    <div className="relative">
      <img
        src={previewImage}
        alt="Preview"
        className="max-w-[600px] max-h-[500px] object-contain"
      />
      <button
        onClick={handleClosePreview}
        className="absolute p-2 text-xl text-white bg-[#4b1725ab] rounded-full top-2 right-2"
      >
        ×
      </button>
    </div>
  </div>
)}

{modalOpen && (
  <Confirmation isClose={isClose} deletefunction={deleteAchivers} id={deleteID} />
)}

{openModel && (
  <AddAchiversModel openModel={openModel} modelClose={modelClose} />
)}


    </>
  );
};

export default AdminAchiver;
