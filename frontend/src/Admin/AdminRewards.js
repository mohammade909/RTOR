import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import Loader from "../BaseFile/comman/Loader";
import { TbBinaryTree } from "react-icons/tb";
import { Dialog } from '@headlessui/react';
import {
  getAllRewards,
  clearErrors,
  clearMessage,
} from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AdminRewards() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { allrewards, loading, error, message } = useSelector(
    (state) => state.allusers
  );
  const [allUser, setAllUser] = useState(allrewards);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getAllRewards());
    setAllUser(allrewards);

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
  }, [dispatch, error, message, clearErrors, clearMessage]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setAllUser(
      allrewards?.filter((p) => p.username?.toLowerCase().includes(searchTerm))
    );
    setSearchQuery(e.target.value);
  };

  const totalPages = Math.ceil((searchQuery ? allUser : allrewards)?.length / itemsPerPage);
  const currentUsers = (searchQuery ? allUser : allrewards)?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    // dispatch(submitFormData(formData));
  };

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4 ">
      <div className="flex items-center justify-between ">
      <div className="">
        <label htmlFor="email" className="sr-only">
          Search
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="search here . . ."
          className="block w-[50vh] px-2 py-1 bg-white rounded-md border border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>
      <div>
      <button
        className="px-4 py-2 text-gray-100 rounded bg-[#8259fff5]"
        onClick={() => setIsOpen(true)}
      >
        Achiver
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-opacity-50 " />
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="w-full max-w-md p-6 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold ">Achiver form</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-lg font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="block w-full px-3 py-2 mt-1 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium ">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full p-2 mt-1 text-lg border border-gray-200 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-lg bg-gray-800 border rounded-md shadow-md shadow-blue-200 hover:bg-gray-900 "
                  
                >
                 Submit
                </button>
              </div>
            </form>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <button
              className="absolute text-gray-500 top-2 right-2"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      </Dialog>
    </div>
      </div>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      <div
        className={`flex justify-center ${
          loading ? "h-[560px] items-center" : "h-full"
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          <div className="flow-root w-full mt-4 bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full border divide-y divide-gray-700">
                  <thead className="text-base leading-6 border-b border-white/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-4 text-center border font-normal border-white/50"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-4 text-center border font-normal border-white/50"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-4 text-center border font-normal border-white/50"
                      >
                        Reward
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-4 text-center border font-normal border-white/50 sm:table-cell"
                      >
                        Reward Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white divide-white/5">
                    {(searchQuery ? allUser : currentUsers)?.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors duration-200 text-gray-800 even:bg-[#c0bfc0b3] "
                      >
                        <td className="px-4 py-4 text-center border border-white/50">
                          <div className="flex items-center justify-center gap-2">
                            {item?.username || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border border-white/50">
                          <div className="flex items-center justify-center gap-2">
                            {item?.email || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border border-white/50">
                          <div className="flex items-center justify-center gap-2">
                            {item?.reward || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border border-white/50 sm:table-cell">
                          <div className="flex items-center justify-center gap-2">
                            {item?.reward_level || "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between p-4">
        <button
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 text-lg text-white bg-indigo-600 rounded"
        >
          Previous
        </button>
        <div className="text-lg text-white ">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => handlePagination("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-lg text-white bg-indigo-600 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
