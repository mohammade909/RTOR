import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import Loader from "../BaseFile/comman/Loader";
import {
  getTransactionById,
  clearErrors,
  clearMessage,
} from "../redux/transactionSlice";

export default function TradeTransactions() {
  const table_name = "roi_transaction";
  const fit = "Invest";
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { transaction, loading, error, message } = useSelector(
    (state) => state.transaction
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const entriesPerPage = 20;

  // Fetch transactions on component mount
  useEffect(() => {
    if (table_name && auth?.id) {
      dispatch(getTransactionById({ table_name, user_id: auth.id }));
    }
  }, [dispatch, table_name, auth?.id]);

  // Handle error and message cleanup
  useEffect(() => {
    let errorInterval, messageInterval;

    if (error) {
      errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
    }

    if (message) {
      messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
    }

    return () => {
      if (errorInterval) clearInterval(errorInterval);
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [error, message, dispatch]);

  // Get unique transaction types for filtering tabs
  const transactionTypes = useMemo(() => {
    if (!transaction?.length) return [];
    const types = new Set();

    transaction.forEach((item) => {
      const type =
        table_name === "invest_level_transaction"
          ? item?.type
          : table_name.split("_")[0];

      if (type) types.add(type.toLowerCase());
    });

    return Array.from(types);
  }, [transaction, table_name]);

  // Process and filter transactions based on search and active tab
  const processedTransactions = useMemo(() => {
    if (!transaction?.length) return [];

    let filteredData = [...transaction].reverse();

    // Apply filter by URL parameter if provided
    // if (fit) {
    //   filteredData = filteredData.filter((item) =>
    //     item?.type?.toLowerCase().includes(fit.toLowerCase())
    //   );
    // }

    // Apply active tab filter
    if (activeTab !== "all") {
      filteredData = filteredData.filter((item) => {
        const itemType =
          table_name === "invest_level_transaction"
            ? item?.type
            : table_name.split("_")[0];
        return itemType?.toLowerCase() === activeTab.toLowerCase();
      });
    }

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filteredData;
  }, [transaction, fit, searchTerm, activeTab, table_name]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(processedTransactions.length / entriesPerPage)
  );
  const currentTransactions = useMemo(() => {
    return processedTransactions.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );
  }, [processedTransactions, currentPage, entriesPerPage]);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Format currency value
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get transaction type and status indicators
  const getTransactionTypeClass = (item) => {
    const type =
      table_name === "invest_level_transaction"
        ? item?.type?.toLowerCase()
        : table_name.split("_")[0].toLowerCase();

    const typeClasses = {
      deposit: "bg-green-100 text-green-800",
      withdraw: "bg-red-100 text-red-800",
      reward: "bg-purple-100 text-purple-800",
      referral: "bg-blue-100 text-blue-800",
      // roi: "bg-indigo-100 text-indigo-800",
      roi: "bg-amber-100 text-amber-800",
      default: "bg-gray-100 text-gray-800",
      // roi: "bg-gray-100 text-gray-800",
    };

    return typeClasses[type] || typeClasses.default;
  };

  const noDataAvailable = !loading && currentTransactions.length === 0;
 

  return (
    <div className="border border-gray-200 p-4 rounded-md bg-white">
      {/* Header Section */}
      <div className="lg:flex flex-col space-y-4 lg:space-y-0 justify-between items-center mb-6 sm:flex-row">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-800">Trade Transactions </h3>
          <p className="text-slate-700 mt-1">
            Track all your financial activities
          </p>
        </div>
        <div className="lg:flex justify-end space-y-4 lg:space-y-0 gap-4">
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pr-10 pl-5 w-full lg:w-72 h-10 text-sm text-slate-700 bg-white/90 backdrop-blur-sm rounded-md shadow-inner border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Search transactions..."
          />
          <button className="absolute top-2.5 right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-500 text-white/80 hover:bg-blue-600"
            }`}
          >
            All Transactions
          </button>

          {transactionTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                activeTab === type
                  ? "bg-blue-600 text-white shadow-lg"
        : "bg-blue-500 text-white/80 hover:bg-blue-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
        </div>
      </div>

      {/* Filter Tabs */}
     

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Transactions</p>
              <h4 className="text-2xl font-bold text-white">
                {transaction?.length || 0}
              </h4>
            </div>
            <div className="bg-blue-400/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4  rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Earned</p>
              <h4 className="text-2xl font-bold text-white">
                {formatCurrency(
                  transaction?.reduce(
                    (acc, item) => acc + (parseFloat(item.amount) || 0),
                    0
                  ) || 0
                )}
              </h4>
            </div>
            <div className="bg-green-400/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4  rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Latest Transaction</p>
              <h4 className="text-2xl font-bold text-white">
                {transaction && transaction.length > 0
                  ? formatCurrency(transaction[transaction.length - 1]?.amount)
                  : "$0.00"}
              </h4>
            </div>
            <div className="bg-purple-400/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4  rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Filtered Results</p>
              <h4 className="text-2xl font-bold text-white">
                {processedTransactions.length}
              </h4>
            </div>
            <div className="bg-amber-400/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-md shadow-sm bg-white/5 backdrop-blur-sm border border-white/10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
                <tr className="border-b border-slate-700">
                  <th className="p-4 text-slate-100 font-medium">No.</th>
                  <th className="p-4 text-slate-100 font-medium">Amount</th>
                  <th className="p-4 text-slate-100 font-medium">Type</th>
                  <th className="p-4 text-slate-100 font-medium">On Amount</th>
                  <th className="p-4 text-slate-100 font-medium">percent</th>
                  <th className="p-4 text-slate-100 font-medium">Created By</th>
                  <th className="p-4 text-slate-100 font-medium">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {noDataAvailable ? (
                  <tr>
                    <td
                      colSpan={
                        table_name !== "reward_transaction" &&
                        table_name !== "cto_transaction"
                          ? table_name !== "cto_transaction"
                            ? 7
                            : 6
                          : table_name !== "cto_transaction"
                          ? 5
                          : 4
                      }
                      className="py-16 text-center text-slate-800"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-slate-500 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg">No transactions found</p>
                        <p className="text-slate-500 mt-2">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700/50 transition-all hover:bg-slate-700/20"
                    >
                      <td className="p-4 text-slate-800">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            item.tr_type == "debit"
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {item.tr_type == "debit"
                            ? ` -${formatCurrency(item?.amount)} `
                            : ` +${formatCurrency(item?.amount)} `}
                           </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-1 py-1  capitalize rounded-full text-xs font-medium ${getTransactionTypeClass(
                            item
                          )}`}
                        >
                          Rent 
                        </span>
                      </td>

                      <td className="p-4 text-slate-800">
                        ${item?.onamount ? `${item.onamount}` : "—"}
                      </td>
                      <td className="p-4 text-slate-800">
                        {item?.percent}%
                      </td>

                      <td className="p-4 text-slate-800">
                        {item.transaction_by}
                      </td>
                      <td className="p-4 text-slate-800">
                        {formatDate(item?.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {!loading && processedTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-slate-800">
            Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
            {Math.min(
              currentPage * entriesPerPage,
              processedTransactions.length
            )}{" "}
            of {processedTransactions.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? "bg-slate-700 text-slate-100 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageToShow)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      currentPage === pageToShow
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700/50 text-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-500 px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-800 hover:bg-slate-700 transition-all"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? "bg-slate-700 text-slate-100 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
