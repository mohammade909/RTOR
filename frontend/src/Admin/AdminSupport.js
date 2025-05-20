import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import {
  getAllSupport,
  deleteSupport,
  clearErrors,
  clearMessage,
  updateSupport,
} from "../redux/supportSlice";
import { Confirmation } from "../BaseFile/comman/Confirmation";

export default function AdminSupport() {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableSupport, setEditableSupport] = useState(null);
  const [allSupportMessage, setAllSupportMessage] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { allsupport, loading, error, message } = useSelector(
    (state) => state.allsupport
  );

  useEffect(() => {
    dispatch(getAllSupport());
    setAllSupportMessage(allsupport);

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
  }, [dispatch, error, message, allsupport]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page when searching
    setAllSupportMessage(
      allsupport?.filter((p) =>
        p.email?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };

  const handleEdit = (item) => {
    setEditableSupport(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableSupport(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChange = (id) => {
    if (editableSupport) {
      dispatch(updateSupport({ id: id, updatedData: values }));
      setEditMode(false);
      setEditableSupport(null);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = (searchQuery ? allSupportMessage : allsupport)?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (searchQuery ? allSupportMessage : allsupport)?.length / itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4">
      <div className="pt-5 ">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="search here . . ."
          className="block w-full max-w-lg px-2 py-1 text-gray-100 bg-white border border-gray-300  rounded-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>

      <div className="flow-root mt-8">
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full text-left border-collapse table-auto whitespace-nowrap">
              <thead className="text-base leading-6 border-r border-gray-100 bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
                <tr>
                  <th className="py-2 pl-4 font-medium border border-gray-400 sm:pl-6 lg:pl-8">ID</th>
                  <th className="py-2 pl-2 pr-4 font-medium border border-gray-400 sm:table-cell sm:pr-8">Email</th>
                  <th className="py-2 pl-2 pr-4 font-medium text-left border border-gray-400 sm:pr-8">Title</th>
                  <th className="py-2 pl-2 pr-4 font-medium text-left border border-gray-400 sm:pr-8">Message</th>
                  <th className="py-2 pl-2 pr-4 font-medium text-left border border-gray-400 sm:pr-8">Status</th>
                  <th className="py-2 pl-2 pr-4 font-medium text-left border border-gray-400 sm:pr-8">Date</th>
                  <th className="py-2 pl-2 pr-4 font-medium border border-gray-400 sm:table-cell sm:pr-6 lg:pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="border bg-white  border-gray-400 divide-y divide-gray-700">
                {currentData?.map((item, index) => (
                  <tr key={index} className="text-gray-800">
                    <td className="py-4 pl-4 border-r border-gray-400 sm:pl-6 lg:pl-8 text-gray-800 even:bg-[#dededeb3]">
                      <div className="text-lg font-medium ">{item?.id}</div>
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400 sm:table-cell sm:pr-8">
                      <div className="text-lg ">{item?.email}</div>
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400 sm:pr-8">
                      <div className="text-lg ">{item?.title}</div>
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400 sm:pr-8">
                      <div className="text-lg ">{item?.message}</div>
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400 sm:pr-8">
                      {editMode && editableSupport?.id === item?.id ? (
                        <select
                          id="status"
                          name="status"
                          className="block w-full px-3 py-1 text-base bg-gray-200 border-0 rounded-sm shadow focus:outline-none"
                          onChange={handleChange}
                          defaultValue={item?.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="inprogress">In Progress</option>
                          <option value="decline">Decline</option>
                          <option value="complete">Complete</option>
                        </select>
                      ) : (
                        <div className="text-lg ">{item?.status}</div>
                      )}
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400 sm:pr-8">
                      <div className="text-lg ">{new Date(item?.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 pl-2 pr-4 border-r border-gray-400">
                      <div className="flex justify-start space-x-4">
                        <Link to={`/user/profile/${item?.user_id}`}>
                          <FaEye className="w-4 h-4 text-green-700 cursor-pointer" title="View Profile" />
                        </Link>
                        {editMode && editableSupport?.id === item?.id ? (
                          <>
                            <FaCheck className="w-4 h-4 text-green-700 cursor-pointer" onClick={() => handleSaveChange(item?.id)} title="Submit Changes" />
                            <FaTimes className="w-4 h-4 text-red-700 cursor-pointer" onClick={handleCancelEdit} title="Cancel" />
                          </>
                        ) : (
                          <>
                            <AiFillDelete className="w-4 h-4 text-red-300 cursor-pointer" onClick={() => handleDelete(item?.id)} title="Delete" />
                            <GrEdit className="w-4 h-4 text-blue-300 cursor-pointer" onClick={() => handleEdit(item)} title="Edit" />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-between py-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-5 py-1 text-base rounded-md ${
              currentPage === 1
                ? "bg-green-700 text-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-5 py-1 text-base rounded-md ${
              currentPage === totalPages
                ? "bg-green-700 text-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteSupport}
          id={deleteID}
        />
      )}
    </div>
  );
}
