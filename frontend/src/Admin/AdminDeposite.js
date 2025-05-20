import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import Loader from "../BaseFile/comman/Loader";
import { useParams } from "react-router-dom";
import {
  getAllDeposite,
  deleteDeposite,
  clearErrors,
  clearMessage,
  updateDeposite,
} from "../redux/depositeSlice";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import { getAllUsers } from "../redux/userSlice";

export default function AdminDeposite() {
  const { action } = useParams();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableDeposite, setEditableDeposite] = useState(null);
  const [allDeposite, setAllDeposite] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterquery, setFilterquery] = useState();
  const [values, setValues] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  const { alldeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );
  const { allusers } = useSelector((state) => state.allusers);
  useEffect(() => {
    dispatch(getAllDeposite());
    setAllDeposite(alldeposite);
    dispatch(getAllUsers());

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

  useEffect(()=>{
    if(action){
      setFilterquery(action)
    }
  },[action])

  const handleSearch = (e) => {
    setAllDeposite(
      alldeposite?.filter((p) => toString(p?.amount).includes(e.target.value))
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
    setEditableDeposite(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableDeposite(null);
  };

  const handleChange = (e) => {
    setValues(e.target.value);
  };

  const handleSaveChange = (id) => {
    if (editableDeposite) {
      dispatch(
        updateDeposite({
          id: id,
          status: values,
          amount: editableDeposite?.amount,
          user_id: editableDeposite?.user_id,
        })
      );
      setEditMode(false);
      setEditableDeposite(null);
    }
  };

  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];
    return `${formattedDate} - ${formattedTime}`;
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white">
          <div className="px-4 pt-5 md:px-8">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              id="search"
              name="search"
              value={searchQuery}
              onChange={handleSearch}
              type="number"
              placeholder="Search amount here..."
              className="block w-full md:w-[50vh] px-2 py-1 rounded-md border border-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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
          <div className="flow-root mt-4">
            {message && <SuccessAlert message={message} />}
            {error && <ErrorAlert error={error} />}
            <div className="overflow-x-auto">
            <table className="z-10 w-full mt-6 text-left border-collapse">
  <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
    <tr>
      <th scope="col" className="py-2 pl-2 font-semibold border-r border-gray-300">Name</th>
      <th scope="col" className="py-2 pl-2 font-semibold border-r border-gray-300">Amount</th>
      <th scope="col" className="py-2 pl-2 font-semibold border-r border-gray-300">Status</th>
      <th scope="col" className="py-2 pl-2 font-semibold border-r border-gray-300">Receipt</th>
      <th scope="col" className="py-2 pl-2 font-semibold border-r border-gray-300">Request</th>
      <th scope="col" className="py-2 pl-2 font-semibold">Actions</th>
    </tr>
  </thead>
  <tbody className="text-lg text-gray-700 divide-y divide-gray-300">
    {(searchQuery ? allDeposite : alldeposite)?.filter((item)=>( filterquery ? item?.status === filterquery : true))?.slice()
      .reverse()
      .map((item, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="py-4 pl-2 border-r border-gray-200">
            <Link
              to={`/admin/check/profile/${item?._id}`}
              className="text-lg font-medium leading-6 truncate"
            >
              {allusers?.find((user) => user?.id === item?.user_id)?.email}
            </Link>
          </td>
          <td className="py-4 pl-2 border-r border-gray-200">
            <div className="font-mono text-lg ">${item?.amount}</div>
          </td>
          <td className="py-4 pl-2 border-r border-gray-200">
            {editMode && editableDeposite?.id === item?.id ? (
              <select
                className="w-full px-3 py-1 text-lg bg-gray-200 border-0 rounded-sm"
                onChange={handleChange}
                defaultValue={item?.status}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="decline">Decline</option>
                <option value="complete">Complete</option>
              </select>
            ) : (
              <div className="px-2 py-1 text-xs rounded-md t ">
                {item?.status}
              </div>
            )}
          </td>
          <td className="py-4 pl-2 border-r border-gray-200">
            {item?.image_name && (
              <button
                onClick={() => handleImageClick(item?.image_name)}
                className="text-blue-400 hover:underline"
              >
                {item?.image_name?.slice(0, 10)}
              </button>
            )}
          </td>
          <td className="py-4 pl-2 pr-4 border-r border-gray-200 sm:table-cell sm:pr-8">
            <div className="px-2 py-1 text-xs font-medium rounded-md ">
          {formatDateTime(item?.createdAT)} /
          {formatDateTime(item?.acceptat)}

            </div>
          </td>
          <td className="py-4 pl-2">
            <div className="flex items-center space-x-2">
              {editMode && editableDeposite?.id === item?.id ? (
                <>
                  <FaCheck
                    className="w-4 h-4 text-green-700 cursor-pointer"
                    onClick={() => handleSaveChange(item?.id)}
                  />
                  <FaTimes
                    className="w-4 h-4 text-red-700 cursor-pointer"
                    onClick={handleCancelEdit}
                  />
                </>
              ) : (
                <>
                  <AiFillDelete
                    className="w-4 h-4 text-red-400 cursor-pointer"
                    onClick={() => handleDelete(item?.id)}
                  />
                  <GrEdit
                    className="w-4 h-4 text-blue-400 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  />
                </>
              )}
              <Link to={`/user/profile/${item?.user_id}`}>
                <FaEye className="w-4 h-4 text-green-700 cursor-pointer" />
              </Link>
            </div>
          </td>
        </tr>
      ))}
  </tbody>
</table>

            </div>
          </div>
          {previewImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="object-contain max-w-full max-h-screen"
                />
                <button
                  onClick={handleClosePreview}
                  className="absolute p-2 text-xl text-white bg-black rounded-full top-2 right-2"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {modalOpen && (
            <Confirmation
              isClose={isClose}
              id={deleteID}
              deletefunction={deleteDeposite}
            />
          )}
        </div>
      )}
    </>
  );
}
