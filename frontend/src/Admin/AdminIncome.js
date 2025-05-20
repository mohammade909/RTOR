import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { useParams } from "react-router-dom";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import Loader from "../BaseFile/comman/Loader";
import { TbBinaryTree } from "react-icons/tb";
import {
  getAllUsers,
  clearErrors,
  deleteUsers,
  clearMessage,
} from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

// Main component
export default function AdminIncome() {
  const { action } = useParams(); // Get any params (if needed for actions)
  const dispatch = useDispatch();

  // Redux state
  const { allusers, loading, error, message } = useSelector(
    (state) => state.allusers
  );

  // Local state for search and modal management
  const [allUser, setAllUser] = useState(allusers);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [deleteID, setdeleteID] = useState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set number of items per page

  // IconContainer helper component for uniformity in icon rendering
  const IconContainer = ({ children }) => (
    <div className="relative z-0 flex items-center justify-center">{children}</div>
  );

  // Fetch data and handle errors/messages on component mount
  useEffect(() => {
    dispatch(getAllUsers());
    setAllUser(allusers);

    // Clear error after 3 seconds
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }

    // Clear success message after 3 seconds
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  // Handle user search
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setAllUser(
      allusers?.filter((p) => p.username?.toLowerCase().includes(searchTerm))
    );
    setSearchQuery(e.target.value);
  };

  // Pagination Calculation
  const totalPages = Math.ceil((searchQuery ? allUser : allusers)?.length / itemsPerPage);
  const currentUsers = (searchQuery ? allUser : allusers)?.slice(
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

  // Modal close function
  function isClose() {
    setModalopen(false);
  }

  // Handle delete action
  function handleDelete(id) {
    setdeleteID(id);
    if (deleteID) {
      console.log(id);
      setModalopen(true);
    }
  }

  console.log(allusers); // Debugging log

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4">
      {/* Search Input */}
      <div className="px-2 pt-5">
        <label htmlFor="email" className="sr-only">Search</label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="search here . . ."
          className="block w-[50vh] px-2 py-2 rounded-md border border-gray-300 text-gray-800 bg-white  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>

      {/* Display Success or Error Alerts */}
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      {/* Table or Loader */}
      <div className={` ${loading ? "h-[560px] items-center" : "h-full"}`}>
        {loading ? (
          <Loader />
        ) : (
          <div className="flow-root mt-4">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full border-collapse divide-y divide-gray-700">
                  {/* Table Headings */}
                  <thead className="text-base leading-6 bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300 ">
                    <tr>
                      <th scope="col" className="px-4 py-2 font-medium text-left border-r ">Name</th>
                      <th scope="col" className="px-4 py-2 font-medium text-left border-r  sm:table-cell">Active Plan</th>
                      <th scope="col" className="px-4 py-2 font-medium text-left border-r  sm:table-cell">Salary</th>
                      <th scope="col" className="px-4 py-2 font-medium text-right border-r  sm:text-left">Trade</th>
                      <th scope="col" className="px-4 py-2 font-medium text-right border-r  sm:text-left">Level Day / Total</th>
                      <th scope="col" className="px-4 py-2 font-medium text-right border-r  sm:text-left">Reward</th>
                      <th scope="col" className="px-4 py-2 font-medium text-center">Tree</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="text-center divide-y bg-white divide-gray-600">
                    {currentUsers?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-600 text-gray-800 even:bg-[#c7c7c7b3] even:text:white">
                        <td className="px-4 py-4  text-base font-medium text-left  border-r border-gray-600">
                          <div className="w-full truncate">{item?.email}</div>
                        </td>
                        <td className="px-4 py-4 text-base  border-r border-gray-600">
                          {item?.active_plan} 
                        </td>
                        <td className="px-4 py-4 text-base text-right    border-r border-gray-600">
                          {item?.total_salary}
                        </td>
                        <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                          {item?.roi_income_day} / {item?.roi_income}
                        </td>
                        <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                          {item?.level_month_day} / {item?.level_month}
                        </td>
                        <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                          {item?.reward}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link to={`/admin/refferal/${item?.refferal_code}`}>
                            <IconContainer>
                              <TbBinaryTree className="w-4 h-4 cursor-pointer" title="details" />
                            </IconContainer>
                          </Link>
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
        <div className="text-lg ">
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

      {/* Delete Confirmation Modal */}
      {modalopen && (
        <Confirmation isClose={isClose} deletefunction={deleteUsers} id={deleteID} />
      )}
    </div>
  );
}
