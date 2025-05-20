import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { useParams } from "react-router-dom";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { RiLoginCircleFill } from "react-icons/ri";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import Loader from "../BaseFile/comman/Loader";
import { FaArrowAltCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { loginUser } from "../redux/authSlice";
import { getAllUsers, deleteUsers } from "../redux/userSlice";
import { clearErrors, clearMessage } from "../redux/withdrawalSlice";
import AdminCashHandle from "./AdminCashHandle";
import { useDispatch, useSelector } from "react-redux";

export default function AdminUserList() {
  const { action } = useParams();
  const dispatch = useDispatch();
  const { allusers, loading } = useSelector((state) => state.allusers);
  const { message, error } = useSelector((state) => state.allwithdrawal);
  const { admin } = useSelector((state) => state.auth);
  const [allUser, setAllUser] = useState(allusers);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPlanQuery, setSearchPlanQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [deleteID, setdeleteID] = useState();
  const [cashHandle, setCashHandle] = useState(null);
  const [userId, setUserId] = useState();
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [profitWallet, setProfitWallet] = useState(null);
  const [roi, setROI] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [paginatedUsers, setPaginatedUser] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  useEffect(() => {
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

  useEffect(() => {
    if (action === "all") {
      setAllUser(allusers);
    } else {
      setAllUser(
        allusers?.filter((p) => p.is_active === action || p.status === action)
      );
    }
  }, [action, allusers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const filteredUsers = allUser
      ?.filter((item) => item.role === "user")
      ?.filter(
        (item) =>
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) || // Ensure case-insensitive matching
          item.username.toLowerCase().includes(searchQuery.toLowerCase()) || // Ensure case-insensitive matching
          item.active_plan >= searchQuery // Ensure strict equality for active_plan
      );

    // Calculate the total number of pages
    const calculatedTotalPages = Math.ceil(
      filteredUsers?.length / itemsPerPage
    );
    setTotalPages(calculatedTotalPages);

    // Slice the filtered users for pagination based on the currentPage
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers?.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    setPaginatedUser(paginatedUsers);
  }, [searchQuery, allUser, currentPage, itemsPerPage]); // Correct dependencies

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchQuery(searchTerm);
  };

  const handleDelete = (id) => {
    setdeleteID(id);
    setModalopen(true);
  };

  const handleCash = (action, item) => {
    setCashHandle(action);
    setName(item?.username);
    setUserId(item?.id);
    setProfitWallet(
      Number(item?.level_month) +
        Number(item?.direct_income) +
        Number(item?.salary) +
        Number(item?.reward)
    );
    setBalance(item?.business);
    setROI(item?.roi_income);
  };

  const handleSession = (item) => {
    const values = { email: item.email, password: item.password };
    dispatch(loginUser(values));
    window.open("/user/dashboard", "_blank");
  };

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4 ">
      <div className="pt-5">
        <label htmlFor="email" className="sr-only">
          Search using email
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="search here . . ."
          className="block w-full px-2 py-2 text-gray-800 border-gray-300 bg-white border rounded-md shadow-sm md:max-w-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>

      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      <div className={` ${loading ? "h-[560px] items-center" : "h-full"}`}>
        {loading ? (
          <Loader isLoading={loading} />
        ) : (
          <div className="flow-root mt-4">
            <div className="overflow-x-auto">
              <div className="py-2">
                <table className="w-full border border-gray-300 divide-y divide-gray-700">
                  <thead className="text-base leading-6 border-b border-white/10 bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
                    <tr>
                      <th className="px-2 ml-4 font-medium text-left border border-gray-300">
                        S.No
                      </th>
                      <th className="px-2 ml-4 text-left font-medium border border-gray-300">
                        E-mail
                      </th>
                      <th className="px-2 py-4 text-center font-medium border border-gray-300">
                        Wallet
                      </th>
                      <th className="px-2 py-4 text-center font-medium border border-gray-300">
                        A-Wallet
                      </th>
                      <th className="px-2 py-4 text-center font-medium border border-gray-300">
                        Account Status
                      </th>
                      <th className="px-2 py-4 text-center font-medium border border-gray-300">
                        Package Status
                      </th>
                      <th className="px-2 py-4 text-center border border-gray-300">
                        Created at
                      </th>
                      <th className="px-2 py-4 text-center border border-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 divide-y divide-white/5 bg-white">
                    {paginatedUsers?.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors duration-200 text-gray-800 even:bg-[#ccccccb3]"
                      >
                        <td className="px-4 py-4 text-center border border-gray-300">
                          <div className="text-lg ">
                            {(currentPage - 1) * 50 + index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left border border-gray-300">
                          <div className="justify-center tems-center gap-x-4">
                            <div className="w-full text-lg font-medium leading-6 truncate">
                              {item?.email}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    item?.refferal_code || ""
                                  );
                                  alert("Copied to clipboard!");
                                }}
                                className="focus:outline-none text-white bg-indigo-600 ml-1 px-4 py-[2px] rounded-full text-[10px]"
                              >
                                {item?.refferal_code}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 border border-gray-300">
                          <div className="flex justify-between">
                            <button
                              onClick={() => handleCash("credit", item)}
                              className="p-2 transition-all duration-200 bg-green-600 rounded hover:bg-green-500"
                            >
                              <FaArrowAltCircleUp />
                            </button>
                            <div>${item?.business}</div>

                            <button
                              onClick={() => handleCash("debit", item)}
                              className="p-2 transition-all duration-200 bg-red-600 rounded hover:bg-red-500"
                            >
                              <FaArrowCircleDown />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border border-gray-300">
                          <div className="text-lg ">{item?.active_plan}</div>
                        </td>
                        <td className="px-4 py-4 text-center border border-gray-300">
                          {item?.status === "block" ? (
                            <div className="flex items-center gap-2 ">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-800" />
                              Blocked
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 ">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-800" />
                              Unblocked
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center border border-gray-300">
                          {item?.is_active === "active" ? (
                            <div className="flex items-center gap-2 ">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-800" />
                              Activated
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 ">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-800" />
                              Not Activated
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center border border-gray-300">
                          <div className="text-lg ">
                            {new Date(item?.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border border-gray-300">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => handleSession(item)}>
                              <RiLoginCircleFill className="text-green-600" />
                            </button>
                            <Link to={`/admin/check/profile/${item?.id}`}>
                              <GrView className="text-indigo-600" />
                            </Link>
                            {/* <button onClick={() => handleDelete(item?.id)}>
                              <AiFillDelete className="text-red-600" />
                            </button> */}
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

      {modalopen && (
        <Confirmation
          isClose={() => setModalopen(false)}
          deletefunction={deleteUsers}
          id={deleteID}
        />
      )}
      {cashHandle && (
        <AdminCashHandle
          HandleCashmodel={() => setCashHandle(null)}
          cashHandle={cashHandle}
          userId={userId}
          name={name}
          balance={balance}
          profitWallet={profitWallet}
          roi={roi}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between py-4">
        <button
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 text-lg text-white bg-green-600 rounded"
        >
          Previous
        </button>
        <div className="text-lg text-white">
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
