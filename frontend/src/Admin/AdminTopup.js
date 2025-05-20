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
  getAllTopup,
  deleteTopup,
  clearErrors,
  clearMessage,
  updateTopup,
} from "../redux/topupSlice";
import { getAllUsers } from "../redux/userSlice";
import { Confirmation } from "../BaseFile/comman/Confirmation";

export default function AdminTopup() {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableTopup, setEditableTopup] = useState(null);
  const [allTopup, setallTopup] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [filterquery, setFilterquery] = useState();
  const { alltopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { allusers } = useSelector((state) => state.allusers);

  useEffect(() => {
    dispatch(getAllTopup());
    dispatch(getAllUsers());
    setallTopup(alltopup);
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

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setallTopup(
      alltopup?.filter((p) => p.amount?.includes(e.target.value))
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

  const handleEdit = (item) => {
    setEditableTopup(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableTopup(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChange = (id) => {
    if (editableTopup) {
      dispatch(updateTopup({ id: id, updatedData: values }));
      setEditMode(false);
      setEditableTopup(null);
    }
  };

  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="bg-white">
      <div className="px-8 pt-5">
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
          className="block w-[50vh] px-2 py-1 rounded-md border border-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>
      <div className="px-8 pt-5">
  <label htmlFor="filterquery" className="sr-only">
    Filter
  </label>
  <select
    id="filterquery"
    name="filterquery"
    value={filterquery}
    onChange={(e) => setFilterquery(e.target.value)}
    className="block w-[50vh] px-2 py-1 rounded-md border border-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
  >
    <option value="" disabled>
      Select status...
    </option>
    <option value="complete">Complete</option>
    <option value="decline">Decline</option>
    <option value="pending">Pending</option>
    <option value="TRN-ADM002">By Admin</option>
  </select>
</div>
      <div className="mt-4 flow-root">
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
          <table className="z-10 mt-6 w-full whitespace-nowrap text-left border border-gray-700">
  <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
    <tr>
      <th scope="col" className="py-2 pl-4 font-semibold sm:pl-6 lg:pl-8 border border-gray-700">
        ID
      </th>
      <th scope="col" className="hidden py-2 pl-2 pr-8 font-semibold sm:table-cell border border-gray-700">
        Topup By
      </th>
      <th scope="col" className="py-2 pl-2 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20 border border-gray-700">
        Topup To
      </th>
      <th scope="col" className="py-2 pl-2 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20 border border-gray-700">
        Amount
      </th>
      <th scope="col" className="py-2 pl-2 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20 border border-gray-700">
        Status
      </th>
     
      <th scope="col" className="py-2 pl-2 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20 border border-gray-700">
        Created At
      </th>
      <th scope="col" className="hidden py-2 pl-2 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8 border border-gray-700">
        Action
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-white/5">
    {(searchQuery ? allTopup : alltopup)?.filter((item)=> (filterquery ? item?.status === filterquery : true))?.map((item, index) => (
      <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
        <td className="py-4 pl-4 sm:pl-6 lg:pl-8 border border-gray-700">
          <div className="flex items-center">
            <div className="truncate text-lg font-medium leading-6 text-gray-800">
              {item?.id}
            </div>
          </div>
        </td>
        <td className="hidden py-4 pl-2 pr-4 sm:table-cell sm:pr-8 border border-gray-700">
          <div className="font-mono cursor-pointer text-lg leading-6 text-gray-800">
            <Link to={`/admin/check/profile/${item?.userby_id}`}>
              {allusers?.find((user) => user?.id === item?.userby_id)?.username}
            </Link>
          </div>
        </td>
        <td className="hidden py-4 pl-2 pr-4 sm:table-cell sm:pr-8 border border-gray-700">
          <div className="font-mono cursor-pointer text-lg leading-6 text-gray-800">
            <Link to={`/admin/check/profile/${item?.userto_id}`}>
              {allusers?.find((user) => user?.id === item?.userto_id)?.username}
            </Link>
          </div>
        </td>
        <td className="hidden py-4 pl-2 pr-4 sm:table-cell sm:pr-8 border border-gray-700">
          <div className="font-mono text-lg leading-6 text-gray-800">
            ${item?.amount}
          </div>
        </td>
        <td className="hidden py-4 pl-2 pr-4 sm:table-cell sm:pr-8 border border-gray-700">
          <div className="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 ring-1 ring-inset ring-white/10">
            {editMode && editableTopup && editableTopup.id === item?.id ? (
              <select
                id="status"
                name="status"
                className="border-0 px-3 py-1 text-gray-800 bg-gray-200 rounded-sm text-lg shadow focus:outline-none w-full"
                onChange={handleChange}
                defaultValue={item?.status}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="decline">Decline</option>
                <option value="complete">Complete</option>
              </select>
            ) : (
              item?.status
            )}
          </div>
        </td>
       
        <td className="hidden py-4 pl-2 pr-4 sm:table-cell sm:pr-6 lg:pr-8 border border-gray-700">
          <div className="text-lg font-mono text-gray-800">
          {new Date(item?.createdAT).toLocaleDateString()}

          </div>
        </td>
        <td className="py-4 pl-2 pr-4 sm:pr-8 border border-gray-700">
          <div className="flex items-center justify-end space-x-2">
            {editMode && editableTopup && editableTopup.id === item?.id ? (
              <>
                <button
                  onClick={() => handleSaveChange(item?.id)}
                  className="rounded-full bg-green-700 p-1 text-white hover:bg-green-500 focus:outline-none"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="rounded-full bg-red-700 p-1 text-white hover:bg-red-500 focus:outline-none"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-full bg-yellow-400 p-1 text-black hover:bg-yellow-200 focus:outline-none"
                >
                  <GrEdit />
                </button>
                <button
                  onClick={() => handleDelete(item?.id)}
                  className="rounded-full bg-red-700 p-1 text-white hover:bg-red-500 focus:outline-none"
                >
                  <AiFillDelete />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

            {previewImage && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                <div className="relative">
                  <img src={previewImage} alt="Preview" className="max-h-[80vh] max-w-[80vw]" />
                  <button
                    onClick={handleClosePreview}
                    className="absolute top-2 right-2 rounded-full bg-red-700 p-2 text-white hover:bg-red-500 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalOpen && (
          <Confirmation
            isClose={isClose}
            deletefunction={deleteTopup}
            id={deleteID}
          />
       
      )}
   
    </div>
  );
}
