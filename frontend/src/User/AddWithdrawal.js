import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CiSearch } from "react-icons/ci";
import {
  getAllWithdrawalByid,
  deleteWithdrawal,
  clearErrors,
  clearMessage,
} from "../redux/withdrawalSlice";
import { getUser } from "../redux/userSlice";

// Components
import Loader from "../BaseFile/comman/Loader";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import BebModal from "./BebModal";
import UserWithdrawalModel from "./UserWithdrawalModel";
import ROIWithdrawalConfirmation from "./ROIWithdrawalConfirmation";
import PrincipleWithdrawal from "./PrincipleWithdrawal";
import BalanceDetail from "./BalanceDetail";

export default function UserAddWithdrawal() {
  const dispatch = useDispatch();
  const { singleWithdrawal, loading, error, message } = useSelector(
    (state) => state.allwithdrawal
  );
  const { singleuser } = useSelector((state) => state.allusers);
  const { auth } = useSelector((state) => state.auth);

  // Local state
  const [deleteID, setDeleteID] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [bebModal, setBebModal] = useState(false);
  const [detail, setDetail] = useState(false);

  // Withdrawal modals
  const [openModel, setOpenModel] = useState(false);
  const [withdrawalROIModel, setWithdrawalROIModel] = useState(false);
  const [withdrawalPrincipleModel, setWithdrawalPrincipleModel] =
    useState(false);

  // Check for pending withdrawals
  const pendingWithdrawals = singleWithdrawal?.filter(
    (item) => item.status === "pending"
  );
  const hasPendingWithdrawals = pendingWithdrawals?.length > 0;

  useEffect(() => {
    // Load user data
    if (auth?.id) {
      dispatch(getUser(auth.id));
      dispatch(getAllWithdrawalByid(auth.id));
    }
  }, [auth?.id, dispatch]);

  useEffect(() => {
    // Handle errors and messages
    if (error) {
      const errorInterval = setInterval(() => {
        window.location.reload();
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }

    if (message) {
      const messageInterval = setInterval(() => {
        window.location.reload();
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  // Modal close handlers
  const handleBebClose = () => setBebModal(false);
  const isClose = () => {
    setModalOpen(false);
    setDetail(false);
  };

  const closeAllModals = () => {
    setOpenModel(false);
    setWithdrawalROIModel(false);
    setWithdrawalPrincipleModel(false);
  };

  // Wallet connection check and open appropriate modal
  const openWithdrawalModal = (type) => {
    if (hasPendingWithdrawals) {
      alert("You have pending withdrawal requests");
      return;
    }

    if (singleuser?.bep20 || singleuser?.trc20) {
      // Open the requested modal based on type
      if (type === "income") setOpenModel(true);
      else if (type === "roi") setWithdrawalROIModel(true);
      else if (type === "principle") setWithdrawalPrincipleModel(true);
    } else {
      setBebModal(true); // Open wallet connect modal
    }
  };

  // Filter withdrawals based on search term
  const filteredWithdrawals = singleWithdrawal?.filter(
    (item) =>
      item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gets status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-amber-700 bg-amber-100 rounded-full">
            <ClockIcon className="w-4 h-4" />
            <span>Pending</span>
          </span>
        );
      case "completed":
      case "approved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-green-700 bg-green-100 rounded-full">
            <CheckCircleIcon className="w-4 h-4" />
            <span>{status}</span>
          </span>
        );
      case "rejected":
      case "failed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-red-700 bg-red-100 rounded-full">
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Alerts and Loader */}
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />

      {/* Main Content */}
      <div className="m-3 p-6 bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Withdrawal Dashboard
          </h3>
          <p className="text-gray-500">
            Manage and track all your withdrawal requests in one place.
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              className="w-full h-10 pl-10 pr-4 text-sm transition duration-200 border rounded-md bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search withdrawals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
       
            <button
              onClick={() => openWithdrawalModal("income")}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <BanknotesIcon className="w-5 h-5 mr-2" />
              Income Wallet
            </button>

            <button
              onClick={() => openWithdrawalModal("roi")}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Rent Wallet
            </button>

            <button
             onClick={() => setWithdrawalPrincipleModel(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              Principal
            </button>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Request Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Processed On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : filteredWithdrawals?.length > 0 ? (
                  filteredWithdrawals
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item?.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(item?.amount + item?.deduction).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(item?.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                            {item?.createdAT}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {item?.type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item?.acceptat || "-"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-sm text-center text-gray-500"
                    >
                      No withdrawal requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteWithdrawal}
          id={deleteID}
        />
      )}
      {openModel && (
        <UserWithdrawalModel
          openModel={openModel}
          modelClose={closeAllModals}
        />
      )}
      {withdrawalROIModel && (
        <ROIWithdrawalConfirmation
          openModel={withdrawalROIModel}
          modelClose={closeAllModals}
          id={auth?.id}
        />
      )}
      {withdrawalPrincipleModel && (
        <PrincipleWithdrawal
          openModel={withdrawalPrincipleModel}
          modelClose={closeAllModals}
          id={auth?.id}
        />
      )}
      {bebModal && <BebModal handleBebClose={handleBebClose} />}
      {detail && (
        <BalanceDetail
          detail={singleuser?.business}
          detail2={singleuser?.wallet}
          isClose={isClose}
        />
      )}
    </>
  );
}
