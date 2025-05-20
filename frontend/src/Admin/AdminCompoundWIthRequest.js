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
  getAllWithdrawal,
  deleteWithdrawal,
  clearErrors,
  clearMessage,
  updateCompoundWithdrawal,
} from "../redux/withdrawalSlice";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import { getAllUsers } from "../redux/userSlice";

export default function AdminCompoundWIthRequest() {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableWithdrawal, setEditableWithdrawal] = useState(null);
  const [allWithdrawalRequest, setAllWithdrawalRequest] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterquery, setFilterquery] = useState();
  const [values, setValues] = useState();

  const { allwithdrawal, loading, error, message } = useSelector(
    (state) => state.allwithdrawal
  );
  const { allusers } = useSelector((state) => state.allusers);

  useEffect(() => {
    dispatch(getAllWithdrawal());
    setAllWithdrawalRequest(allwithdrawal);
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

  const handleSearch = (e) => {
    setAllWithdrawalRequest(
      allwithdrawal?.filter((p) => p.email?.includes(e.target.value))
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
    setEditableWithdrawal(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableWithdrawal(null);
  };

  const handleChange = (e) => {
    setValues(e.target.value);
  };

  const handleSaveChange = (id) => {
    if (editableWithdrawal) {
      dispatch(
        updateCompoundWithdrawal({
          id: id,
          status: values,
          amount: editableWithdrawal?.amount+editableWithdrawal?.deduction,
          user_id: editableWithdrawal?.user_id,
        })
      );
      setEditMode(false);
      setEditableWithdrawal(null);
    }
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];
    return `${formattedDate} - ${formattedTime}`;
  };
  return (
    <div className="bg-gray-900 ">
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
          className="block w-[50vh] px-2 py-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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
    className="block w-[50vh] px-2 py-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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
          <table className="mt-6 w-full whitespace-nowrap text-left border-collapse">
  <thead className="border-b border-gray-300 text-lg leading-6 text-white bg-gray-800">
    <tr>
      <th className="py-3 px-4 font-semibold border-r border-gray-300">Name</th>
      <th className="py-3 px-4 font-semibold border-r border-gray-300">Amount</th>
      <th className="py-3 px-4 font-semibold border-r border-gray-300">
                    Deduction
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-gray-300">
                    Total
                  </th>
      <th className="py-3 px-4 text-right font-semibold border-r border-gray-300">Status</th>
      <th className="py-3 px-4 font-semibold border-r border-gray-300">Request/Action</th>
      <th className="py-3 px-4 font-semibold">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-300">
    {(searchQuery ? allWithdrawalRequest : allwithdrawal)?.filter((item)=>(item?.type=="compound"   && (filterquery ? item?.status === filterquery : true)))?.map((item, index) => (
      <tr key={index} className="border-b border-gray-200">
        <td className="py-4 px-4 border-r border-gray-200">
          <Link to={`/admin/check/profile/${item?.userby_id}`} className="truncate text-lg font-medium text-white">
            {allusers?.find((user) => user?.id === item?.user_id)?.email}
          </Link>
        </td>
        <td className="py-4 px-4 border-r border-gray-200">
          <div className="font-mono text-lg text-gray-400">${item?.amount}</div>
        </td>
        <td className="py-4 px-4 border-r border-gray-200">
                        <div className="font-mono text-lg text-gray-400">
                          ${item?.deduction}
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="font-mono text-lg text-gray-400">
                          ${item?.amount + item?.deduction}
                        </div>
                      </td>
        <td className="py-4 px-4 text-right border-r border-gray-200">
          <div className="rounded bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-300">
            {editMode && editableWithdrawal?.id === item?.id ? (
              <select
                id="status"
                name="status"
                className="border-0 px-3 py-1 bg-gray-200 rounded-sm text-lg text-gray-600 shadow focus:outline-none w-full"
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
        <td className="py-4 px-4 border-r border-gray-200">
          <div className="rounded bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-300">
          {formatDateTime(item?.createdAT)}/ {formatDateTime(item?.acceptat)}
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex space-x-4">
            <Link to={`/admin/check/profile/${item?.user_id}`}>
              <FaEye className="h-4 w-4 text-green-700 cursor-pointer" />
            </Link>
            {editMode && editableWithdrawal?.id === item?.id ? (
              <>
                <FaCheck
                  className="h-4 w-4 text-green-700 cursor-pointer"
                  onClick={() => handleSaveChange(item?.id)}
                />
                <FaTimes
                  className="h-4 w-4 text-red-700 cursor-pointer"
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <>
                  {(item?.status == "decline" || item?.status == "complete") ?(""): (
                              <GrEdit
                                className="h-4 w-4 text-blue-400 cursor-pointer"
                                onClick={() => handleEdit(item)}
                              />)}
                <AiFillDelete
                  className="h-4 w-4 text-red-400 cursor-pointer"
                  onClick={() => handleDelete(item?.id)}
                />
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
      </div>

      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteWithdrawal}
          id={deleteID}
        />
      )}
    </div>
  );
}
